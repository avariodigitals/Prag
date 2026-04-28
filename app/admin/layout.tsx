import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Settings, ShoppingBag, Users, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Basic security: redirect to login if no session
  // In a real app, you'd also check if the user has an 'administrator' role
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="flex h-screen bg-gray-100 font-['Space_Grotesk']">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="text-2xl font-bold text-sky-700">
            PRAG Admin
          </Link>
          <p className="text-xs text-gray-500 mt-1">Core by Avario</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
          >
            <ShoppingBag size={20} />
            <span className="font-medium">Products</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
          >
            <Users size={20} />
            <span className="font-medium">Customers</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors"
          >
            <Settings size={20} />
            <span className="font-medium">Site Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-700">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
              {session.user?.user_display_name?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{session.user?.user_display_name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.user_email}</p>
            </div>
          </div>
          <button 
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Control Center</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-sky-700 hover:underline">
              View Website
            </Link>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
