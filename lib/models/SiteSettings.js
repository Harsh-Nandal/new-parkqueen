import mongoose from 'mongoose'

const SiteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'The ParkQueen Hotel' },
    tagline: { type: String, default: 'Luxury Hotel in Rohtak' },
    logo: { url: String, public_id: String },
    favicon: { url: String, public_id: String },
    phone: { type: [String], default: ['+91 9088809991'] },
    email: { type: [String], default: ['fom@parkqueenhotels.com'] },
    whatsapp: { type: String },
    address: { type: String, default: 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India' },
    city: { type: String, default: 'Rohtak' },
    state: { type: String, default: 'Haryana' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '124001' },
    mapEmbed: {
      type: String,
      default: 'https://maps.google.com/maps?q=The+ParkQueen+Hotel+Rohtak+Haryana&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
    social: {
      facebook: { type: String, default: '#' },
      twitter: { type: String, default: '#' },
      instagram: { type: String, default: '#' },
      linkedin: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
    },
    footer: {
      tagline: { type: String, default: 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.' },
      copyright: { type: String, default: 'The ParkQueen Hotel' },
      backgroundImage: { url: String, public_id: String },
      checkIn: { type: String, default: '12:00 PM' },
      checkOut: { type: String, default: '11:00 AM' },
      weekdayHours: { type: String, default: '08:00 - 11:00' },
      saturdayHours: { type: String, default: '08:00 - 11:00' },
      sundayClosed: { type: Boolean, default: true },
    },
    seo: {
      title: { type: String, default: 'The ParkQueen Hotel — Rohtak, Haryana' },
      description: { type: String, default: 'The ParkQueen Hotel in Rohtak, Haryana — Luxury stays, dining and events in Rohtak, India.' },
      keywords: { type: String, default: 'ParkQueen Hotel, Rohtak hotel, luxury hotel Rohtak, hotel Haryana' },
      ogImage: { url: String, public_id: String },
    },
  },
  { timestamps: true }
)

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema)
