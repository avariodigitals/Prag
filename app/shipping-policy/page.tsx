import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Shipping Policy – Prag' };

const DELIVERY_TIMEFRAMES = [
  { area: 'Lagos & Environs', time: '1-2 business days for standard delivery' },
  { area: 'Major Cities (Abuja, Port Harcourt, Kano, Ibadan)', time: '2-4 business days for standard delivery' },
  { area: 'Other States', time: '3-7 business days for standard delivery' },
];

const STATIC_SECTIONS = [
  {
    heading: 'Shipping Areas',
    body: 'We currently ship to all states in Nigeria. Our primary distribution centers are located in Lagos, Abuja, and Port Harcourt to ensure faster delivery times across the country.',
  },
  {
    heading: 'Shipping Costs',
    body: 'Shipping costs are calculated based on the weight and dimensions of your order, as well as your delivery location. The exact shipping cost will be displayed at checkout before you complete your purchase.',
  },
  {
    heading: 'Order Tracking',
    body: "Once your order has been shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package's journey to your doorstep through our website or the courier's tracking portal.",
  },
  {
    heading: 'Damaged or Lost Packages',
    body: 'If your package arrives damaged or goes missing during transit, please contact our customer support team within 48 hours of the expected delivery date. We will work with the courier to investigate and resolve the issue promptly. You may be eligible for a replacement or full refund.',
  },
];

export default async function ShippingPolicyPage() {
  const wpPage = await getPage('shipping-policy');

  // If WordPress has the page, render its content directly
  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
            <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
            <span className="text-zinc-500 text-base font-medium font-['Onest']">Shipping Policy</span>
          </div>
          <h1 className="text-black text-4xl font-medium font-['Onest']"
            dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }}
          />
        </div>
        <div className="w-full px-20 py-10 flex justify-center">
          <div
            className="w-[997px] p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 wp-content"
            dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }}
          />
        </div>
      </main>
    );
  }

  // Fallback: hardcoded content
  return (
    <PolicyPageLayout
      title="Shipping Policy"
      breadcrumb="Shipping Policy"
      sections={[
        {
          heading: 'Shipping Areas',
          body: STATIC_SECTIONS[0].body,
        },
        {
          heading: 'Delivery Timeframes',
          body: (
            <div className="flex flex-col gap-4">
              {DELIVERY_TIMEFRAMES.map((item) => (
                <div key={item.area} className="px-4 border-l-[5px] border-sky-700 flex flex-col gap-2">
                  <p className="text-neutral-950 text-lg font-medium font-['Space_Grotesk']">{item.area}</p>
                  <p className="text-neutral-700 text-base font-normal font-['Space_Grotesk']">{item.time}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: 'Shipping Costs',
          body: (
            <div className="flex flex-col gap-6">
              <p>{STATIC_SECTIONS[1].body}</p>
              <div className="p-6 bg-sky-700/10 rounded-xl">
                <p className="text-sky-700 text-lg font-medium font-['Space_Grotesk'] leading-7">
                  Free Shipping on orders above ₦500,000 within Lagos
                </p>
              </div>
            </div>
          ),
        },
        {
          heading: 'Order Tracking',
          body: STATIC_SECTIONS[2].body,
        },
        {
          heading: 'Damaged or Lost Packages',
          body: STATIC_SECTIONS[3].body,
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our shipping policy, please contact our customer support team at{' '}
              <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a>
              {' '}or call us at{' '}
              <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
