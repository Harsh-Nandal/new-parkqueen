export const dynamic = 'force-dynamic'
import { ok, withAuth, withPublicDB } from '@/lib/apiHelpers'
import { Hero } from '@/lib/models/Hero'

export async function GET() {
  return withPublicDB(async () => {
    const data = await Hero.find({ status: 'active' }).lean()
    return ok(data)
  })
}
