export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { Gallery } from '@/lib/models/Gallery'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await Gallery.findByIdAndUpdate(params.id, body, { new: true })
    if (!doc) return notFound('Gallery item')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const { status } = await request.json()
    const doc = await Gallery.findByIdAndUpdate(params.id, { status }, { new: true })
    if (!doc) return notFound('Gallery item')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Gallery.findById(params.id)
    if (!doc) return notFound('Gallery item')
    if (doc.image?.public_id) await deleteFromCloudinary(doc.image.public_id)
    await doc.deleteOne()
    return ok({ deleted: true })
  })
}
