import mongoose from 'mongoose'

const RoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: String, required: true },
    priceUnit: { type: String, default: 'NIGHT' },
    size: { type: String, default: '1500 SQ.FT' },
    capacity: { type: Number, default: 2 },
    images: [{ url: { type: String, required: true }, public_id: { type: String, required: true } }],
    amenities: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

RoomSchema.index({ status: 1, order: 1 })

export const Room = mongoose.models.Room || mongoose.model('Room', RoomSchema)
