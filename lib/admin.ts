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
