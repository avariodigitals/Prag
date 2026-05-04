import { getSession } from '@/lib/auth';
import { getSiteSettings } from '@/lib/woocommerce';
import SiteShellClient from './SiteShellClient';
import { cache } from 'react';

const getCachedSession = cache(getSession);
const getCachedSettings = cache(getSiteSettings);

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [session, settings] = await Promise.all([
    getCachedSession(),
    getCachedSettings(),
  ]);
  const user = session?.user ?? null;

  return <SiteShellClient user={user} settings={settings}>{children}</SiteShellClient>;
}
