import Link from 'next/link';

export const metadata = { title: 'Dashboard – My Account – Prag' };

const STATS = [
  { label: 'Total Orders placed', value: '—' },
  { label: 'Total Orders Completed', value: '—' },
  { label: 'Pending deliveries', value: '—' },
];

export default function AccountDashboard() {
  return (
    <div className="flex flex-col gap-10">
      {/* Stats */}
      <div className="flex gap-3.5">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex-1 bg-white rounded-xl shadow-sm outline outline-1 outline-gray-200 p-4">
            <div className="flex flex-col gap-4">
              <span className="text-slate-500 text-xs font-medium font-['Inter'] leading-4">{stat.label}</span>
              <span className="text-slate-800 text-3xl font-semibold font-['Inter'] leading-10 opacity-80">{stat.value}</span>
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
        <div className="p-6 rounded-lg outline outline-[1.31px] outline-gray-300">
          <p className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] text-center py-4">
            <Link href="/login" className="text-sky-700 underline">Log in</Link> to view your orders.
          </p>
        </div>
      </div>
    </div>
  );
}
