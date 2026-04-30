export const dynamic = 'force-dynamic';

import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy – Prag' };

const SECTIONS = [
  {
    heading: 'Information We Collect',
    body: (
      <p>We may collect the following types of information:<br /><br />
        Personal details (name, email address, phone number)<br />
        Billing and shipping information<br />
        Order and transaction history<br />
        Website usage data (via cookies and analytics tools)
      </p>
    ),
  },
  {
    heading: 'How We Use Your Information',
    body: (
      <p>Your information is used to:<br /><br />
        Process and deliver your orders<br />
        Provide customer support<br />
        Improve our products and services<br />
        Send updates, promotions, and important notifications<br />
        Ensure website security and prevent fraud
      </p>
    ),
  },
  {
    heading: 'Sharing Your Information',
    body: (
      <p>We do not sell or rent your personal data.<br /><br />
        We may share your information with:<br />
        Logistics and delivery partners<br />
        Payment processors<br />
        Service providers assisting in operations<br /><br />
        All third parties are required to handle your data securely.
      </p>
    ),
  },
  {
    heading: 'Data Security',
    body: 'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse. However, no system is completely secure, and we cannot guarantee absolute security.',
  },
  {
    heading: 'Cookies & Tracking Technologies',
    body: 'Our website uses cookies to enhance your browsing experience, analyze traffic, and personalize content. You can manage or disable cookies through your browser settings.',
  },
  {
    heading: 'Your Rights',
    body: (
      <p>You have the right to:<br />
        Access the personal data we hold about you<br />
        Request corrections or updates<br />
        Request deletion of your data (where applicable)<br />
        Opt out of marketing communications
      </p>
    ),
  },
  {
    heading: 'Data Retention',
    body: 'We retain your information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.',
  },
  {
    heading: 'Updates to This Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page.',
  },
  {
    heading: 'Contact Us',
    body: (
      <p>If you have any questions, please contact our customer support team at{' '}
        <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a>
        {' '}or call us at{' '}
        <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.
      </p>
    ),
  },
];

export default async function PrivacyPage() {
  const wpPage = await getPage('privacy-policy');
  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
            <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
            <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">Privacy Policy</span>
          </div>
          <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }} />
        </div>
        <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
          <div className="w-full max-w-[997px] p-4 md:p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 wp-content"
            dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }} />
        </div>
      </main>
    );
  }
  return <PolicyPageLayout title="Privacy Policy" breadcrumb="Privacy Policy" sections={SECTIONS} />;
}
