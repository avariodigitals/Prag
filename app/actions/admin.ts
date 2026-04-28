'use server';

import { getSession } from '@/lib/auth';
import { type SiteSettings } from '@/lib/admin';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://central.prag.global/wp-json';

export async function updateSiteSettingsAction(settings: SiteSettings) {
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
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}
