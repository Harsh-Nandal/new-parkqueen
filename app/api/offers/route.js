export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { Offer } from '@/lib/models/Offer'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'active' }
    const [data, total] = await Promise.all([
      Offer.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Offer.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.title) return err('title is required')
    const doc = await Offer.create(body)
    return ok(doc)
  })
}
