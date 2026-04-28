'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const [activeStatus, setActiveStatus] = useState('all');

  const STATUS_TABS = [
    { label: 'All Orders', value: 'all' },
    { label: 'On Transit', value: 'transit' },
    { label: 'Processing', value: 'processing' },
    { label: 'Ready for pick up', value: 'pickup' },
    { label: 'Completed', value: 'completed' },
  ];

  const STATUS_BADGE: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-800',
    processing: 'bg-blue-100 text-blue-800',
    transit: 'bg-amber-100 text-amber-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Status filter tabs */}
      <div className="flex items-center gap-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`p-3 rounded-3xl text-base font-medium font-['Space_Grotesk'] transition-colors ${
              activeStatus === tab.value
                ? 'bg-sky-700 text-white'
                : 'bg-white outline outline-1 outline-neutral-500 text-neutral-500 hover:outline-sky-700 hover:text-sky-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="p-8 bg-white rounded-xl shadow-sm flex flex-col gap-4">
        <div className="p-6 rounded-lg outline outline-[1.31px] outline-gray-300">
          <p className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] text-center py-4">
            <Link href="/login" className="text-sky-700 underline">Log in</Link> to view your order history.
          </p>
        </div>
      </div>
    </div>
  );
}
