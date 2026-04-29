import AccountSidebar from '@/components/AccountSidebar';
import Link from 'next/link';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">My Account</span>
        </div>
      </div>

      <div className="w-full px-20 py-24 flex items-start gap-10">
        <AccountSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}
