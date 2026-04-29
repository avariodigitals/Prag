import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Return Policy – Prag' };

const RETURN_STEPS = [
  {
    heading: 'Contact Customer Support',
    body: 'Email us at sales@prag.global or call +2348032170129 with your order number and reason for return.',
  },
  {
    heading: 'Receive Return Authorization',
    body: 'Our team will review your request and provide you with a Return Authorization (RA) number and return shipping instructions.',
  },
  {
    heading: 'Ship the Product Back',
    body: 'Pack the item securely in its original packaging and ship it back to us using the provided instructions. Include your RA number on the package.',
  },
  {
    heading: 'Receive Your Refund',
    body: "Once we receive and inspect the returned item, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method.",
  },
];

const contactLine = (
  <p>
    If you have any questions about our return policy, please contact our customer support team at{' '}
    <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a>
    {' '}or call us at{' '}
    <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.
  </p>
);

export default async function ReturnPolicyPage() {
  const wpPage = await getPage('return-policy');

  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
            <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
            <span className="text-zinc-500 text-base font-medium font-['Onest']">Return Policy</span>
          </div>
          <h1 className="text-black text-4xl font-medium font-['Onest']"
            dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }}
          />
        </div>
        <div className="w-full px-20 py-10 flex justify-center">
          <div
            className="w-[997px] p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 prose prose-sky max-w-none font-['Space_Grotesk']"
            dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }}
          />
        </div>
      </main>
    );
  }

  return (
    <PolicyPageLayout
      title="Return Policy"
      breadcrumb="Return Policy"
      sections={[
        {
          heading: '30-Day Return Window',
          body: "We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 30 days of delivery for a full refund or exchange. The product must be in its original condition, unused, and in the original packaging.",
        },
        {
          heading: 'Eligibility for Returns',
          body: (
            <div className="flex flex-col gap-1">
              <p>To be eligible for a return, your item must meet the following conditions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The product is in its original condition and packaging</li>
                <li>All accessories, manuals, and warranty cards are included</li>
                <li>The product has not been installed or used</li>
                <li>The return is initiated within 30 days of delivery</li>
              </ul>
            </div>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          body: (
            <div className="flex flex-col gap-1">
              <p>Certain items cannot be returned for hygiene and safety reasons:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Installed products (solar panels, inverters that have been connected)</li>
                <li>Used batteries or batteries with broken seals</li>
                <li>Custom-ordered or special-order items</li>
                <li>Products damaged due to misuse or improper handling</li>
              </ul>
            </div>
          ),
        },
        {
          heading: 'How to Initiate a Return',
          body: (
            <div className="flex flex-col gap-4">
              {RETURN_STEPS.map((step) => (
                <div key={step.heading} className="px-4 border-l-[5px] border-sky-700 flex flex-col gap-2">
                  <p className="text-neutral-950 text-lg font-medium font-['Space_Grotesk']">{step.heading}</p>
                  <p className="text-neutral-700 text-base font-normal font-['Space_Grotesk']">{step.body}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: 'Return Shipping Costs',
          body: "If the return is due to our error (wrong item shipped, defective product, etc.), we will cover the return shipping costs. For all other returns, the customer is responsible for return shipping fees.",
        },
        {
          heading: 'Exchanges',
          body: "If you need to exchange an item for a different model or variant, please follow the return process above and place a new order for the desired item. This ensures faster processing and delivery of your replacement.",
        },
        {
          heading: 'Warranty Claims',
          body: "For warranty-related issues, please refer to the manufacturer's warranty documentation included with your product. Most of our products come with a manufacturer's warranty ranging from 1 to 5 years. Contact us for assistance with warranty claims.",
        },
        {
          heading: 'Contact Us',
          body: contactLine,
        },
      ]}
    />
  );
}
