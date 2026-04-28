export const dynamic = 'force-dynamic';

import { getSiteSettings } from '@/lib/admin';
import SettingsForm from '@/app/admin/settings/SettingsForm';

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-500">Manage global website content and configurations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  );
}
