import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'central.prag.global' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
    minimumCacheTTL: 86400,
    formats: ['image/avif', 'image/webp'],
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
