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
