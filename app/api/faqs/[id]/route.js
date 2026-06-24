export const dynamic = 'force-dynamic'
import { ok, withAuth, notFound } from '@/lib/apiHelpers'
import { FAQ } from '@/lib/models/FAQ'

export async function PUT(request, { params }) {
  return withAuth(request, async () => {
    const body = await request.json()
    const doc = await FAQ.findByIdAndUpdate(params.id, body, { new: true })
    if (!doc) return notFound('FAQ')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const updates = await request.json()
    const doc = await FAQ.findByIdAndUpdate(params.id, updates, { new: true })
    if (!doc) return notFound('FAQ')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await FAQ.findByIdAndDelete(params.id)
    if (!doc) return notFound('FAQ')
    return ok({ deleted: true })
  })
}
