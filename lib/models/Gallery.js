import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    category: {
      type: String,
      enum: ['rooms', 'dining', 'events', 'facilities', 'about', 'exterior', 'other'],
      default: 'other',
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

GallerySchema.index({ status: 1, category: 1, order: 1 })

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema)
