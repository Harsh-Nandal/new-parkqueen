export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { Offer } from '@/lib/models/Offer'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await Offer.findByIdAndUpdate(params.id, body, { new: true })
    if (!doc) return notFound('Offer')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const updates = await request.json()
    const doc = await Offer.findByIdAndUpdate(params.id, updates, { new: true })
    if (!doc) return notFound('Offer')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Offer.findById(params.id)
    if (!doc) return notFound('Offer')
    if (doc.image?.public_id) await deleteFromCloudinary(doc.image.public_id)
    if (doc.cardImage?.public_id) await deleteFromCloudinary(doc.cardImage.public_id)
    await doc.deleteOne()
    return ok({ deleted: true })
  })
}
