'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, User, Lock } from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { label: 'Order History', href: '/account/orders', icon: ShoppingBag },
  { label: 'Personal Information', href: '/account/profile', icon: User },
  { label: 'Password Settings', href: '/account/password', icon: Lock },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="p-4 bg-white rounded-lg outline outline-1 outline-zinc-100 flex flex-col gap-6 shrink-0">
      <span className="text-zinc-900 text-xl font-medium font-['Onest'] leading-6">Account</span>
      <div className="flex flex-col gap-3">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`w-60 px-4 py-3 rounded flex items-center gap-3 transition-colors ${active ? 'bg-blue-100' : 'hover:bg-gray-50'}`}>
              <Icon className={`w-5 h-5 ${active ? 'text-sky-700' : 'text-neutral-700'}`} />
              <span className={`flex-1 text-sm font-['Onest'] leading-5 ${active ? 'text-sky-700 font-medium' : 'text-slate-700 font-normal'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
