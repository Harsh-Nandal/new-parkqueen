export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAllContent, setPageContent } from '@/lib/content'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const content = await getAllContent()
  return NextResponse.json(content)
}

export async function PUT(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { page, data } = await request.json()
  const updated = await setPageContent(page, data)
  return NextResponse.json(updated)
}
