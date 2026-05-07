import type { Metadata, Viewport } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import TrackingLoader from '@/components/TrackingLoader';
import SiteShell from '@/components/SiteShell';
import './globals.css';

const onest = Onest({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-space-grotesk', display: 'swap' });

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
        <link rel="preconnect" href="https://central.prag.global" />
        <link rel="dns-prefetch" href="https://central.prag.global" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K1FJPNG5K9"
          strategy="afterInteractive"
        />
        <Script id="ga-hardcoded-fallback" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-K1FJPNG5K9');`}
        </Script>
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
