'use client';

import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import NavigationScrollReset from './NavigationScrollReset';

const AUTH_ROUTES = ['/login', '/register'];

interface Props {
  children: React.ReactNode;
  user: { user_display_name: string } | null;
}

export default function SiteShellClient({ children, user }: Props) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isAuth) return <>{children}</>;

  return (
    <>
      <NavigationScrollReset />
      <TopBar initialUser={user} />
      <NavBar />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
