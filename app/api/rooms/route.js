export const dynamic = 'force-dynamic'
import { ok, err, unauth, withAuth, withPublicDB, paginate, paginationMeta, buildFilter } from '@/lib/apiHelpers'
import { Room } from '@/lib/models/Room'
import { verifyAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'

// GET /api/rooms — public list (active only, paginated)
export async function GET(request) {
  return withPublicDB(async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const filter = { status: 'active' }
    if (searchParams.get('category')) filter.category = searchParams.get('category')
    if (searchParams.get('featured') === 'true') filter.featured = true

    const [rooms, total] = await Promise.all([
      Room.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Room.countDocuments(filter),
    ])
    return ok(rooms, paginationMeta(total, page, limit))
  })
}

// POST /api/rooms — admin create
export async function POST(request) {
  return withAuth(request, async () => {
    const body = await request.json()
    const { name, category, price } = body
    if (!name || !category || !price) return err('name, category and price are required')
    const room = await Room.create(body)
    return ok(room)
  })
}
