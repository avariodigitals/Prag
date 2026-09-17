import { getSiteSettings } from '@/lib/woocommerce';
import SiteShellClient from './SiteShellClient';
import { cache } from 'react';

const getCachedSettings = cache(getSiteSettings);

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getCachedSettings();
  return <SiteShellClient settings={settings}>{children}</SiteShellClient>;
}
