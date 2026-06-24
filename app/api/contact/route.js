export const dynamic = 'force-dynamic'
import { ok, err, withPublicDB } from '@/lib/apiHelpers'
import { ContactMessage } from '@/lib/models/ContactMessage'
import { sendContactNotification, sendContactConfirmation } from '@/lib/emailService'

export async function POST(request) {
  return withPublicDB(async () => {
    const body = await request.json()
    const { name, email, message } = body

    // Validation
    if (!name?.trim()) return err('Name is required')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Valid email is required')
    if (!message?.trim()) return err('Message is required')
    if (message.length < 10) return err('Message must be at least 10 characters')

    // Save to database
    const doc = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    })

    // Send emails (non-blocking — don't fail the request if email fails)
    Promise.all([
      sendContactNotification(doc.toObject()),
      sendContactConfirmation(doc.toObject()),
    ])
      .then(([notif, confirm]) => {
        if (notif.success || notif.skipped) {
          ContactMessage.findByIdAndUpdate(doc._id, { emailSent: true }).catch(() => {})
        }
      })
      .catch(e => console.error('[Contact] Email error:', e.message))

    return ok({ id: doc._id }, { message: 'Message sent successfully' })
  })
}

export async function GET(request) {
  return withPublicDB(async () => {
    return ok({ status: 'Contact API is live' })
  })
}
