export const metadata = {
  title: 'About Us',
  description:
    'Learn about The ParkQueen Hotel — a premier luxury property in Rohtak, Haryana offering world-class hospitality, elegant rooms, fine dining, and banquet facilities.',
  keywords: ['about ParkQueen Hotel', 'luxury hotel Rohtak', 'ParkQueen hospitality', 'hotel about Rohtak Haryana'],
  openGraph: {
    title: 'About The ParkQueen Hotel — Rohtak, Haryana',
    description:
      'Discover The ParkQueen Hotel — premier luxury hospitality in Rohtak, Haryana with elegant rooms, fine dining, and exceptional service.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About The ParkQueen Hotel',
    description: 'Premier luxury hospitality in Rohtak, Haryana.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'}/about`,
  },
}

export default function AboutLayout({ children }) {
  return children
}
