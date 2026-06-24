import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    ip: { type: String },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
)

ContactMessageSchema.index({ status: 1, createdAt: -1 })

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', ContactMessageSchema)
