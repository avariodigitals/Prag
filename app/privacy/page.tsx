import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy – Prag' };

const SECTIONS = [
  { heading: 'Information We Collect', body: (<><p>We may collect: personal details (name, email, phone), billing and shipping information, order and transaction history, and website usage data via cookies.</p></>) },
  { heading: 'How We Use Your Information', body: (<><p>Your information is used to process and deliver orders, provide customer support, improve our products and services, send updates and promotions, and ensure website security.</p></>) },
  { heading: 'Sharing Your Information', body: (<><p>We do not sell or rent your personal data. We may share it with logistics partners, payment processors, and service providers — all required to handle your data securely.</p></>) },
  { heading: 'Data Security', body: 'We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or misuse.' },
  { heading: 'Cookies & Tracking Technologies', body: 'Our website uses cookies to enhance your browsing experience, analyze traffic, and personalize content. You can manage or disable cookies through your browser settings.' },
  { heading: 'Your Rights', body: (<><p>You have the right to access, correct, or delete your personal data, and to opt out of marketing communications.</p></>) },
  { heading: 'Data Retention', body: 'We retain your information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.' },
  { heading: 'Updates to This Policy', body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page.' },
  { heading: 'Contact Us', body: (<p>Questions? Contact us at <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a> or <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.</p>) },
];

export default async function PrivacyPage() {
  const wpPage = await getPage('privacy-policy');
  if (wpPage) {
    return (
      <main className="w-full bg-white flex flex-col">
        <TopBar /><NavBar />
        <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
            <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
            <span className="text-zinc-500 text-base font-medium font-['Onest']">Privacy Policy</span>
          </div>
          <h1 className="text-black text-4xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }} />
        </div>
        <div className="w-full px-20 py-10 flex justify-center">
          <div className="w-[997px] p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 prose prose-sky max-w-none font-['Space_Grotesk']"
            dangerouslySetInnerHTML={{ __html: wpPage.content.rendered }} />
        </div>
        <Footer />
      </main>
    );
  }
  return <PolicyPageLayout title="Privacy Policy" breadcrumb="Privacy Policy" sections={SECTIONS} />;
}
