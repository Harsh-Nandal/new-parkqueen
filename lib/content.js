import fs from 'fs'
import path from 'path'

const contentPath = path.join(process.cwd(), 'data/content.json')

function readJSON() {
  try {
    return JSON.parse(fs.readFileSync(contentPath, 'utf8'))
  } catch {
    return {}
  }
}

function writeJSON(data) {
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8')
}

// Try to import DB helpers — if they fail (no URI etc.) fall back to JSON file
let dbAvailable = false
let Content = null

async function tryLoadDB() {
  // Already connected — return true immediately so callers use MongoDB
  if (dbAvailable && Content) return true

  // Not configured
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_ACTUAL_PASSWORD')) {
    return false
  }

  try {
    const { connectDB } = await import('./db')
    const mod = await import('./models/Content')
    Content = mod.Content
    await connectDB()
    dbAvailable = true
    return true
  } catch {
    dbAvailable = false
    return false
  }
}

export async function getPageContent(page) {
  const hasDB = await tryLoadDB()
  if (hasDB && Content) {
    try {
      const doc = await Content.findOne({ page }).lean()
      const globalDoc = await Content.findOne({ page: 'global' }).lean()
      if (doc) return { ...doc.data, global: globalDoc?.data || {} }
    } catch {
      // fall through to JSON
    }
  }
  const all = readJSON()
  return { ...(all[page] || {}), global: all.global || {} }
}

export async function getAllContent() {
  const hasDB = await tryLoadDB()
  if (hasDB && Content) {
    try {
      const docs = await Content.find({}).lean()
      const result = {}
      for (const d of docs) result[d.page] = d.data
      return result
    } catch {
      // fall through to JSON
    }
  }
  return readJSON()
}

export async function setPageContent(page, updates) {
  // Always write to JSON as backup
  const all = readJSON()
  if (page === 'global') {
    all.global = { ...all.global, ...updates }
  } else {
    all[page] = { ...all[page], ...updates }
  }
  writeJSON(all)

  // Also try to write to MongoDB if available
  const hasDB = await tryLoadDB()
  if (hasDB && Content) {
    try {
      const existing = await Content.findOne({ page }).lean()
      const merged = { ...(existing?.data || {}), ...updates }
      await Content.findOneAndUpdate({ page }, { data: merged }, { upsert: true, new: true })
      return merged
    } catch {
      // JSON already updated above
    }
  }

  return all[page] || updates
}
