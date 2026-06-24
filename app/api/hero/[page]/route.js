export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB, notFound } from '@/lib/apiHelpers'
import { Hero } from '@/lib/models/Hero'
import { deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function GET(request, { params }) {
  return withPublicDB(async () => {
    const doc = await Hero.findOne({ page: params.page }).lean()
    if (!doc) return ok(null)
    return ok(doc)
  })
}

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await Hero.findOneAndUpdate(
      { page: params.page },
      { ...body, page: params.page },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await Hero.findOne({ page: params.page })
    if (!doc) return notFound('Hero')
    if (doc.backgroundImage?.public_id) await deleteFromCloudinary(doc.backgroundImage.public_id)
    await doc.deleteOne()
    return ok({ deleted: true })
  })
}
