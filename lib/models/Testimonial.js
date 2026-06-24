import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'Guest' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true },
    image: { url: String, public_id: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Testimonial =
  mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
