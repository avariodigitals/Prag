import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'central.prag.global' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  env: {
    NEXT_PUBLIC_SHOP_URL: process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com',
  },
  async redirects() {
    return [
      { source: '/favicon.ico', destination: '/favicon.png', permanent: true },
    ];
  },
};

export default nextConfig;
