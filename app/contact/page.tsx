export const dynamic = 'force-dynamic';

import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Customer Support – Prag' };

export default async function ContactPage() {
  const [stores, settings] = await Promise.all([getStores(), getSiteSettings()]);

  const phone = settings.contact_phone || '+2348032170129';
  const email = settings.contact_email || 'sales@prag.global';
  const address = settings.address || '14 Industrial Layout, Victoria Island, Lagos, Nigeria';
  const hoursWeekday = settings.business_hours_weekday || 'Mon–Fri: 8:00 AM – 6:00 PM';
  const hoursSaturday = settings.business_hours_saturday || 'Sat: 9:00 AM – 2:00 PM';
  const socials = settings.socials;

  const socialLinks = [
    { label: 'Facebook',   href: socials?.facebook,  icon: 'F' },
    { label: 'Instagram',  href: socials?.instagram, icon: 'I' },
    { label: 'LinkedIn',   href: socials?.linkedin,  icon: 'in' },
    { label: 'Twitter / X', href: socials?.twitter,  icon: 'X' },
  ].filter(s => s.href);

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-sm font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-xs font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-xs font-medium font-['Onest']">Customer Support</span>
        </div>
        <h1 className="text-black text-xl md:text-3xl font-semibold font-['Onest']">Customer Support</h1>
      </div>

      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Email</span>
                <a href={`mailto:${email}`} className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5 hover:text-sky-700">{email}</a>
              </div>
            </div>

            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Phone</span>
                <a href={`tel:${phone}`} className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] hover:text-sky-700">{phone}</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Location</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">{address}</span>
              </div>
            </div>

            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Business Hours</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">{hoursWeekday}</span>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk'] leading-5">{hoursSaturday}</span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="p-5 bg-white rounded-2xl outline outline-1 outline-sky-700 flex flex-col gap-4">
                <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Follow our socials</span>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{s.icon}</span>
                      </div>
                      <span className="text-zinc-900 text-sm font-normal font-['Space_Grotesk'] leading-5">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ContactForm />
      </div>

      <StoresGrid pragStores={pragStores} onlineStores={onlineStores} chainStores={chainStores} />
    </main>
  );
}
