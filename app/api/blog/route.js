export const dynamic = 'force-dynamic'
import { ok, err, withAuth, withPublicDB, paginate, paginationMeta } from '@/lib/apiHelpers'
import { BlogPost } from '@/lib/models/BlogPost'

export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const adminAll = searchParams.get('all') === 'true'
    const filter = adminAll ? {} : { status: 'published' }
    if (searchParams.get('category')) filter.category = searchParams.get('category')
    if (searchParams.get('featured') === 'true') filter.featured = true
    const q = searchParams.get('q')
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { excerpt: { $regex: q, $options: 'i' } }]

    const [data, total] = await Promise.all([
      BlogPost.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}

export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    if (!body.title) return err('title is required')
    const doc = await BlogPost.create(body)
    return ok(doc)
  })
}
