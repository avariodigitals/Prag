'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummary from './CheckoutSummary';

const METHODS = [
  {
    id: 'local_pickup',
    label: 'Local Pickup',
    description: 'Pickup your products from our store.',
  },
  {
    id: 'custom_shipping',
    label: 'Custom Shipping',
    description: 'Chat with support for your custom shipping arrangement',
  },
];

export default function ShippingView() {
  const router = useRouter();
  const [selected, setSelected] = useState('custom_shipping');
  const [note, setNote] = useState('');

  function proceed() {
    const params = new URLSearchParams();
    params.set('shipping_method', selected);
    if (note) params.set('shipping_note', note);
    router.push(`/checkout/payment?${params.toString()}`);
  }

  return (
    <div className="w-full p-20 flex flex-col items-center gap-10">
      <CheckoutStepper activeStep={1} />

      <div className="w-full flex items-start gap-10">
        {/* Shipping method form */}
        <div className="flex-1 p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Space_Grotesk'] leading-8">Shipping Method</h2>

          <div className="flex flex-col gap-3">
            {METHODS.map((method) => {
              const active = selected === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`w-full p-3 rounded-2xl outline outline-2 text-left flex flex-col gap-3 transition-colors ${
                    active
                      ? 'bg-slate-50 outline-sky-700'
                      : 'bg-white outline-stone-200 hover:outline-sky-300'
                  }`}
                >
                  <p className={`text-lg font-bold font-['Space_Grotesk'] leading-7 ${active ? 'text-sky-700' : 'text-zinc-500'}`}>
                    {method.label}
                  </p>
                  <p className={`text-base font-normal font-['DM_Sans'] leading-6 ${active ? 'text-sky-700' : 'text-zinc-500'}`}>
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Delivery Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.31px] border-gray-200 text-zinc-500 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:text-zinc-900 transition-colors resize-none outline-none"
            />
          </div>
        </div>

        <CheckoutSummary ctaLabel="Proceed to Payment" onCta={proceed} />
      </div>
    </div>
  );
}
