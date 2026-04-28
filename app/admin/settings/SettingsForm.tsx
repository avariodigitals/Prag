'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettings, type SiteSettings } from '@/lib/admin';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState<SiteSettings>(initialSettings || {
    hero_title: '',
    hero_subtitle: '',
    contact_phone: '',
    contact_email: '',
    announcement_bar: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateSiteSettings(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: SiteSettings) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Hero Title</label>
          <input
            name="hero_title"
            value={formData.hero_title}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            placeholder="Main headline"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Hero Subtitle</label>
          <input
            name="hero_subtitle"
            value={formData.hero_subtitle}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            placeholder="Subheadline text"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Contact Phone</label>
          <input
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Contact Email</label>
          <input
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Announcement Bar</label>
        <textarea
          name="announcement_bar"
          value={formData.announcement_bar}
          onChange={handleChange}
          rows={3}
          className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
          placeholder="Text for the top announcement bar..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-sky-700 text-white rounded-full font-bold hover:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-700/20"
        >
          {loading ? 'Saving...' : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
