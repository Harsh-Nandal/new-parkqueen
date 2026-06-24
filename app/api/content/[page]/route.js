export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getPageContent } from '@/lib/content'

export async function GET(request, { params }) {
  const { page } = params
  const content = await getPageContent(page)
  return NextResponse.json(content)
}
