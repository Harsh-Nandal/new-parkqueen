import mongoose from 'mongoose'

const HeroSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    backgroundImage: { url: String, public_id: String },
    overlayColor: { type: String, default: 'rgba(0,0,0,0.4)' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

export const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema)
