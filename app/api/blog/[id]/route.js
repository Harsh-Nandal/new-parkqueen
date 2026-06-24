export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { BlogPost } from '@/lib/models/BlogPost'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function GET(request, { params }) {
  return withPublicDB(async () => {
    const doc = await BlogPost.findOne({
      $or: [{ _id: params.id.match(/^[a-f\d]{24}$/i) ? params.id : null }, { slug: params.id }],
    }).lean()
    if (!doc) return notFound('Blog post')
    return ok(doc)
  })
}

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await BlogPost.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
    if (!doc) return notFound('Blog post')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const updates = await request.json()
    const doc = await BlogPost.findByIdAndUpdate(params.id, updates, { new: true })
    if (!doc) return notFound('Blog post')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await BlogPost.findById(params.id)
    if (!doc) return notFound('Blog post')
    if (doc.image?.public_id) await deleteFromCloudinary(doc.image.public_id)
    await doc.deleteOne()
    return ok({ deleted: true })
  })
}
