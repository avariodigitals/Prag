import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandBanner from '@/components/BrandBanner';
import FlashSales from '@/components/FlashSales';
import { getFeaturedProducts, getFlashSaleProducts, getProducts } from '@/lib/woocommerce';

export default async function HomePage() {
  const [featuredResult, flashSaleProducts] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
  ]);

  let featuredProducts = featuredResult;
  if (featuredProducts.length === 0) {
    const recent = await getProducts({ per_page: 6 });
    featuredProducts = recent.products;
  }

  return (
    <main className="w-full bg-white flex flex-col">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <BrandBanner />
      <FlashSales products={flashSaleProducts} />
    </main>
  );
}
