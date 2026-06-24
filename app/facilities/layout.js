export const metadata = {
  title: 'Hotel Facilities',
  description:
    'Explore world-class facilities at The ParkQueen Hotel, Rohtak — including restaurant & dining, spa & wellness, banquet halls, fitness centre, and free guest parking.',
  keywords: ['hotel facilities Rohtak', 'ParkQueen amenities', 'spa Rohtak', 'banquet hall Rohtak', 'gym hotel Rohtak'],
  openGraph: {
    title: 'Hotel Facilities — The ParkQueen Hotel, Rohtak',
    description:
      'World-class facilities including fine dining, spa, banquet halls, gym, and more at The ParkQueen Hotel, Rohtak.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Facilities | The ParkQueen Hotel',
    description: 'Fine dining, spa, banquets, gym and more at The ParkQueen Hotel, Rohtak.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'}/facilities`,
  },
}

export default function FacilitiesLayout({ children }) {
  return children
}
