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
    <div className="w-full md:w-80 lg:w-96 shrink-0 px-4 md:px-6 py-6 md:py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-5">
      <h2 className="text-neutral-700 text-xl md:text-2xl font-bold font-['Space_Grotesk']">Summary</h2>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-zinc-400 text-sm font-['Space_Grotesk']">No items in cart.</p>
        ) : items.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-2">
            <span className="flex-1 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">
              {item.name} {item.quantity > 1 && <span className="text-zinc-400">×{item.quantity}</span>}
            </span>
            <span className="text-sky-700 text-sm font-medium font-['Onest'] shrink-0">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk']">Sub Total</span>
          <span className="text-slate-600 text-sm font-['Space_Grotesk']">{fmt(total)}</span>
        </div>
        {shippingCost !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk']">Shipping</span>
            <span className="text-slate-600 text-sm font-['Space_Grotesk']">{fmt(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk']">VAT (7.5%)</span>
          <span className="text-slate-600 text-sm font-['Space_Grotesk']">₦0.00</span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="flex justify-between items-center">
        <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk']">Total</span>
        <span className="text-slate-800 text-base font-bold font-['Space_Grotesk']">{fmt(grandTotal)}</span>
      </div>

      <button
        onClick={onCta}
        className="w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
