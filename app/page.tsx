// Public landing page renders on-demand with cached WooCommerce reads.
export const dynamic = 'force-dynamic';

import HeroBanner from '@/components/HeroBanner';
import ShopByNeed from '@/components/ShopByNeed';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandBanner from '@/components/BrandBanner';
import FlashSales from '@/components/FlashSales';
import TrustSignal from '@/components/TrustSignal';
import { getFeaturedProducts, getFlashSaleProducts, getProducts, getSiteSettings, filterHiddenProducts } from '@/lib/woocommerce';
import type { Product } from '@/lib/types';

export default async function HomePage() {
  const [featuredResult, flashSaleProducts, settings] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
    getSiteSettings(),
  ]);

  // Filter out out-of-stock and hidden category products
  const inStockAndVisible = (products: Product[]) =>
    filterHiddenProducts(products, settings.hidden_categories).filter((p) => p.stock_status !== 'outofstock');

  let featuredProducts = inStockAndVisible(featuredResult);
  if (featuredProducts.length < 8) {
    try {
      const recent = await getProducts({ per_page: 12 });
      const seen = new Set(featuredProducts.map((product) => product.id));
      const topUp = inStockAndVisible(recent.products).filter((product) => !seen.has(product.id));
      featuredProducts = [...featuredProducts, ...topUp].slice(0, 8);
    } catch {
      // Keep featured products as-is if fetch fails
    }
  }

  const visibleFlashSaleProducts = inStockAndVisible(flashSaleProducts);

  return (
    <main className="w-full bg-white flex flex-col">
      <HeroBanner slides={settings.slides} heroBg={settings.hero_background} whatsappLink={settings.socials?.whatsapp || (settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}` : undefined)} slideTransition={settings.slide_transition} />
      <CategoryGrid settings={settings} />
      <FeaturedProducts products={featuredProducts} whatsappNumber={settings.socials?.whatsapp || settings.whatsapp} />
      <ShopByNeed />
      <BrandBanner settings={settings} />
      <TrustSignal settings={settings} />
      <FlashSales products={visibleFlashSaleProducts} whatsappNumber={settings.socials?.whatsapp || settings.whatsapp} />
    </main>
  );
}
