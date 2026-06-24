import mongoose from 'mongoose'

const OfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    cardTitle: { type: String, trim: true },
    description: { type: String },
    image: { url: String, public_id: String },
    cardImage: { url: String, public_id: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema)
