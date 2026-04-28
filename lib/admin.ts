import { getSession } from './auth';

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  contact_phone: string;
  contact_email: string;
  announcement_bar: string;
}

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${WP_API_URL}/prag-core/v1/settings`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export async function updateSiteSettings(settings: SiteSettings) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  try {
    const res = await fetch(`${WP_API_URL}/prag-core/v1/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
      },
      body: JSON.stringify(settings),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    return data;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}
