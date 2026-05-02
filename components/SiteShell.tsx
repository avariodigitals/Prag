import { getSession } from '@/lib/auth';
import SiteShellClient from './SiteShellClient';
import { cache } from 'react';

const getCachedSession = cache(getSession);

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession();
  const user = session?.user ?? null;

  return <SiteShellClient user={user}>{children}</SiteShellClient>;
}
