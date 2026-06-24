export const metadata = {
  title: 'Room Details & Booking',
  description:
    'Book your stay at The ParkQueen Hotel, Rohtak. Choose from Executive Rooms, Superior Rooms, Queen Suite, and Presidential Suite with premium amenities.',
  keywords: ['book hotel room Rohtak', 'ParkQueen rooms', 'executive room Rohtak', 'presidential suite Rohtak'],
  openGraph: {
    title: 'Room Details & Booking — The ParkQueen Hotel',
    description:
      'Book Executive, Superior, Queen Suite, or Presidential Suite at The ParkQueen Hotel, Rohtak. Competitive rates, premium amenities.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Room | The ParkQueen Hotel',
    description: 'Choose your room and book your stay at The ParkQueen Hotel, Rohtak.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'}/service-details`,
  },
}

export default function ServiceDetailsLayout({ children }) {
  return children
}
