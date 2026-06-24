const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'

const STATIC_PAGES = [
  { url: SITE_URL,                        priority: 1.0,  changeFrequency: 'weekly' },
  { url: `${SITE_URL}/about`,             priority: 0.8,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/facilities`,        priority: 0.8,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/service`,           priority: 0.8,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/service-details`,   priority: 0.7,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/news`,              priority: 0.9,  changeFrequency: 'daily'   },
  { url: `${SITE_URL}/contact`,           priority: 0.7,  changeFrequency: 'yearly'  },
]

export default async function sitemap() {
  const now = new Date()

  const staticEntries = STATIC_PAGES.map(p => ({ ...p, lastModified: now }))

  try {
    const { connectDB } = await import('@/lib/db')
    const { BlogPost } = await import('@/lib/models/BlogPost')
    await connectDB()
    const posts = await BlogPost.find({ status: 'published' })
      .select('slug updatedAt publishedAt')
      .sort({ publishedAt: -1 })
      .lean()

    const blogEntries = posts.map(post => ({
      url: `${SITE_URL}/news-details/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticEntries, ...blogEntries]
  } catch {
    return staticEntries
  }
}
