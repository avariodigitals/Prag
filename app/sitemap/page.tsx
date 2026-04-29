import Link from 'next/link';

export const metadata = { title: 'Sitemap - Prag' };

const SECTIONS = [
  {
    title: 'Products',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Batteries', href: '/products/batteries' },
      { label: 'Stabilizers', href: '/products/all-prag-stabilizers' },
      { label: 'Inverters', href: '/products/inverters' },
      { label: 'Solar', href: '/products/solar' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'PRAG Stores', href: '/stores' },
      { label: 'Become a Distributor', href: '/distributor' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Power Calculator', href: '/power-calculator' },
      { label: 'Technical Resources', href: '/resources' },
      { label: 'Knowledge Center', href: '/knowledge-center' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return Policy', href: '/return-policy' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Compare Products', href: '/compare' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms-of-use' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <section className="w-full px-4 md:px-20 py-16 bg-stone-50 flex flex-col items-center gap-4">
        <h1 className="text-sky-700 text-3xl md:text-5xl font-bold font-['Onest'] text-center">Sitemap</h1>
        <p className="max-w-xl text-center text-sky-700 text-base md:text-lg font-normal font-['Space_Grotesk']">
          Find the main pages and product sections across Prag.
        </p>
      </section>

      <section className="w-full px-4 md:px-20 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h2 className="text-zinc-900 text-xl font-semibold font-['Space_Grotesk']">{section.title}</h2>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-500 text-base font-normal font-['Space_Grotesk'] hover:text-sky-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
