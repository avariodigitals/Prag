'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummary from './CheckoutSummary';

const METHODS = [
  { id: 'local_pickup', label: 'Local Pickup', description: 'Pickup your products from our store.' },
  { id: 'custom_shipping', label: 'Custom Shipping', description: 'Chat with support for your custom shipping arrangement' },
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
    <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col items-center gap-6 md:gap-10">
      <CheckoutStepper activeStep={1} />

      <div className="w-full flex flex-col-reverse md:flex-row items-start gap-6 md:gap-10">
        <div className="w-full md:flex-1 p-4 md:p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-5">
          <h2 className="text-zinc-900 text-lg md:text-xl font-bold font-['Space_Grotesk']">Shipping Method</h2>

          <div className="flex flex-col gap-3">
            {METHODS.map((method) => {
              const active = selected === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`w-full p-3 md:p-4 rounded-2xl outline outline-2 text-left flex flex-col gap-2 transition-colors ${
                    active ? 'bg-slate-50 outline-sky-700' : 'bg-white outline-stone-200 hover:outline-sky-300'
                  }`}
                >
                  <p className={`text-base font-bold font-['Space_Grotesk'] ${active ? 'text-sky-700' : 'text-zinc-500'}`}>
                    {method.label}
                  </p>
                  <p className={`text-sm font-normal font-['Space_Grotesk'] ${active ? 'text-sky-700' : 'text-zinc-500'}`}>
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Delivery Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white rounded-[10px] border-[1.31px] border-gray-200 text-zinc-500 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:text-zinc-900 transition-colors resize-none outline-none"
            />
          </div>

          <button
            onClick={proceed}
            className="hidden md:block w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <CheckoutSummary ctaLabel="Proceed to Payment" onCta={proceed} />
        </div>
      </div>
    </div>
  );
}
