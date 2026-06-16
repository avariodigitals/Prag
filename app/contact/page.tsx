// Public contact page is ISR-cached.
export const revalidate = 900;

import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Store } from '@/lib/types';

export const metadata = { title: 'Customer Support - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

function SocialIcon({ network }: { network: string }) {
  if (network === 'facebook')
    return (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
      </svg>
    );
  if (network === 'instagram')
    return (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    );
  if (network === 'linkedin')
    return (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94A1.97 1.97 0 0 0 5.25 3M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z" />
      </svg>
    );
  if (network === 'twitter')
    return (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2H21l-6.022 6.885L22 22h-5.48l-4.29-5.994L6.98 22H4.22l6.44-7.362L2 2h5.62l3.878 5.422zM17.31 20h1.527L6.79 3.895H5.152z" />
      </svg>
    );
  return null;
}

export default async function ContactPage() {
  const [stores, settings] = await Promise.all([getStores(), getSiteSettings()]);

  const phone = settings.contact_phone || '+2348032170129';
  const email = settings.contact_email || 'sales@prag.global';
  const address = settings.address || '14 Industrial Layout, Victoria Island, Lagos, Nigeria';
  const hoursWeekday = settings.business_hours_weekday || 'Mon–Fri: 8:00 AM – 6:00 PM';
  const hoursSaturday = settings.business_hours_saturday || 'Sat: 9:00 AM – 2:00 PM';
  const socials = settings.socials;

  const socialLinks = [
    { label: 'Facebook', href: socials?.facebook || 'https://www.facebook.com/pragpowersolutions', network: 'facebook' },
    { label: 'Instagram', href: socials?.instagram || 'https://www.instagram.com/prag_ng/', network: 'instagram' },
    { label: 'LinkedIn', href: socials?.linkedin || 'https://www.linkedin.com/company/prag/', network: 'linkedin' },
    { label: 'X (Twitter)', href: socials?.twitter || 'https://x.com/PRAG_Ng', network: 'twitter' },
  ];

  const PRAG_STORE_ORDER = ['obanikoro', 'lagos island', 'alaba', 'abuja', 'port harcourt'];

function sortPragStores(stores: Store[]) {
  return [...stores].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aIndex = PRAG_STORE_ORDER.findIndex((k) => aName.includes(k));
    const bIndex = PRAG_STORE_ORDER.findIndex((k) => bName.includes(k));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return aName.localeCompare(bName);
  });
}

  const pragStores = sortPragStores(stores.filter((s) => s.type === 'prag'));
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-semibold font-['Montserrat'] text-center">Customer Support</h1>
      </div>

      {/* Contact Info + Form */}
      <section className="w-full px-4 sm:px-6 md:px-20 py-8 md:py-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Left: Contact Info */}
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="px-5 py-5 bg-zinc-100 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-lg font-medium font-['Montserrat']">Email</span>
                <a href={`mailto:${email}`} className="text-zinc-900 text-lg font-['Montserrat'] hover:text-sky-700 transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="px-5 py-5 bg-zinc-100 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-lg font-medium font-['Montserrat']">Phone</span>
                <a href={`tel:${phone}`} className="text-zinc-900 text-lg font-['Montserrat'] hover:text-sky-700 transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="px-5 py-5 bg-zinc-100 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-lg font-medium font-['Montserrat']">Location</span>
                <span className="text-zinc-900 text-lg font-['Montserrat']">{address}</span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="px-5 py-5 bg-zinc-100 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-700 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-lg font-medium font-['Montserrat']">Business Hours</span>
                <span className="text-zinc-900 text-lg font-['Montserrat']">{hoursWeekday}</span>
                {hoursSaturday && (
                  <span className="text-zinc-900 text-lg font-['Montserrat']">{hoursSaturday}</span>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="p-4 md:p-5 rounded-2xl border border-zinc-300 md:border-zinc-300 flex flex-col gap-4">
                <span className="text-zinc-900 text-lg font-medium font-['Montserrat']">
                  Follow our socials
                </span>
                <div className="flex flex-nowrap md:flex-wrap items-center gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-1 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center shrink-0 hover:opacity-80 transition-opacity"
                      aria-label={`Follow us on ${s.label}`}
                    >
                      <div className="w-16 h-16 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                        <SocialIcon network={s.network} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Enquiry Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* PRAG / Online / Chain Stores */}
      <section className="w-full py-4 pb-20 flex flex-col gap-16">
        <StoresGrid
          pragStores={pragStores}
          onlineStores={onlineStores}
          chainStores={chainStores}
        />
      </section>

    </main>
  );
}
