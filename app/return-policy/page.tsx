import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';

export const metadata = { title: 'Return Policy - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

export default async function ReturnPolicyPage() {
  const wpPage = await getPage('return-policy');

  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
          <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat']"
            dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }}
          />
        </div>
        <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
          <div
            className="w-[997px] p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 wp-content"
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
          heading: 'Return Eligibility',
          body: (
            <div className="flex flex-col gap-2">
              <p className="font-medium">Returns are accepted only where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The product is unused</li>
                <li>The product is in original packaging</li>
                <li>The request is made within 7 days of purchase</li>
              </ul>
            </div>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          body: (
            <div className="flex flex-col gap-2">
              <p className="font-medium">The following are not eligible for return:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Installed products</li>
                <li>Used or damaged products</li>
                <li>Custom or special-order items</li>
              </ul>
            </div>
          ),
        },
        {
          heading: 'Refunds',
          body: (
            <div className="flex flex-col gap-2">
              <p className="font-medium">Approved returns may be:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Exchanged, or</li>
                <li>Refunded via the original payment method</li>
              </ul>
            </div>
          ),
        },
        {
          heading: 'Important Notice',
          body: (
            <div className="p-4 bg-sky-100 rounded-lg border-l-4 border-sky-700">
              <p className="text-sky-900 font-medium">
                Once a product has been installed, it is deemed accepted and cannot be returned.
              </p>
            </div>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <p>
              If you have any questions about our return policy, please contact our customer support team at{' '}
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
