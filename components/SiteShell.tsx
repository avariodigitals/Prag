'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import NavigationScrollReset from './NavigationScrollReset';

const AUTH_ROUTES = ['/login', '/register'];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isAuth) return <>{children}</>;

  return (
    <>
      <NavigationScrollReset />
      <TopBar />
      <NavBar />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
