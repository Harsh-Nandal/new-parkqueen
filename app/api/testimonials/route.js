export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { Testimonial } from '@/lib/models/Testimonial'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'active' }
    const [data, total] = await Promise.all([
      Testimonial.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.name || !body.content) return err('name and content are required')
    const doc = await Testimonial.create(body)
    return ok(doc)
  })
}
