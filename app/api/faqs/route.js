export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { FAQ } from '@/lib/models/FAQ'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'active' }
    if (searchParams.get('category')) filter.category = searchParams.get('category')
    const [data, total] = await Promise.all([
      FAQ.find(filter).sort({ order: 1 }).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.question || !body.answer) return err('question and answer are required')
    const doc = await FAQ.create(body)
    return ok(doc)
  })
}
