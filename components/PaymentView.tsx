'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummary from './CheckoutSummary';

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Pay with Card', description: 'Pay with credit or Debit Card' },
  { id: 'palmpay', label: 'Palmpay', description: 'To use this option, you must be registered with Palmpay' },
  { id: 'opay', label: 'Opay', description: 'To use this option, you must be registered with Opay' },
  { id: 'paystack', label: 'Pay with Bank Cards - Paystack', description: 'Pay with Cards via Paystack' },
  { id: 'bacs', label: 'Bank Transfer', description: 'You will be directed to pay to an account number' },
];

const SHIPPING_COST = 0;

export default function PaymentView() {
  const searchParams = useSearchParams();
  const { items, clear } = useCart();
  const [selected, setSelected] = useState('card');

  function proceed() {
    const params = new URLSearchParams(searchParams.toString());
    items.forEach((item) => params.append('items', `${item.slug}:${item.quantity}`));
    params.set('payment_method', selected);
    params.set('return_url', `${window.location.origin}/order-received`);
    clear();
    window.location.href = `${SHOP_URL}/checkout?${params.toString()}`;
  }

  return (
    <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col items-center gap-6 md:gap-10">
      <CheckoutStepper activeStep={2} />

      <div className="w-full flex flex-col-reverse md:flex-row items-start gap-6 md:gap-10">
        <div className="w-full md:flex-1 p-4 md:p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-5">
          <h2 className="text-zinc-900 text-lg md:text-xl font-bold font-['Space_Grotesk']">Payment Method</h2>

          <div className="flex flex-col gap-1">
            {PAYMENT_METHODS.map((method, idx) => {
              const active = selected === method.id;
              const isLast = idx === PAYMENT_METHODS.length - 1;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`w-full py-3 text-left flex items-center gap-3 ${!isLast ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="shrink-0 w-5 h-5 relative">
                    <div className={`w-5 h-5 rounded-full border absolute inset-0 ${active ? 'border-sky-700' : 'border-gray-300'}`} />
                    {active && <div className="w-2.5 h-2.5 bg-sky-700 rounded-full absolute top-[5px] left-[5px]" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-black text-sm md:text-base font-normal font-['Space_Grotesk']">{method.label}</span>
                    <span className="text-slate-500 text-xs font-normal font-['Space_Grotesk']">{method.description}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={proceed}
            className="hidden md:block w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
          >
            Proceed
          </button>
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <CheckoutSummary ctaLabel="Proceed" onCta={proceed} shippingCost={SHIPPING_COST} />
        </div>
      </div>
    </div>
  );
}
