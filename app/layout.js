import Script from 'next/script'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkqueenhotels.com'
const OG_IMAGE = `${SITE_URL}/assets/images/og-image.jpg`

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1c2e',
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The ParkQueen Hotel — Rohtak, Haryana',
    template: '%s | The ParkQueen Hotel',
  },
  description:
    'The ParkQueen Hotel in Rohtak, Haryana — Luxury stays, fine dining, banquets and events. Book your stay at the premier hotel in Rohtak.',
  keywords: [
    'ParkQueen Hotel', 'hotel Rohtak', 'luxury hotel Rohtak', 'hotel Haryana',
    'hotel near Delhi NCR', 'banquet hall Rohtak', 'rooms Rohtak', 'dining Rohtak',
  ],
  authors: [{ name: 'The ParkQueen Hotel' }],
  creator: 'The ParkQueen Hotel',
  publisher: 'The ParkQueen Hotel',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'The ParkQueen Hotel',
    title: 'The ParkQueen Hotel — Rohtak, Haryana',
    description:
      'Luxury stays, fine dining, banquets and events in Rohtak, Haryana. Experience refined hospitality at The ParkQueen Hotel.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'The ParkQueen Hotel — Rohtak' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The ParkQueen Hotel — Rohtak, Haryana',
    description: 'Luxury stays, fine dining and events at The ParkQueen Hotel, Rohtak.',
    images: [OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/assets/img/favicon.svg" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/mousecursor.css" />
        <link rel="stylesheet" href="/assets/css/meanmenu.css" />
        <link rel="stylesheet" href="/assets/css/odometer.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/nice-select.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body>
        {children}

        {/* jQuery MUST load first — all plugins depend on it */}
        <Script src="/assets/js/jquery-3.7.1.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/jquery.ripples-min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/viewport.jquery.js" strategy="beforeInteractive" />
        <Script src="/assets/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/jquery.nice-select.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/jquery.waypoints.js" strategy="beforeInteractive" />
        <Script src="/assets/js/odometer.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/swiper-bundle.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/jquery.meanmenu.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/jquery.magnific-popup.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/wow.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
