import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    icon: { type: String, default: 'fa-star' },
    image: { url: String, public_id: String },
    category: { type: String, default: 'general' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema)
