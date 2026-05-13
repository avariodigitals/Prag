import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import TrackingLoader from '@/components/TrackingLoader';
import CookieConsentLoader from '@/components/CookieConsentLoader';
import SiteShell from '@/components/SiteShell';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PRAG - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more',
  description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'PRAG – Nigeria\'s Leading Power Engineering Company',
    description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
    url: 'https://prag.global',
    siteName: 'PRAG',
    images: [
      {
        url: 'https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png',
        width: 1200,
        height: 630,
        alt: 'PRAG – Nigeria\'s Leading Power Engineering Company',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRAG – Nigeria\'s Leading Power Engineering Company',
    description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
    images: ['https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png'],
  },
};

export default async function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to key origins for faster resource loading */}
        <link rel="preconnect" href="https://central.prag.global" />
        <link rel="dns-prefetch" href="https://central.prag.global" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {/* Preload LCP hero background (fallback) */}
        <link
          rel="preload"
          as="image"
          href="https://central.prag.global/wp-content/uploads/2026/04/421db5e8efbc14b105a33a6db7182652503c3fdd.png"
          fetchPriority="high"
        />
      </head>
      <body className={`${montserrat.variable} antialiased`} suppressHydrationWarning>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K1FJPNG5K9"
          strategy="afterInteractive"
        />
        <Script id="ga-hardcoded-fallback" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-K1FJPNG5K9');`}
        </Script>
        <CookieConsentLoader />
        <CartProvider>
          <WishlistProvider>
            <SiteShell>
              {children}
            </SiteShell>
            {modal}
          </WishlistProvider>
        </CartProvider>
        <TrackingLoader />
      </body>
    </html>
  );
}
