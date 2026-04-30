'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LineItem { id: number; name: string; quantity: number; total: string }
interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  line_items: LineItem[];
  shipping: { address_1: string; city: string; state: string };
}

const STATUS_TABS = [
  { label: 'All Orders', value: 'all' },
  { label: 'On Transit', value: 'on-hold' },
  { label: 'Processing', value: 'processing' },
  { label: 'Ready for pick up', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  completed:  { label: 'Delivered',   cls: 'bg-emerald-100 text-emerald-800' },
  processing: { label: 'Processing',  cls: 'bg-blue-100 text-blue-800' },
  'on-hold':  { label: 'On Transit',  cls: 'bg-orange-100 text-orange-800' },
  pending:    { label: 'Pending',     cls: 'bg-yellow-100 text-yellow-800' },
  cancelled:  { label: 'Cancelled',   cls: 'bg-red-100 text-red-700' },
  refunded:   { label: 'Refunded',    cls: 'bg-gray-100 text-gray-600' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/account/orders')
      .then(r => r.json())
      .then(data => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeStatus === 'all'
    ? orders
    : orders.filter(o => o.status === activeStatus);

  return (
    <div className="flex flex-col gap-10">
      {/* Status tabs */}
      <div className="flex items-center gap-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button key={tab.value} onClick={() => setActiveStatus(tab.value)}
            className={`p-3 rounded-3xl text-base font-medium font-['Space_Grotesk'] transition-colors ${
              activeStatus === tab.value
                ? 'bg-sky-700 text-white'
                : 'bg-white outline outline-1 outline-neutral-500 text-neutral-500 hover:outline-sky-700 hover:text-sky-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="p-8 bg-white rounded-xl shadow-sm flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-10">
            <svg className="w-8 h-8 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="p-6 rounded-lg outline outline-[1.31px] outline-gray-300 text-center">
            <p className="text-zinc-500 text-sm font-['Space_Grotesk'] py-4">
              {orders.length === 0
                ? <><Link href="/products" className="text-sky-700 underline">Browse products</Link> to place your first order.</>
                : 'No orders found for this status.'}
            </p>
          </div>
        )}

        {!loading && filtered.map((order) => {
          const badge = STATUS_BADGE[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-600' };
          const isOpen = expanded === order.id;
          const shippingAddr = [order.shipping?.address_1, order.shipping?.city, order.shipping?.state].filter(Boolean).join(', ');

          return (
            <div key={order.id} className="flex flex-col rounded-lg outline outline-[1.31px] outline-gray-300 overflow-hidden">
              {/* Header */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-900 text-2xl font-bold font-['Space_Grotesk'] leading-6">
                        #{order.number}
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium font-['Space_Grotesk'] ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">
                      {formatDate(order.date_created)} · {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">Total Amount</span>
                    <span className="text-zinc-900 text-2xl font-bold font-['Space_Grotesk'] leading-6">
                      ₦{Number(order.total).toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className={`w-full p-4 rounded-lg text-base font-medium font-['Space_Grotesk'] transition-colors ${
                    isOpen
                      ? 'bg-white outline outline-1 outline-sky-700 text-sky-700'
                      : 'bg-sky-700 text-white hover:bg-sky-800'
                  }`}>
                  {isOpen ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="p-6 bg-neutral-100 border-t border-zinc-100 flex flex-col gap-4">
                  {/* Order items */}
                  <div className="flex flex-col gap-3">
                    <span className="text-neutral-700 text-xl font-medium font-['Space_Grotesk']">Order items</span>
                    {order.line_items.map((item) => (
                      <div key={item.id} className="p-4 bg-white rounded-lg outline outline-1 outline-zinc-100 flex justify-between items-start gap-3">
                        <div className="flex flex-col gap-2">
                          <span className="text-zinc-900 text-base font-bold font-['Space_Grotesk'] leading-6">{item.name}</span>
                          <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">Quantity: {item.quantity}</span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">Total Amount</span>
                          <span className="text-zinc-900 text-base font-bold font-['Space_Grotesk'] leading-6">
                            ₦{Number(item.total).toLocaleString('en-NG')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  {shippingAddr && (
                    <div className="flex flex-col gap-3">
                      <span className="text-neutral-700 text-xl font-medium font-['Space_Grotesk']">Shipping Information</span>
                      <div className="p-4 bg-white rounded-lg outline outline-1 outline-zinc-100 flex flex-col gap-2">
                        <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">Delivery Address</span>
                        <span className="text-zinc-900 text-base font-bold font-['Space_Grotesk'] leading-6">{shippingAddr}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
