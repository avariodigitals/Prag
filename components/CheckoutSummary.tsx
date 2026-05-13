'use client';

import { useCart } from '@/lib/CartContext';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

interface Props {
  ctaLabel: string;
  onCta: () => void;
  shippingCost?: number;
  ctaDisabled?: boolean;
  itemsOverride?: Array<{ id: number; name: string; quantity: number; price: number }>;
  totalOverride?: number;
  hideMobileButton?: boolean;
}

export default function CheckoutSummary({ ctaLabel, onCta, shippingCost, ctaDisabled, itemsOverride, totalOverride, hideMobileButton }: Props) {
  const { items, total } = useCart();
  const summaryItems = itemsOverride && itemsOverride.length > 0 ? itemsOverride : items;
  const subTotal = totalOverride !== undefined ? totalOverride : total;
  const grandTotal = subTotal + (shippingCost ?? 0);

  return (
    <div className="w-full md:w-80 lg:w-96 shrink-0 px-4 md:px-6 py-6 md:py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-5">
      <h2 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Montserrat']">Summary</h2>

      <div className="flex flex-col gap-3">
        {summaryItems.length === 0 ? (
          <p className="text-zinc-400 text-base font-['Montserrat']">No items in cart.</p>
        ) : summaryItems.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-2">
            <span className="flex-1 text-neutral-700 text-base font-normal font-['Montserrat'] leading-6">
              {item.name} {item.quantity > 1 && <span className="text-zinc-400">×{item.quantity}</span>}
            </span>
            <span className="text-sky-700 text-base font-medium font-['Montserrat'] shrink-0">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-slate-600 text-base font-medium font-['Montserrat']">Sub Total</span>
          <span className="text-slate-600 text-base font-['Montserrat']">{fmt(subTotal)}</span>
        </div>
        {shippingCost !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-600 text-base font-medium font-['Montserrat']">Shipping</span>
            <span className="text-slate-600 text-base font-['Montserrat']">{fmt(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 text-base font-medium font-['Montserrat']">VAT (7.5%)</span>
          <span className="text-slate-600 text-base font-['Montserrat']">₦0.00</span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex justify-between items-center">
        <span className="text-slate-600 text-base font-medium font-['Montserrat']">Total</span>
        <span className="text-slate-800 text-base font-bold font-['Montserrat']">{fmt(grandTotal)}</span>
      </div>

      {!hideMobileButton && (
        <button
          onClick={onCta}
          disabled={ctaDisabled}
          className="md:hidden w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Montserrat'] hover:bg-sky-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
