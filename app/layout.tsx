import type { Metadata, Viewport } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import { getEcommerceScriptsForHost } from '@/lib/ecommerceConfig';
import SiteShell from '@/components/SiteShell';
import './globals.css';

const onest = Onest({ subsets: ['latin'], variable: '--font-onest', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

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
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host') || '';
  const tracking = await getEcommerceScriptsForHost(host);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {tracking?.googleSearchConsoleVerification && (
          <meta name="google-site-verification" content={tracking.googleSearchConsoleVerification} />
        )}

        {tracking?.customHeadScripts && (
          <Script
            id="ecommerce-custom-head-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: tracking.customHeadScripts }}
          />
        )}

        {tracking?.googleTagManagerId && (
          <Script
            id="ecommerce-gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${tracking.googleTagManagerId}');`,
            }}
          />
        )}

        {tracking?.googleAnalyticsId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${tracking.googleAnalyticsId}`} strategy="afterInteractive" />
            <Script
              id="ecommerce-ga4"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tracking.googleAnalyticsId}');`,
              }}
            />
          </>
        )}

        {tracking?.metaPixelId && (
          <Script
            id="ecommerce-meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${tracking.metaPixelId}');fbq('track','PageView');`,
            }}
          />
        )}

        {tracking?.tiktokPixelId && (
          <Script
            id="ecommerce-tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${tracking.tiktokPixelId}');
  ttq.page();
}(window, document, 'ttq');`,
            }}
          />
        )}
      </head>
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        {tracking?.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${tracking.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {tracking?.customBodyScripts && (
          <Script
            id="ecommerce-custom-body-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: tracking.customBodyScripts }}
          />
        )}

        <CartProvider>
          <WishlistProvider>
            <SiteShell>
              {children}
            </SiteShell>
              {modal}
          </WishlistProvider>
        </CartProvider>

        {tracking?.customFooterScripts && (
          <Script
            id="ecommerce-custom-footer-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: tracking.customFooterScripts }}
          />
        )}
      </body>
    </html>
  );
}
