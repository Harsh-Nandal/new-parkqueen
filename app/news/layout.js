export const metadata = {
  title: 'Blog & News',
  description:
    'Read the latest news, tips, and articles from The ParkQueen Hotel — Rohtak. Hotel updates, travel insights, dining guides, and hospitality stories.',
  keywords: ['hotel blog', 'hotel news Rohtak', 'ParkQueen blog', 'hospitality articles', 'travel tips Haryana'],
  openGraph: {
    title: 'Blog & News — The ParkQueen Hotel',
    description:
      'Latest news, travel insights, dining guides, and hospitality stories from The ParkQueen Hotel, Rohtak.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & News | The ParkQueen Hotel',
    description: 'Latest hotel news and travel insights from The ParkQueen Hotel, Rohtak.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'}/news`,
  },
}

export default function NewsLayout({ children }) {
  return children
}
