import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AccountSidebar from '@/components/AccountSidebar';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-medium font-['Montserrat']">My Account</h1>
      </div>

      <div className="w-full px-4 md:px-20 py-8 md:py-12 flex flex-col md:flex-row items-start gap-6 md:gap-10">
        <AccountSidebar />
        <div className="flex-1 w-full">{children}</div>
      </div>
    </main>
  );
}
