import mongoose from 'mongoose'

function generateRef() {
  return 'PQ' + Date.now().toString(36).toUpperCase().slice(-6)
}

const BookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      unique: true,
      default: generateRef,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    roomType: { type: String, default: 'Not specified' },
    guests: { type: Number, default: 1 },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    adminNote: { type: String },
    emailSent: { type: Boolean, default: false },
    source: { type: String, default: 'website' },
  },
  { timestamps: true }
)

BookingSchema.index({ status: 1, createdAt: -1 })
BookingSchema.index({ bookingRef: 1 })
BookingSchema.index({ email: 1 })

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
