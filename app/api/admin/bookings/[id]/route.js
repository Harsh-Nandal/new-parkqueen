export const dynamic = 'force-dynamic'
import { ok, withAuth, notFound } from '@/lib/apiHelpers'
import { Booking } from '@/lib/models/Booking'

export async function GET(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Booking.findById(params.id).lean()
    if (!doc) return notFound('Booking')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const allowed = ['status', 'adminNote']
    const updates = {}
    for (const k of allowed) if (body[k] !== undefined) updates[k] = body[k]
    const doc = await Booking.findByIdAndUpdate(params.id, updates, { new: true })
    if (!doc) return notFound('Booking')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Booking.findByIdAndDelete(params.id)
    if (!doc) return notFound('Booking')
    return ok({ deleted: true })
  })
}
