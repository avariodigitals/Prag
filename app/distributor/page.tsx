import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DistributorForm from '@/components/DistributorForm';

export const metadata = { title: 'Become a Distributor – Prag' };

const BENEFITS = [
  { title: 'High-Margin Products', body: 'Prag distributors earn industry-leading margins on our full product range — stabilizers, inverters, batteries, and solar.' },
  { title: 'Exclusive Territories', body: "We offer protected territories so you're not competing with other Prag distributors in your area." },
  { title: 'Technical Training', body: 'Comprehensive product training and certification so your team can advise customers with authority.' },
  { title: 'Sales & Marketing Support', body: 'Co-branded marketing materials, digital assets, and dedicated account management from our team.' },
  { title: 'Prag Certification', body: 'Carry the Prag Certified Partner badge — a mark of quality that builds customer trust in your market.' },
  { title: 'Nationwide Network', body: 'Join a growing network of distributors across all 36 states and leverage shared referrals and leads.' },
];

const TIERS = [
  { title: 'Become an Authorized Dealer', body: "As a dealer, you'll be equipped with the tools, pricing, and support needed to sell confidently and grow your business in a rapidly expanding market." },
  { title: 'Partner as a Certified Installer', body: "As a certified installer, you'll handle system setup while we ensure you have access to the right equipment, and ongoing support to execute projects seamlessly." },
  { title: 'Join as a Product Reseller', body: 'Expand your offerings by reselling Prag solar solutions to your network. With flexible purchasing options and competitive margins.' },
];

export default function DistributorPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      <div className="w-full pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">Sell the Solutions Nigeria Needs.</h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Partner with Prag and build a profitable business distributing Nigeria&apos;s most trusted power engineering products.
        </p>
      </div>

      {/* Benefits */}
      <section className="w-full px-20 py-12 flex flex-col gap-20">
        <div className="flex items-start gap-24">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-sky-700" />
              <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">PARTNER BENEFITS</span>
            </div>
            <h2 className="w-[631px] text-zinc-900 text-5xl font-bold font-['Onest']">Everything You Need to Build a Thriving Power Business</h2>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {[BENEFITS.slice(0, 3), BENEFITS.slice(3)].map((row, ri) => (
            <div key={ri} className="flex gap-6">
              {row.map((b) => (
                <div key={b.title} className="flex-1 p-6 rounded-3xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-36">
                  <div className="flex flex-col gap-4">
                    <div className="w-8 h-8 bg-sky-700 rounded-full" />
                    <h3 className="text-zinc-900 text-2xl font-medium font-['Onest']">{b.title}</h3>
                  </div>
                  <p className="text-neutral-700 text-lg font-normal font-['Onest']">{b.body}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Partnership tiers */}
      <section className="w-full px-20 py-24 flex flex-col gap-20">
        <div className="flex flex-col items-center gap-7">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">PARTNERSHIP TIER</span>
          </div>
          <h2 className="w-[631px] text-center text-zinc-900 text-5xl font-bold font-['Onest']">Choose the Tier That Fits Your Business</h2>
        </div>
        <div className="flex gap-6">
          {TIERS.map((tier) => (
            <div key={tier.title} className="flex-1 p-6 bg-white rounded-3xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-36">
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-sky-700 rounded-full w-fit">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <h3 className="text-zinc-900 text-2xl font-medium font-['Onest']">{tier.title}</h3>
              </div>
              <p className="text-neutral-700 text-lg font-normal font-['Onest']">{tier.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section className="w-full px-20 py-24 bg-neutral-50 flex flex-col items-center gap-20">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">APPLICATION FORM</span>
          </div>
          <h2 className="w-[631px] text-center text-zinc-900 text-5xl font-bold font-['Onest']">Start Your Prag Partnership</h2>
          <p className="w-[840px] text-center text-neutral-700 text-xl font-normal font-['Onest']">
            Fill in the form below and our partnership team will contact you within 2 business days.
          </p>
        </div>
        <DistributorForm />
      </section>

      <Footer />
    </main>
  );
}
