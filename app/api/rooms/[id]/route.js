export const dynamic = 'force-dynamic'
import { ok, err, unauth, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { Room } from '@/lib/models/Room'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function GET(request, { params }) {
  return withPublicDB(async () => {
    const room = await Room.findById(params.id).lean()
    if (!room) return notFound('Room')
    return ok(room)
  })
}

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const room = await Room.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!room) return notFound('Room')
    return ok(room)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const { status } = await request.json()
    const room = await Room.findByIdAndUpdate(params.id, { status }, { new: true })
    if (!room) return notFound('Room')
    return ok(room)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const room = await Room.findById(params.id)
    if (!room) return notFound('Room')
    for (const img of room.images || []) {
      await deleteFromCloudinary(img.public_id)
    }
    await room.deleteOne()
    return ok({ deleted: true })
  })
}
