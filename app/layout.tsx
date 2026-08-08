import type { Metadata, Viewport } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import TrackingLoader from '@/components/TrackingLoader';
import CookieConsentLoader from '@/components/CookieConsentLoader';
import SiteShell from '@/components/SiteShell';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';
import './globals.css';

const onest = Onest({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-onest',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'PRAG - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more',
  description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
  metadataBase: new URL('https://shop.prag.global'),
  alternates: { canonical: 'https://shop.prag.global' },
  openGraph: {
    title: 'PRAG – Nigeria\'s Leading Power Engineering Company',
    description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
    url: 'https://shop.prag.global/',
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
  const headerList = await headers();
  const hostname = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '';
  const tracking = await getEcommerceScriptsForHost(hostname);
  const gaId = tracking?.googleAnalyticsId?.trim() || 'G-K1FJPNG5K9';
  const searchConsoleVerification = tracking?.googleSearchConsoleVerification?.trim() || '';
  const gtmId = tracking?.googleTagManagerId?.trim() || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to key origins for faster resource loading */}
        <link rel="preconnect" href="https://central.prag.global" />
        <link rel="dns-prefetch" href="https://central.prag.global" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {searchConsoleVerification && (
          <meta name="google-site-verification" content={searchConsoleVerification} />
        )}
        {gtmId && (
          <Script id="gtm-loader" strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }} />
        )}
      </head>
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
        </Script>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
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
