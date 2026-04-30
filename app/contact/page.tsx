export const dynamic = 'force-dynamic';

import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';
import { getStores } from '@/lib/woocommerce';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Customer Support – Prag' };

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/prag', icon: 'F' },
  { label: 'Instagram', href: 'https://instagram.com/prag', icon: 'I' },
  { label: 'X/Twitter', href: 'https://x.com/prag', icon: 'X' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/prag', icon: 'in' },
];

export default async function ContactPage() {
  const stores = await getStores();
  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Breadcrumb + title */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">Customer Support</span>
        </div>
        <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']">Customer Support</h1>
      </div>

      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col md:flex-row justify-center items-start gap-8">
        {/* Left: contact info cards */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-6">
            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Email</span>
                <a href="mailto:sales@prag.global" className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-sky-700">
                  sales@prag.global
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Phone</span>
                <a href="tel:+2348032170129" className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] hover:text-sky-700">
                  +2348032170129
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Location */}
            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Location</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">
                  14 Industrial Layout, Victoria Island, Lagos, Nigeria
                </span>
              </div>
            </div>

            {/* Business hours */}
            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Business Hours</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">Mon–Fri: 8:00 AM – 6:00 PM</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">Sat: 9:00 AM – 2:00 PM</span>
              </div>
            </div>

            {/* Socials */}
            <div className="p-5 bg-white rounded-2xl outline outline-1 outline-sky-700 flex flex-col gap-4">
              <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Follow our socials</span>
              <div className="flex flex-wrap gap-4">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{s.icon}</span>
                    </div>
                    <span className="text-zinc-900 text-sm font-normal font-['Space_Grotesk'] leading-5">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: contact form */}
        <ContactForm />
      </div>

      {/* Stores sections */}
      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
    </main>
  );
}
