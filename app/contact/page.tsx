export const dynamic = 'force-dynamic';

import ContactForm from '@/components/ContactForm';
import StoresGrid from '@/components/StoresGrid';
import { getStores, getSiteSettings } from '@/lib/woocommerce';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = { title: 'Customer Support - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

function SocialIcon({ network }: { network: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'whatsapp' }) {
  if (network === 'facebook') {
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12"/></svg>;
  }

  if (network === 'instagram') {
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>;
  }

  if (network === 'linkedin') {
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94M20.44 20h-3.37v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95V20H9.7V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.43 0 4.06 2.26 4.06 5.2z"/></svg>;
  }

  if (network === 'twitter') {
    return <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.01 6.87L22 22h-5.48l-4.29-5.6L7.2 22H4.44l6.43-7.35L2 2h5.62l3.88 5.13zm-.97 18.35h1.53L6.8 3.57H5.17z"/></svg>;
  }

  return <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>;
}

export default async function ContactPage() {
  const [stores, settings] = await Promise.all([getStores(), getSiteSettings()]);

  const phone = settings.contact_phone || '+2348032170129';
  const email = settings.contact_email || 'sales@prag.global';
  const address = settings.address || '14 Industrial Layout, Victoria Island, Lagos, Nigeria';
  const hoursWeekday = settings.business_hours_weekday || 'Mon–Fri: 8:00 AM – 6:00 PM';
  const hoursSaturday = settings.business_hours_saturday || 'Sat: 9:00 AM – 2:00 PM';
  const socials = settings.socials;
  const whatsappHref = socials?.whatsapp || `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  const socialLinks = [
    { label: 'Facebook', href: socials?.facebook, network: 'facebook' as const },
    { label: 'Instagram', href: socials?.instagram, network: 'instagram' as const },
    { label: 'LinkedIn', href: socials?.linkedin, network: 'linkedin' as const },
    { label: 'Twitter / X', href: socials?.twitter, network: 'twitter' as const },
    { label: 'WhatsApp', href: whatsappHref, network: 'whatsapp' as const },
  ].filter((s) => Boolean(s.href));

  const pragStores = stores.filter((s) => s.type === 'prag');
  const onlineStores = stores.filter((s) => s.type === 'online');
  const chainStores = stores.filter((s) => s.type === 'chain');

  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-semibold font-['Montserrat']">Customer Support</h1>
      </div>

      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col md:flex-row justify-center items-start gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Email</span>
                <a href={`mailto:${email}`} className="text-neutral-500 text-sm font-normal font-['Montserrat'] leading-5 hover:text-sky-700">{email}</a>
              </div>
            </div>

            <div className="h-20 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Phone</span>
                <a href={`tel:${phone}`} className="text-zinc-500 text-sm font-normal font-['Montserrat'] hover:text-sky-700">{phone}</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Location</span>
                <span className="text-neutral-500 text-base md:text-lg font-normal font-['Montserrat'] leading-5">{address}</span>
              </div>
            </div>

            <div className="h-24 p-5 bg-stone-50 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Business Hours</span>
                <span className="text-neutral-500 text-base md:text-lg font-normal font-['Montserrat'] leading-5">{hoursWeekday}</span>
                <span className="text-neutral-500 text-base md:text-lg font-normal font-['Montserrat'] leading-5">{hoursSaturday}</span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="p-5 bg-white rounded-2xl outline outline-1 outline-sky-700 flex flex-col gap-4">
                <span className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Follow our socials</span>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sky-700 rounded-full flex items-center justify-center">
                        <SocialIcon network={s.network} />
                      </div>
                      <span className="text-zinc-900 text-base md:text-lg font-normal font-['Montserrat'] leading-5">{s.label}</span>
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
