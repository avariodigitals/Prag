import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandBanner from '@/components/BrandBanner';
import FlashSales from '@/components/FlashSales';
import Footer from '@/components/Footer';
import { getFeaturedProducts, getFlashSaleProducts, getCategories } from '@/lib/woocommerce';

export default async function HomePage() {
  const [featuredProducts, flashSaleProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
    getCategories(),
  ]);

  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />
      <HeroBanner />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <BrandBanner />
      <FlashSales products={flashSaleProducts} />
      <Footer />
    </main>
  );
}
