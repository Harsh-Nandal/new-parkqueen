export const dynamic = 'force-dynamic'
import { ok, withAuth, paginate, paginationMeta } from '@/lib/apiHelpers'
import { Booking } from '@/lib/models/Booking'

export async function GET(request) {
  return withAuth(request, async () => {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginate(Object.fromEntries(searchParams))
    const status = searchParams.get('status')
    const filter = status ? { status } : {}

    const [data, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ])
    return ok(data, paginationMeta(total, page, limit))
  })
}
