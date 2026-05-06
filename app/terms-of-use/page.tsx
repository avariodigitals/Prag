import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Terms of Use - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

const SECTIONS = [
  {
    heading: 'Terms of Use',
    body: 'Please read these Terms of Use carefully before using this website. By accessing and using this website, you agree to be bound by these terms and all applicable laws and regulations.',
  },
  {
    heading: 'Use of Our Website',
    body: (
      <div className="flex flex-col gap-2">
        <p>By using this website, you agree:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Not to misuse or alter the platform</li>
          <li>Not to copy or reproduce content without permission</li>
        </ul>
        <p className="mt-2">All content remains the property of PRAG.</p>
      </div>
    ),
  },
  {
    heading: 'Limitation of Liability',
    body: (
      <div className="flex flex-col gap-2">
        <p className="font-medium">PRAG is not liable for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Website interruptions</li>
          <li>Errors in content</li>
          <li>Reliance on website information</li>
        </ul>
      </div>
    ),
  },
  {
    heading: 'Terms of Sale',
    body: (
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Orders & Payments</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Orders are subject to confirmation and availability</li>
            <li>Full payment is required before delivery, unless otherwise agreed</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Pricing</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Prices may change without notice</li>
            <li>Pricing errors may be corrected at any time</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Delivery</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Nationwide delivery is available</li>
            <li>Delivery timelines are estimates and only</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Risk Transfer</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Responsibility for products passes to the customer upon delivery</li>
            <li>Customers are advised to inspect items immediately upon receipt</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Installation</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Customers may use any qualified installer</li>
            <li>PRAG may recommend installers but is not responsible for third-party installation outcomes</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Product Performance</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Performance depends on:</li>
            <li>Installation quality</li>
            <li>System configuration</li>
            <li>Environmental conditions</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    heading: 'Warranty Policy',
    body: (
      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Warranty Coverage</h4>
          <p className="text-sm mb-2">At PRAG (Pragmatic Technologies Ltd.), we stand behind the quality of our products:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>All PRAG inverters: 1-year Limited Warranty</li>
            <li>Lithium Batteries: 5-Year Limited Warranty</li>
          </ul>
          <p className="text-sm mt-2">This warranty covers manufacturing defects under normal and proper use.</p>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Conditions for Warranty</h4>
          <p className="text-sm font-medium mb-1">What Is Not Covered</p>
          <p className="text-sm mb-2">The warranty does not cover issues arising from:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Misuse or poor installation</li>
            <li>Incorrect system configuration</li>
            <li>Exposure to water, fire, or physical damage</li>
            <li>Power conditions outside product rating</li>
            <li>Unauthorized repairs or modifications</li>
            <li>Normal wear and tear</li>
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-950 font-semibold mb-2">Warranty Claims</h4>
          <p className="text-sm mb-2">To make a claim:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Contact our support team</li>
            <li>Provide proof of purchase</li>
            <li>Allow product inspection</li>
          </ul>
          <p className="text-sm mt-2">Repairs or replacements will be handled at PRAG&apos;s discretion.</p>
        </div>
      </div>
    ),
  },
  {
    heading: 'General Disclaimer',
    body: 'PRAG products operate within defined specifications. Performance may vary depending on installation, usage, and environmental conditions.',
  },
  {
    heading: 'Contact Us',
    body: (
      <p>
        If you have any questions about our terms of use, please contact our customer support team at{' '}
        <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a>
        {' '}or call us at{' '}
        <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.
      </p>
    ),
  },
];

export default async function TermsPage() {
  const wpPage = await getPage('terms-of-use');
  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
            <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
            <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">Terms of use</span>
          </div>
          <h1 className="text-black text-2xl md:text-3xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }} />
        </div>
        <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
          <div className="w-full max-w-[997px] p-4 md:p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 wp-content"
            dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }} />
        </div>
      </main>
    );
  }
  return <PolicyPageLayout title="Terms of Use" breadcrumb="Terms of use" sections={SECTIONS} />;
}
