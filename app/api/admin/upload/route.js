export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinaryHelper'

export async function POST(request) {
  if (!verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const folder = formData.get('folder') || 'parkqueen'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const result = await uploadToCloudinary(file, folder)
  return NextResponse.json({ success: true, ...result })
}

export async function DELETE(request) {
  if (!verifyAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { public_id } = await request.json()
  if (!public_id) return NextResponse.json({ error: 'public_id required' }, { status: 400 })

  await deleteFromCloudinary(public_id)
  return NextResponse.json({ success: true })
}
