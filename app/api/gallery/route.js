export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { Gallery } from '@/lib/models/Gallery'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'active' }
    if (searchParams.get('category')) filter.category = searchParams.get('category')
    const [data, total] = await Promise.all([
      Gallery.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.image?.url) return err('image.url is required')
    const doc = await Gallery.create(body)
    return ok(doc)
  })
}
