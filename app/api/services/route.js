export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { Service } from '@/lib/models/Service'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'active' }
    const [data, total] = await Promise.all([
      Service.find(filter).sort({ order: 1 }).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.title) return err('title is required')
    const doc = await Service.create(body)
    return ok(doc)
  })
}
