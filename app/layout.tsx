import type { Metadata } from 'next';
import { Onest, Space_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import './globals.css';

const onest = Onest({ subsets: ['latin'], variable: '--font-onest' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Prag – Nigeria\'s Leading Power Engineering Company',
  description: 'Shop inverters, stabilizers, solar panels and batteries. Engineered for real-world loads.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${onest.variable} ${spaceGrotesk.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
