'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import CheckoutStepper from './CheckoutStepper';
import CheckoutSummary from './CheckoutSummary';

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
}

const SHIPPING_COST = 0;

export default function PaymentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clear } = useCart();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState('');
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const lineItems = useMemo(() => {
    const fromQuery = searchParams.getAll('line_item')
      .map((entry) => {
        const [idRaw, qtyRaw] = entry.split(':');
        const productId = Number(idRaw);
        const quantity = Number(qtyRaw);
        if (!Number.isFinite(productId) || productId <= 0 || !Number.isFinite(quantity) || quantity <= 0) return null;
        return { product_id: productId, quantity };
      })
      .filter((v): v is { product_id: number; quantity: number } => Boolean(v));

    if (fromQuery.length > 0) return fromQuery;

    return items
      .map((item) => ({ product_id: item.id, quantity: item.quantity }))
      .filter((item) => Number.isFinite(item.product_id) && item.product_id > 0 && item.quantity > 0);
  }, [searchParams, items]);

  useEffect(() => {
    let mounted = true;
    async function loadMethods() {
      try {
        const res = await fetch('/api/checkout/options', { cache: 'no-store' });
        const data = await res.json() as { paymentMethods?: PaymentMethod[] };
        const nextMethods = data.paymentMethods ?? [];
        if (!mounted) return;
        setMethods(nextMethods);
        setSelected(nextMethods[0]?.id ?? '');
      } catch {
        if (!mounted) return;
        setMethods([]);
        setSelected('');
      } finally {
        if (mounted) setLoadingMethods(false);
      }
    }
    void loadMethods();
    return () => {
      mounted = false;
    };
  }, []);

  async function proceed() {
    if (!selected || lineItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        payment_method: selected,
        shipping_method: searchParams.get('shipping_method') ?? '',
        shipping_method_title: searchParams.get('shipping_method_title') ?? '',
        shipping_note: searchParams.get('shipping_note') ?? '',
        line_items: lineItems,
        billing: {
          email: searchParams.get('email') ?? '',
          firstName: searchParams.get('firstName') ?? '',
          lastName: searchParams.get('lastName') ?? '',
          company: searchParams.get('company') ?? '',
          phone: searchParams.get('phone') ?? '',
          address: searchParams.get('address') ?? '',
          city: searchParams.get('city') ?? '',
          state: searchParams.get('state') ?? '',
          zip: searchParams.get('zip') ?? '',
          note: searchParams.get('note') ?? '',
        },
      };

      const res = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { orderId?: number; orderDate?: string; error?: string };
      if (!res.ok || !data.orderId) {
        setError(data.error ?? 'Could not create order in WooCommerce.');
        return;
      }

      clear();
      const params = new URLSearchParams();
      params.set('order_id', String(data.orderId));
      if (data.orderDate) params.set('order_date', new Date(data.orderDate).toLocaleDateString('en-GB'));
      router.push(`/order-received?${params.toString()}`);
    } catch {
      setError('Could not create order in WooCommerce. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col items-center gap-6 md:gap-10">
      <CheckoutStepper activeStep={2} />

      <div className="w-full flex flex-col-reverse md:flex-row items-start gap-6 md:gap-10">
        <div className="w-full md:flex-1 p-4 md:p-8 bg-white rounded-2xl outline outline-[1.31px] outline-gray-200 flex flex-col gap-5">
          <h2 className="text-zinc-900 text-lg md:text-xl font-bold font-['Space_Grotesk']">Payment Method</h2>

          <div className="flex flex-col gap-1">
            {loadingMethods && <p className="text-sm text-zinc-500 font-['Space_Grotesk']">Loading payment methods...</p>}
            {!loadingMethods && methods.length === 0 && (
              <p className="text-sm text-rose-600 font-['Space_Grotesk']">No WooCommerce payment methods available.</p>
            )}
            {methods.map((method, idx) => {
              const active = selected === method.id;
              const isLast = idx === methods.length - 1;
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
                    <span className="text-black text-sm md:text-base font-normal font-['Space_Grotesk']">{method.title}</span>
                    <span className="text-slate-500 text-xs font-normal font-['Space_Grotesk']">{method.description || 'Payment option from WooCommerce'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {error && <p className="text-sm text-rose-600 font-['Space_Grotesk']">{error}</p>}

          <button
            onClick={proceed}
            disabled={loadingMethods || submitting || !selected || lineItems.length === 0}
            className="hidden md:block w-full p-4 bg-sky-700 rounded-3xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Proceed'}
          </button>
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <CheckoutSummary
            ctaLabel={submitting ? 'Processing...' : 'Proceed'}
            onCta={proceed}
            shippingCost={SHIPPING_COST}
            ctaDisabled={loadingMethods || submitting || !selected || lineItems.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
