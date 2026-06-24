import { NextResponse } from 'next/server'
import { verifyAuth } from './auth'
import { connectDB } from './db'

export function ok(data, meta = {}) {
  return NextResponse.json({ success: true, data, ...meta })
}

export function err(message, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function unauth() {
  return err('Unauthorized', 401)
}

export function notFound(label = 'Record') {
  return err(`${label} not found`, 404)
}

export async function withAuth(request, handler) {
  if (!verifyAuth(request)) return unauth()
  try {
    await connectDB()
    return await handler()
  } catch (e) {
    console.error('[DB Error]', e.message)
    return err(e.message || 'Database error', 500)
  }
}

export async function withPublicDB(handler) {
  try {
    await connectDB()
    return await handler()
  } catch (e) {
    console.error('[DB Error]', e.message)
    // Return empty success response so frontend uses its static fallbacks
    return ok([], { pagination: { total: 0, page: 1, limit: 20, pages: 0 } })
  }
}

export function paginate(query = {}) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function paginationMeta(total, page, limit) {
  return {
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}

export function buildFilter(query, allowedFilters = []) {
  const filter = {}
  for (const key of allowedFilters) {
    if (query[key] !== undefined && query[key] !== '') {
      filter[key] = query[key]
    }
  }
  return filter
}
