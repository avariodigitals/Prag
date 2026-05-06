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

// Paystack inline JS types
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

const SHIPPING_COST = 0;

function isPaystackGateway(id: string) {
  return id.toLowerCase().includes('paystack');
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) { resolve(); return; }
    const existing = document.getElementById('paystack-js');
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const script = document.createElement('script');
    script.id = 'paystack-js';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack SDK'));
    document.head.appendChild(script);
  });
}

export default function PaymentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clear } = useCart();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const [selected, setSelected] = useState('');
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const summaryItems = useMemo(() => {
    const lines = searchParams.getAll('line_item');
    const names = searchParams.getAll('line_name');
    const prices = searchParams.getAll('line_price');

    return lines.map((entry, idx) => {
      const [idRaw, qtyRaw] = entry.split(':');
      const id = Number(idRaw);
      const quantity = Number(qtyRaw);
      const price = Number(String(prices[idx] ?? '').replace(/[^0-9.-]/g, ''));
      return {
        id: Number.isFinite(id) ? id : idx + 1,
        name: names[idx] ?? 'Product',
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        price: Number.isFinite(price) ? price : 0,
      };
    });
  }, [searchParams]);

  const summaryTotal = useMemo(
    () => summaryItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [summaryItems]
  );

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
        const data = await res.json() as { paymentMethods?: PaymentMethod[]; paystackPublicKey?: string };
        const nextMethods = data.paymentMethods ?? [];
        if (!mounted) return;
        setMethods(nextMethods);
        setSelected(nextMethods[0]?.id ?? '');
        setPaystackPublicKey(data.paystackPublicKey ?? '');
      } catch {
        if (!mounted) return;
        setMethods([]);
        setSelected('');
      } finally {
        if (mounted) setLoadingMethods(false);
      }
    }
    void loadMethods();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!paystackPublicKey) return;
    if (!methods.some((m) => isPaystackGateway(m.id))) return;
    void loadPaystackScript().catch(() => {
      // Best-effort preload only; actual proceed flow handles errors.
    });
  }, [methods, paystackPublicKey]);

  async function proceed() {
    if (!selected || lineItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      // Create the WooCommerce order first (as pending)
      const payload = {
        payment_method: selected,
        payment_method_title: methods.find((m) => m.id === selected)?.title ?? selected,
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
      const raw = await res.text();
      const parsed = (() => {
        try {
          return JSON.parse(raw) as { error?: string };
        } catch {
          return null;
        }
      })();
      const data = (parsed ?? {}) as {
        orderId?: number;
        orderDate?: string;
        orderStatus?: string;
        orderTotal?: string;
        error?: string;
      };

      if (!res.ok || !data.orderId) {
        const fallback = raw && raw.length < 300 ? raw : `Could not create order (HTTP ${res.status}). Please try again.`;
        setError(data?.error ?? fallback);
        return;
      }

      const orderId = data.orderId;
      const orderDate = data.orderDate ?? '';
      const email = (searchParams.get('email') ?? '').trim();

      // Paystack inline popup — keep everything in Next.js
      if (isPaystackGateway(selected) && paystackPublicKey) {
        if (!email) {
          setError('Email is required to process Paystack payment.');
          return;
        }

        await loadPaystackScript();

        if (!window.PaystackPop) {
          setError('Payment SDK failed to load. Please refresh and try again.');
          return;
        }

        // Amount from the actual WC order total (in kobo)
        const orderTotalNaira = parseFloat((data.orderTotal ?? '0').replace(/[^0-9.]/g, ''));
        const amountKobo = Math.round((Number.isFinite(orderTotalNaira) && orderTotalNaira > 0 ? orderTotalNaira : summaryTotal) * 100);

        const ref = `PRAG-${orderId}-${Date.now()}`;
        let paymentCompleted = false;
        const paystackKey = paystackPublicKey.trim();

        if (!paystackKey) {
          setError('Paystack public key is not configured.');
          return;
        }

        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email,
          amount: amountKobo,
          currency: 'NGN',
          ref,
          callback: function (response) {
            paymentCompleted = true;
            setSubmitting(true);
            void (async () => {
              try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const verifyRes = await fetch('/api/checkout/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reference: response.reference, order_id: orderId }),
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!verifyRes.ok) {
                  console.error('Payment verify returned non-OK response', verifyRes.status);
                }
              } catch {
                // non-blocking — payment went through regardless
              }
              clear();
              router.push(`/order-received?order_id=${orderId}&order_date=${encodeURIComponent(orderDate)}`);
            })();
          },
          onClose: function () {
            if (paymentCompleted) return;
            setSubmitting(false);
            const retryQuery = searchParams.toString();
            const retry = retryQuery ? `&retry=${encodeURIComponent(retryQuery)}` : '';
            router.push(`/order-failed?order_id=${orderId}${retry}`);
          },
        });

        handler.openIframe();
        // Don't setSubmitting(false) here — wait for onSuccess/onCancel
        return;
      }

      // Non-Paystack methods (bank transfer, etc.) — order is already created, go to received
      clear();
      router.push(`/order-received?order_id=${orderId}&order_date=${encodeURIComponent(orderDate)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create order. Please try again.';
      setError(message || 'Could not create order. Please try again.');
    } finally {
      // Only reset if we didn't open Paystack popup (which manages its own flow)
      if (!isPaystackGateway(selected) || !paystackPublicKey) {
        setSubmitting(false);
      }
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
              <p className="text-sm text-rose-600 font-['Space_Grotesk']">No payment methods available.</p>
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
                    <span className="text-slate-500 text-xs font-normal font-['Space_Grotesk']">{method.description || 'Payment option'}</span>
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
            itemsOverride={summaryItems}
            totalOverride={summaryTotal}
          />
        </div>
      </div>
    </div>
  );
}

