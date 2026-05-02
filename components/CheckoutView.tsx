'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import CheckoutStepper from './CheckoutStepper';

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
      <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-zinc-500 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 focus:text-zinc-900 transition-colors";

export default function CheckoutView() {
  const { items, total } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step] = useState(0);

  // Buy Now mode — product passed via query params, bypasses cart
  const buyNowId = searchParams.get('id');
  const buyNowItem = buyNowId ? {
    id: Number(buyNowId),
    name: searchParams.get('name') ?? '',
    slug: searchParams.get('slug') ?? '',
    price: Number(searchParams.get('price') ?? 0),
    image: searchParams.get('image') ?? '',
    quantity: Number(searchParams.get('qty') ?? 1),
  } : null;

  const orderItems = buyNowItem ? [buyNowItem] : items;
  const orderTotal = buyNowItem ? buyNowItem.price : total;

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', company: '',
    phone: '', address: '', city: '', state: '', zip: '', note: '',
  });

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function proceedToShipping(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    orderItems.forEach((item) => params.append('items', `${item.slug}:${item.quantity}`));
    Object.entries(form).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/checkout/shipping?${params.toString()}`);
  }

  return (
    <div className="w-full p-20 flex flex-col items-center gap-10">
      {/* Step indicator */}
      <CheckoutStepper activeStep={step} />

      {/* Form + Summary */}
      <div className="w-full flex items-start gap-10">
        {/* Contact form */}
        <form onSubmit={proceedToShipping} className="flex-1 p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Space_Grotesk'] leading-8">Contact Details</h2>

          <div className="flex flex-col gap-4">
            <Field label="Email Address" required>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputCls} />
            </Field>

            <div className="flex gap-4">
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

            <div className="flex gap-4">
              <Field label="City" required>
                <input type="text" required value={form.city} onChange={set('city')} placeholder="City" className={inputCls} />
              </Field>
              <Field label="State / Region" required>
                <select required value={form.state} onChange={set('state')} className={inputCls}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="ZIP / Postal Code (Optional)">
                <input type="text" value={form.zip} onChange={set('zip')} placeholder="100001" className={inputCls} />
              </Field>
            </div>
          </div>

          <Field label="Delivery Note">
            <textarea
              value={form.note}
              onChange={set('note')}
              rows={3}
              className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.31px] border-gray-200 text-zinc-500 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:text-zinc-900 transition-colors resize-none outline-none"
            />
          </Field>

          <button
            type="submit"
            className="hidden"
            id="checkout-submit"
          />
        </form>

        {/* Order summary */}
        <div className="w-96 shrink-0 px-6 py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-6">
          <h2 className="text-neutral-700 text-2xl font-bold font-['Space_Grotesk'] leading-7">Summary</h2>

          <div className="flex flex-col gap-6">
            {/* Item list */}
            <div className="flex flex-col gap-4">
              {orderItems.length === 0 ? (
                <p className="text-zinc-400 text-sm font-['Space_Grotesk']">No items in cart.</p>
              ) : orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="w-48 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-4">{item.name}</span>
                  <span className="text-sky-700 text-xs font-medium font-['Onest']">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Sub Total</span>
                <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">{formatPrice(orderTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">VAT (7.5%)</span>
                <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">₦0.00</span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Total</span>
              <span className="text-slate-800 text-base font-bold font-['Space_Grotesk'] leading-6">{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <button
            form="checkout-submit"
            type="submit"
            onClick={() => (document.getElementById('checkout-submit') as HTMLButtonElement)?.click()}
            className="w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors text-center"
          >
            Proceed to Shipping
          </button>
        </div>
      </div>
    </div>
  );
}
