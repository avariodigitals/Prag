'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  line_items: { id: number; name: string; quantity: number }[];
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  completed:  { label: 'Completed',   cls: 'bg-emerald-100 text-emerald-800' },
  processing: { label: 'Processing',  cls: 'bg-blue-100 text-blue-800' },
  'on-hold':  { label: 'In Transit',  cls: 'bg-amber-100 text-amber-800' },
  pending:    { label: 'Pending',     cls: 'bg-yellow-100 text-yellow-800' },
  cancelled:  { label: 'Cancelled',   cls: 'bg-red-100 text-red-700' },
  refunded:   { label: 'Refunded',    cls: 'bg-gray-100 text-gray-600' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AccountDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/orders')
      .then(r => r.json())
      .then(data => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPlaced = orders.length;
  const totalCompleted = orders.filter(o => o.status === 'completed').length;
  const pending = orders.filter(o => ['pending', 'processing', 'on-hold'].includes(o.status)).length;
  const recent = orders.slice(0, 4);

  const stats = [
    { label: 'Total Orders placed', value: totalPlaced },
    { label: 'Total Orders Completed', value: totalCompleted },
    { label: 'Pending deliveries', value: pending },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Stats */}
      <div className="flex gap-3.5 flex-wrap md:flex-nowrap">
        {stats.map((stat) => (
          <div key={stat.label} className="flex-1 min-w-[140px] bg-white rounded-xl shadow-sm outline outline-1 outline-gray-200 p-4">
            <div className="flex flex-col gap-4">
              <span className="text-slate-500 text-xs font-medium font-['Inter'] leading-4">{stat.label}</span>
              <span className="text-slate-800 text-3xl font-semibold font-['Inter'] leading-10 opacity-80">
                {loading ? '—' : stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="p-8 bg-white rounded-xl outline outline-1 outline-zinc-100 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-zinc-900 text-xl font-bold font-['Space_Grotesk'] leading-8">Recent Orders</h2>
          <Link href="/account/orders" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5 hover:underline">
            View All Orders →
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <svg className="w-7 h-7 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {!loading && recent.length === 0 && (
          <div className="p-6 rounded-lg outline outline-[1.31px] outline-gray-300 text-center">
            <p className="text-zinc-500 text-sm font-['Space_Grotesk'] py-4">
              No orders yet.{' '}
              <Link href="/products" className="text-sky-700 underline">Browse products</Link>
            </p>
          </div>
        )}

        {!loading && recent.map((order) => {
          const badge = STATUS_BADGE[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-600' };
          return (
            <div key={order.id} className="p-6 rounded-lg outline outline-[1.31px] outline-gray-300 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <span className="text-zinc-900 text-base font-bold font-['Space_Grotesk'] leading-6">#{order.number}</span>
                  <span className="text-slate-500 text-sm font-normal font-['Inter'] leading-5">
                    {formatDate(order.date_created)} · {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium font-['Space_Grotesk'] ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-900 text-lg font-bold font-['Space_Grotesk'] leading-7">
                  ₦{Number(order.total).toLocaleString('en-NG')}
                </span>
                <Link href="/account/orders" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
