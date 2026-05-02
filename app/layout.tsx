import type { Metadata } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import SiteShell from '@/components/SiteShell';
import './globals.css';

const onest = Onest({ subsets: ['latin'], variable: '--font-onest', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

export const metadata: Metadata = {
  title: 'Prag – Nigeria\'s Leading Power Engineering Company',
  description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Prag – Nigeria\'s Leading Power Engineering Company',
    description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
    url: 'https://prag.global',
    siteName: 'Prag',
    images: [
      {
        url: 'https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png',
        width: 1200,
        height: 630,
        alt: 'Prag – Nigeria\'s Leading Power Engineering Company',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prag – Nigeria\'s Leading Power Engineering Company',
    description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
    images: ['https://central.prag.global/wp-content/uploads/2026/04/Prag-Logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <SiteShell>
              {children}
            </SiteShell>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
