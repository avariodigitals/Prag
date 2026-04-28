'use client';

import { useCart } from '@/lib/CartContext';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

interface Props {
  ctaLabel: string;
  onCta: () => void;
  shippingCost?: number;
}

export default function CheckoutSummary({ ctaLabel, onCta, shippingCost }: Props) {
  const { items, total } = useCart();
  const grandTotal = total + (shippingCost ?? 0);

  return (
    <div className="w-96 shrink-0 px-6 py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-6">
      <h2 className="text-neutral-700 text-2xl font-bold font-['Space_Grotesk'] leading-7">Summary</h2>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="w-48 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-4">{item.name}</span>
            <span className="text-sky-700 text-xs font-medium font-['Onest']">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Sub Total</span>
          <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">{fmt(total)}</span>
        </div>
        {shippingCost !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Shipping</span>
            <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">{fmt(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">VAT (7.5%)</span>
          <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">₦0.00</span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex justify-between items-center">
        <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Total</span>
        <span className="text-slate-800 text-base font-bold font-['Space_Grotesk'] leading-6">{fmt(grandTotal)}</span>
      </div>

      <button
        onClick={onCta}
        className="w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors text-center"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
