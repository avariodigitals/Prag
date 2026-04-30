import { getPage } from '@/lib/woocommerce';
import PolicyPageLayout from '@/components/PolicyPageLayout';
import Link from 'next/link';

export const metadata = { title: 'Terms of Use – Prag' };

const SECTIONS = [
  { heading: 'Use of Our Website', body: 'You agree to use this website only for lawful purposes. You must not use it in any way that may damage, disrupt, or interfere with the functionality, security, or accessibility of the platform. We reserve the right to restrict or terminate access to any user who violates these terms.' },
  { heading: 'Product Information & Availability', body: (<><p>We strive to ensure that all product descriptions, specifications, and pricing are accurate and up to date. However, errors may occasionally occur.</p><p className="mt-2">Prag reserves the right to correct any errors, update product information without prior notice, and modify or discontinue products at any time.</p></>) },
  { heading: 'Orders & Payments', body: (<><p>All orders are subject to acceptance and availability. Prag reserves the right to cancel or refuse any order, limit quantities purchased, or request additional verification before processing.</p><p className="mt-2">Payments must be completed through our approved payment methods.</p></>) },
  { heading: 'Installation & Services', body: (<><p>For installation and technical services, Prag will provide timelines and scope based on your selected package. Delays may occur due to site conditions, weather or logistics, or availability of materials. We will communicate any changes promptly.</p></>) },
  { heading: 'Intellectual Property', body: 'All content on this website, including text, images, graphics, and logos, is the property of Prag and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or use any content without prior written consent.' },
  { heading: 'Third-Party Links', body: 'Our website may contain links to third-party websites. Prag is not responsible for the content, policies, or practices of these external sites.' },
  { heading: 'Limitation of Liability', body: 'Prag shall not be held liable for any indirect, incidental, or consequential damages arising from the use or inability to use our website, products, or services. All products and services are provided "as is" without warranties unless explicitly stated.' },
  { heading: 'Changes to These Terms', body: 'We reserve the right to update or modify these Terms of Use at any time. Continued use of the website constitutes acceptance of the updated terms.' },
  { heading: 'Contact Us', body: (<p>If you have any questions, please contact us at <a href="mailto:sales@prag.global" className="text-sky-700 underline">sales@prag.global</a> or call <a href="tel:+2348032170129" className="text-sky-700 underline">+2348032170129</a>.</p>) },
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
          <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']" dangerouslySetInnerHTML={{ __html: wpPage.title.rendered }} />
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
