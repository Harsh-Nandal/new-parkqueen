export const dynamic = 'force-dynamic'
import { ok, err, withPublicDB } from '@/lib/apiHelpers'
import { Booking } from '@/lib/models/Booking'
import { sendBookingNotification, sendBookingConfirmation } from '@/lib/emailService'

export async function POST(request) {
  return withPublicDB(async () => {
    const body = await request.json()
    const { name, email, phone, roomType, guests, checkIn, checkOut, message } = body

    // Validation
    if (!name?.trim()) return err('Name is required')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Valid email is required')
    if (!checkIn?.trim()) return err('Check-in date is required')
    if (!checkOut?.trim()) return err('Check-out date is required')
    if (!roomType || roomType === 'Room') return err('Please select a room type')

    // Save to database
    const doc = await Booking.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      roomType: roomType.trim(),
      guests: parseInt(guests) || 1,
      checkIn: checkIn.trim(),
      checkOut: checkOut.trim(),
      message: message?.trim() || '',
    })

    // Send emails (non-blocking)
    Promise.all([
      sendBookingNotification(doc.toObject()),
      sendBookingConfirmation(doc.toObject()),
    ])
      .then(([notif]) => {
        if (notif.success || notif.skipped) {
          Booking.findByIdAndUpdate(doc._id, { emailSent: true }).catch(() => {})
        }
      })
      .catch(e => console.error('[Booking] Email error:', e.message))

    return ok(
      { bookingRef: doc.bookingRef, id: doc._id },
      { message: 'Booking request submitted successfully' }
    )
  })
}
