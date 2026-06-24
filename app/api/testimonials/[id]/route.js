export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { Testimonial } from '@/lib/models/Testimonial'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function GET(request, { params }) {
  return withPublicDB(async () => {
    const doc = await Testimonial.findById(params.id).lean()
    if (!doc) return notFound('Testimonial')
    return ok(doc)
  })
}

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await Testimonial.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!doc) return notFound('Testimonial')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const { status } = await request.json()
    const doc = await Testimonial.findByIdAndUpdate(params.id, { status }, { new: true })
    if (!doc) return notFound('Testimonial')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Testimonial.findById(params.id)
    if (!doc) return notFound('Testimonial')
    if (doc.image?.public_id) await deleteFromCloudinary(doc.image.public_id)
    await doc.deleteOne()
    return ok({ deleted: true })
  })
}
