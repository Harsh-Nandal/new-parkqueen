export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

const DEFAULTS = {
  siteName: 'The ParkQueen Hotel',
  tagline: 'Luxury Hotel in Rohtak',
  phone: ['+91 9088809991'],
  email: ['fom@parkqueenhotels.com'],
  address: 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India',
  mapEmbed: 'https://maps.google.com/maps?q=The+ParkQueen+Hotel+Rohtak+Haryana&t=&z=14&ie=UTF8&iwloc=&output=embed',
  social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#', youtube: '#' },
  footer: {
    tagline: 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.',
    copyright: 'The ParkQueen Hotel',
    checkIn: '12:00 PM',
    checkOut: '11:00 AM',
    weekdayHours: '08:00 - 11:00',
    saturdayHours: '08:00 - 11:00',
    sundayClosed: true,
  },
  seo: {
    title: 'The ParkQueen Hotel — Rohtak, Haryana',
    description: 'Luxury Hotel in Rohtak, Haryana — stays, dining and events.',
  },
}

async function getDB() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes('YOUR_ACTUAL_PASSWORD')) return null
  try {
    const { connectDB } = await import('@/lib/db')
    const { SiteSettings } = await import('@/lib/models/SiteSettings')
    await connectDB()
    return SiteSettings
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const SiteSettings = await getDB()
    if (SiteSettings) {
      let s = await SiteSettings.findOne().lean()
      if (!s) s = (await SiteSettings.create(DEFAULTS)).toObject()
      return NextResponse.json({ success: true, data: s })
    }
  } catch (e) {
    console.error('[Settings GET]', e.message)
  }
  return NextResponse.json({ success: true, data: DEFAULTS })
}

export async function PUT(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const SiteSettings = await getDB()
    if (!SiteSettings) {
      return NextResponse.json({ success: false, error: 'Database not connected. Please check your MONGODB_URI in .env.local.' }, { status: 503 })
    }
    const updated = await SiteSettings.findOneAndUpdate({}, body, {
      new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true,
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    console.error('[Settings PUT]', e.message)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
