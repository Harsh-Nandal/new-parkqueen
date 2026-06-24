import { getPageContent } from '@/lib/content'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'

export async function generateMetadata() {
  try {
    const content = await getPageContent('service')
    const seo = content?.seo || {}
    return {
      title: seo.title || 'Our Services',
      description: seo.description ||
        'Discover premium hotel services at The ParkQueen Hotel, Rohtak, Haryana — fine dining, spa & wellness, banquet halls, gym, room service and more.',
      ...(seo.keywords ? { keywords: seo.keywords.split(',').map(k => k.trim()) } : {}),
      openGraph: {
        title: seo.title || 'Our Services — The ParkQueen Hotel',
        description: seo.description || 'Premium hotel services at The ParkQueen Hotel, Rohtak.',
        type: 'website',
        ...(seo.ogImage?.url
          ? { images: [{ url: seo.ogImage.url, width: 1200, height: 630, alt: 'The ParkQueen Hotel Services' }] }
          : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title || 'Our Services | The ParkQueen Hotel',
        description: seo.description || 'Premium hotel services at The ParkQueen Hotel, Rohtak.',
        ...(seo.ogImage?.url ? { images: [seo.ogImage.url] } : {}),
      },
      alternates: { canonical: `${SITE_URL}/service` },
    }
  } catch {
    return {
      title: 'Our Services',
      description: 'Discover premium hotel services at The ParkQueen Hotel, Rohtak.',
    }
  }
}

export default function ServiceLayout({ children }) {
  return children
}
