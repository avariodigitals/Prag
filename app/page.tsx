export const dynamic = 'force-dynamic';

import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandBanner from '@/components/BrandBanner';
import FlashSales from '@/components/FlashSales';
import Footer from '@/components/Footer';
import { getFeaturedProducts, getFlashSaleProducts, getCategories, getProducts } from '@/lib/woocommerce';

export default async function HomePage() {
  const [featuredResult, flashSaleProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getFlashSaleProducts(),
    getCategories(),
  ]);

  let featuredProducts = featuredResult;
  
  // If no products are explicitly marked as featured, 
  // fetch the most recent products to populate the section
  if (featuredProducts.length === 0) {
    const recent = await getProducts({ per_page: 6 });
    featuredProducts = recent.products;
  }

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
