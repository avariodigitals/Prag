'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import CheckoutStepper from './CheckoutStepper';

const WHATSAPP_NUMBER = '2348032170129';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

function formatPrice(n: number) {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-zinc-900 text-xs font-bold font-['Montserrat'] leading-5">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-zinc-500 text-sm font-normal font-['Montserrat'] focus:outline-sky-700 focus:text-zinc-900 transition-colors";

function parsePrice(value: string | null): number {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function getEmailFromUserInfoCookie() {
  if (typeof document === 'undefined') return '';

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user_info='));
  if (!cookie) return '';

  const value = cookie.slice('user_info='.length);
  try {
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded) as { email?: unknown };
    return typeof parsed.email === 'string' ? parsed.email.trim() : '';
  } catch {
    return '';
  }
}

export default function CheckoutView() {
  const { items, total } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step] = useState(0);

  const buyNowId = searchParams.get('id');
  const buyNowItem = buyNowId ? {
    id: Number(buyNowId),
    name: searchParams.get('name') ?? '',
    slug: searchParams.get('slug') ?? '',
    price: parsePrice(searchParams.get('price')),
    image: searchParams.get('image') ?? '',
    quantity: Number(searchParams.get('qty') ?? 1),
  } : null;

  const orderItems = buyNowItem ? [buyNowItem] : items;
  const orderTotal = buyNowItem ? buyNowItem.price * (buyNowItem.quantity) : total;

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', company: '',
    phone: '', address: '', city: '', state: '', zip: '', note: '',
  });

  useEffect(() => {
    let active = true;

    const cookieEmail = getEmailFromUserInfoCookie();
    let cookieTimer: number | null = null;
    if (cookieEmail) {
      cookieTimer = window.setTimeout(() => {
        setForm((prev) => (prev.email ? prev : { ...prev, email: cookieEmail }));
      }, 0);
    }

    fetch('/api/account/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (!active || !profile) return;
        const email = typeof profile.email === 'string' ? profile.email.trim() : '';
        if (!email) return;

        setForm((prev) => {
          if (prev.email) return prev;
          return {
            ...prev,
            email,
          };
        });
      })
      .catch(() => {});

    return () => {
      active = false;
      if (cookieTimer !== null) {
        window.clearTimeout(cookieTimer);
      }
    };
  }, []);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function proceedToShipping(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    orderItems.forEach((item) => {
      params.append('line_item', `${item.id}:${item.quantity}`);
      params.append('line_name', item.name);
      params.append('line_price', String(item.price));
    });
    Object.entries(form).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/checkout/shipping?${params.toString()}`);
  }

  return (
    <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col items-center gap-6 md:gap-10">
      <CheckoutStepper activeStep={step} />

      {/* Mobile: summary on top, form below. Desktop: form left (60%), summary right (40%) */}
      <div className="w-full flex flex-col md:flex-row items-start gap-6 md:gap-10">

        {/* Contact form — top on mobile, left on desktop (60%) */}
        <form id="checkout-form" onSubmit={proceedToShipping} className="w-full md:flex-[3] md:order-1 px-4 md:px-6 py-6 md:py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-5">
          <h2 className="text-zinc-900 text-lg md:text-xl font-bold font-['Montserrat']">Contact Details</h2>

          <Field label="Email Address" required>
            <input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" required>
              <input type="text" required value={form.firstName} onChange={set('firstName')} placeholder="John" className={inputCls} />
            </Field>
            <Field label="Last Name" required>
              <input type="text" required value={form.lastName} onChange={set('lastName')} placeholder="Doe" className={inputCls} />
            </Field>
          </div>

          <Field label="Company / Organisation">
            <input type="text" value={form.company} onChange={set('company')} placeholder="Optional" className={inputCls} />
          </Field>

          <Field label="Phone Number" required>
            <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="+234..." className={inputCls} />
          </Field>

          <Field label="Street Address" required>
            <input type="text" required value={form.address} onChange={set('address')} placeholder="Address" className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City" required>
              <input type="text" required value={form.city} onChange={set('city')} placeholder="City" className={inputCls} />
            </Field>
            <Field label="State / Region" required>
              <select required value={form.state} onChange={set('state')} className={inputCls}>
                <option value="">Select state</option>
                {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="ZIP / Postal Code (Optional)">
            <input type="text" value={form.zip} onChange={set('zip')} placeholder="100001" className={inputCls} />
          </Field>

          <Field label="Delivery Note">
            <textarea
              value={form.note}
              onChange={set('note')}
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.31px] border-gray-200 text-zinc-500 text-sm font-normal font-['Montserrat'] focus:border-sky-700 focus:text-zinc-900 transition-colors resize-none outline-none"
            />
          </Field>

          {/* Submit button — visible on desktop inside form, hidden on mobile (mobile uses the one in summary) */}
          <button
            type="submit"
            className="hidden md:block w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Montserrat'] hover:bg-sky-800 transition-colors"
          >
            Proceed to Shipping
          </button>
        </form>

        {/* Order summary — below form on mobile, right on desktop (40%) */}
        <div className="w-full md:flex-[2] md:order-2 px-4 md:px-6 py-6 md:py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-5">
          <h2 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Montserrat']">Summary</h2>

          <div className="flex flex-col gap-4">
            {orderItems.length === 0 ? (
              <p className="text-zinc-400 text-base md:text-lg font-['Montserrat']">No items in cart.</p>
            ) : orderItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {/* Product image — desktop only */}
                {item.image && (
                  <div className="hidden md:block relative w-16 h-16 shrink-0 rounded-[10px] overflow-hidden outline outline-1 outline-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <span className="text-neutral-700 text-base md:text-lg font-normal font-['Montserrat'] leading-5">{item.name} {item.quantity > 1 && <span className="text-zinc-400">×{item.quantity}</span>}</span>
                  <span className="text-sky-700 text-sm font-medium font-['Montserrat']">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp support — desktop only, under product list */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm having issues with my checkout on PRAG.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex w-full h-11 px-4 rounded-3xl outline outline-1 outline-sky-700 justify-center items-center gap-2 hover:bg-sky-50 transition-colors"
          >
            <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-sky-700 text-sm font-medium font-['Montserrat']">Having issues? Chat us on WhatsApp</span>
          </a>

          <div className="w-full h-px bg-gray-200" />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-slate-600 text-base md:text-lg font-medium font-['Montserrat']">Sub Total</span>
              <span className="text-slate-600 text-base md:text-lg font-['Montserrat']">{formatPrice(orderTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 text-base md:text-lg font-medium font-['Montserrat']">VAT (7.5%)</span>
              <span className="text-slate-600 text-base md:text-lg font-['Montserrat']">₦0</span>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200" />

          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-base md:text-lg font-medium font-['Montserrat']">Total</span>
            <span className="text-slate-800 text-base font-bold font-['Montserrat']">{formatPrice(orderTotal)}</span>
          </div>

          {/* Mobile submit button */}
          <button
            type="submit"
            form="checkout-form"
            className="md:hidden w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Montserrat'] hover:bg-sky-800 transition-colors"
          >
            Proceed to Shipping
          </button>
        </div>
      </div>
    </div>
  );
}
