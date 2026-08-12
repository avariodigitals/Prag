import Link from 'next/link';
import { Zap, Gauge, Sun, BatteryFull } from 'lucide-react';

interface WarrantyCardProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function WarrantyCard({ title, href, icon }: WarrantyCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-5 bg-white rounded-2xl outline outline-1 outline-zinc-200 hover:outline-sky-700 hover:shadow-md transition-all"
    >
      <div className="p-3 bg-sky-700 text-white rounded-xl shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-zinc-900 text-lg font-medium font-['Montserrat']">{title}</h3>
        <p className="text-sky-700 text-sm font-medium mt-1 group-hover:underline">View warranty details →</p>
      </div>
    </Link>
  );
}
