export default function robots() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  }
}
