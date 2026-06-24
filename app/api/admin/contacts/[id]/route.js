export const dynamic = 'force-dynamic'
import { ok, withAuth, notFound } from '@/lib/apiHelpers'
import { ContactMessage } from '@/lib/models/ContactMessage'

export async function GET(request, { params }) {
  return withAuth(request, async () => {
    const doc = await ContactMessage.findById(params.id).lean()
    if (!doc) return notFound('Contact message')
    return ok(doc)
  })
}

export async function PATCH(request, { params }) {
  return withAuth(request, async () => {
    const { status } = await request.json()
    const doc = await ContactMessage.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
    if (!doc) return notFound('Contact message')
    return ok(doc)
  })
}

export async function DELETE(request, { params }) {
  return withAuth(request, async () => {
    const doc = await ContactMessage.findByIdAndDelete(params.id)
    if (!doc) return notFound('Contact message')
    return ok({ deleted: true })
  })
}
