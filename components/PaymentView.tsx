'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummary from './CheckoutSummary';

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

// These IDs map to WooCommerce payment gateway IDs on shop.xyz.com
const PAYMENT_METHODS = [
  { id: 'card', label: 'Pay with Card', description: 'Pay with credit or Debit Card' },
  { id: 'palmpay', label: 'Palmpay', description: 'To use this option, you must be registered with Palmpay' },
  { id: 'opay', label: 'Opay', description: 'To use this option, you must be registered with Opay' },
  { id: 'paystack', label: 'Pay with Bank Cards - Paystack', description: 'Pay with Cards via Paystack' },
  { id: 'bacs', label: 'Bank Transfer', description: 'You will be directed to pay to an account number' },
];

// Shipping cost passed from shipping step via query param (TBD from WooCommerce rates)
const SHIPPING_COST = 0;

export default function PaymentView() {
  const searchParams = useSearchParams();
  const { items, clear } = useCart();
  const [selected, setSelected] = useState('card');

  function proceed() {
    const params = new URLSearchParams(searchParams.toString());
    items.forEach((item) => params.append('items', `${item.slug}:${item.quantity}`));
    params.set('payment_method', selected);
    // WooCommerce should redirect back to /order-received?order_id=XXX&order_date=XXX after payment
    params.set('return_url', `${window.location.origin}/order-received`);
    clear();
    window.location.href = `${SHOP_URL}/checkout?${params.toString()}`;
  }

  return (
    <div className="w-full p-20 flex flex-col items-center gap-10">
      <CheckoutStepper activeStep={2} />

      <div className="w-full flex items-start gap-10">
        {/* Payment method selector */}
        <div className="flex-1 p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-6">
          <h2 className="text-zinc-900 text-xl font-bold font-['Space_Grotesk'] leading-8">Payment Method</h2>

          <div className="flex flex-col gap-4">
            {PAYMENT_METHODS.map((method, idx) => {
              const active = selected === method.id;
              const isLast = idx === PAYMENT_METHODS.length - 1;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`w-full py-2 text-left flex items-center gap-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                >
                  {/* Radio indicator */}
                  <div className="shrink-0 w-5 h-5 relative">
                    <div className={`w-5 h-5 rounded-full border absolute inset-0 ${active ? 'border-sky-700 bg-white' : 'border-gray-300 bg-white'}`} />
                    {active && <div className="w-2.5 h-2.5 bg-sky-700 rounded-full absolute top-[5px] left-[5px]" />}
                  </div>

                  <div className="flex flex-col gap-[5px]">
                    <span className="text-black text-base font-normal font-['Space_Grotesk'] leading-6">{method.label}</span>
                    <span className="text-slate-600 text-xs font-normal font-['Space_Grotesk'] leading-4">{method.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <CheckoutSummary
          ctaLabel="Proceed"
          onCta={proceed}
          shippingCost={SHIPPING_COST}
        />
      </div>
    </div>
  );
}
