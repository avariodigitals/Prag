// Public landing page renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandBanner from '@/components/BrandBanner';
import FlashSales from '@/components/FlashSales';
import { getFeaturedProducts, getFlashSaleProducts, getProducts, getSiteSettings } from '@/lib/woocommerce';

export default async function HomePage() {
  const [featuredResult, flashSaleProducts, settings] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
    getSiteSettings(),
  ]);

  let featuredProducts = featuredResult;
  if (featuredProducts.length < 8) {
    const recent = await getProducts({ per_page: 8 });
    const seen = new Set(featuredProducts.map((product) => product.id));
    const topUp = recent.products.filter((product) => !seen.has(product.id));
    featuredProducts = [...featuredProducts, ...topUp].slice(0, 8);
  }

  return (
    <main className="w-full bg-white flex flex-col">
      <HeroBanner slides={settings.slides} heroBg={settings.hero_background} />
      <CategoryGrid settings={settings} />
      <FeaturedProducts products={featuredProducts} />
      <BrandBanner settings={settings} />
      <FlashSales products={flashSaleProducts} />
    </main>
  );
}
