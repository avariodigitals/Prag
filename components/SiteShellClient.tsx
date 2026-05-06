'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import NavigationScrollReset from './NavigationScrollReset';
import type { SiteSettings } from '@/lib/woocommerce';

const AUTH_ROUTES = ['/login', '/register'];

interface Props {
  children: React.ReactNode;
  user: { user_display_name: string } | null;
  settings: SiteSettings;
}

export default function SiteShellClient({ children, user, settings }: Props) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (isAuth) return;
    const current = `${pathname}${window.location.search}${window.location.hash}`;
    sessionStorage.setItem('prag:returnTo', current);
  }, [isAuth, pathname]);

  if (isAuth) return <>{children}</>;

  if (settings.site_under_construction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-sm p-10 text-center space-y-5">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-700 font-semibold">PRAG B2C Store</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{settings.under_construction_title || 'We are coming back soon'}</h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {settings.under_construction_message || 'We are currently making improvements to serve you better. Please check back shortly.'}
          </p>
          <p className="text-sm text-slate-500">For urgent enquiries, call {settings.contact_phone}.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationScrollReset />
      <TopBar initialUser={user} phone={settings.contact_phone} whatsapp={settings.whatsapp} />
      <NavBar />
      {children}
      <Footer settings={settings} />
      <ScrollToTop />
    </>
  );
}
