'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/CartContext';

function formatPrice(n: number) {
  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

export default function CartView() {
  const { items, remove, update, total } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const vat = 0; // VAT applied at checkout on shop
  const grandTotal = total - discount + vat;

  function applyCoupon() {
    // Coupon validation happens server-side at checkout on shop.xyz.com
    // This is a UI placeholder
    setDiscount(0);
  }

  function proceedToCheckout() {
    // Pass cart as query params or rely on shared session/cookie with shop subdomain
    const params = new URLSearchParams();
    items.forEach((item) => params.append('items', `${item.slug}:${item.quantity}`));
    if (coupon) params.set('coupon', coupon);
    window.location.href = `${SHOP_URL}/checkout?${params.toString()}`;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <p className="text-gray-400 text-xl font-['Space_Grotesk']">Your cart is empty.</p>
        <Link href="/products" className="px-8 py-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-10">
      {/* Items list */}
      <div className="flex-1 p-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-4">
        {items.map((item, idx) => (
          <div key={item.id}>
            <div className="flex justify-between items-center">
              {/* Product info */}
              <div className="flex items-center gap-5">
                <div className="w-32 h-28 relative bg-stone-50 rounded-2xl overflow-hidden shrink-0">
                  <Image src={item.image || '/placeholder-product.png'} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="w-72 text-gray-900 text-xl font-bold font-['Space_Grotesk'] leading-6">{item.name}</p>
                  <p className="text-sky-700 text-lg font-medium font-['Onest']">{formatPrice(item.price)}</p>
                </div>
              </div>

              {/* Qty + remove */}
              <div className="flex items-center gap-7">
                <div className="p-3 bg-stone-50 rounded-3xl outline outline-1 outline-zinc-500/40 flex items-center gap-7">
                  <button onClick={() => update(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                  <span className="text-sky-700 text-base font-medium font-['Inter'] leading-6 min-w-[12px] text-center">
                    {item.quantity}
                  </span>
                  <button onClick={() => update(item.id, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus className="w-3.5 h-3.5 text-sky-700" />
                  </button>
                </div>
                <button onClick={() => remove(item.id)} aria-label="Remove item">
                  <Trash2 className="w-5 h-5 text-zinc-500 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            {idx < items.length - 1 && <div className="w-full h-px bg-gray-200 mt-4" />}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-6 py-8 bg-white rounded-[10px] outline outline-1 outline-gray-200 flex flex-col gap-6 w-[400px] shrink-0">
        <h2 className="text-gray-900 text-2xl font-bold font-['Space_Grotesk'] leading-7">Summary</h2>

        <div className="flex flex-col gap-6">
          {/* Coupon */}
          <div className="flex flex-col gap-3">
            <span className="text-gray-900 text-base font-bold font-['Space_Grotesk'] leading-6">Apply Discount</span>
            <div className="flex items-start gap-4">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter Coupon Code"
                className="flex-1 h-14 pl-5 pr-4 py-3 bg-gray-50 rounded-[30px] text-gray-400 text-sm font-normal font-['Space_Grotesk'] outline-none"
              />
              <button
                onClick={applyCoupon}
                className="w-28 p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200" />

          {/* Totals */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Sub Total</span>
              <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">VAT (7.5%)</span>
              <span className="text-slate-600 text-sm font-normal font-['Space_Grotesk'] leading-5">₦0.00</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Discount</span>
                <span className="text-green-600 text-sm font-normal font-['Space_Grotesk'] leading-5">-{formatPrice(discount)}</span>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-gray-200" />

          <div className="flex justify-between items-center">
            <span className="text-slate-600 text-sm font-medium font-['Space_Grotesk'] leading-5">Total</span>
            <span className="text-slate-800 text-base font-bold font-['Space_Grotesk'] leading-6">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-6">
          <button
            onClick={proceedToCheckout}
            className="w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors"
          >
            Proceed to check out
          </button>
          <Link
            href="/products"
            className="w-full p-4 rounded-3xl outline outline-1 outline-sky-700 text-center text-sky-700 text-base font-medium font-['Space_Grotesk'] hover:bg-sky-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
