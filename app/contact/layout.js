export const metadata = {
  title: 'Contact Us',
  description:
    'Contact The ParkQueen Hotel in Rohtak, Haryana. Get in touch for room bookings, event enquiries, dining reservations, or general information. Call +91 9088809991.',
  keywords: ['contact ParkQueen Hotel', 'hotel contact Rohtak', 'book room Rohtak', 'ParkQueen Hotel phone number'],
  openGraph: {
    title: 'Contact The ParkQueen Hotel — Rohtak',
    description:
      'Get in touch with The ParkQueen Hotel, Rohtak for bookings, events, and general enquiries. Phone: +91 9088809991.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | The ParkQueen Hotel',
    description: 'Reach The ParkQueen Hotel, Rohtak for bookings and enquiries.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'}/contact`,
  },
}

export default function ContactLayout({ children }) {
  return children
}
