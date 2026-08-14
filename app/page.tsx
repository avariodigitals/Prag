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

export default async function HomePage() {
  const [featuredResult, flashSaleProducts, settings] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
    getSiteSettings(),
  ]);

  let featuredProducts = filterHiddenProducts(featuredResult, settings.hidden_categories);
  if (featuredProducts.length < 4) {
    try {
      const recent = await getProducts({ per_page: 8 });
      const seen = new Set(featuredProducts.map((product) => product.id));
      const topUp = filterHiddenProducts(recent.products, settings.hidden_categories).filter((product) => !seen.has(product.id));
      featuredProducts = [...featuredProducts, ...topUp].slice(0, 4);
    } catch {
      // Keep featured products as-is if fetch fails
    }
  }

  const visibleFlashSaleProducts = filterHiddenProducts(flashSaleProducts, settings.hidden_categories);

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
