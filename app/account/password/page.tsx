'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors";

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPass !== form.confirm) { setStatus('error'); return; }
    // In production: call WooCommerce REST API to update password
    setStatus('success');
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">Change your Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Current Password</label>
            <input type="password" value={form.current} onChange={set('current')} placeholder="Enter Current Password" required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">New Password</label>
            <input type="password" value={form.newPass} onChange={set('newPass')} placeholder="Enter New Password" required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Confirm New Password" required className={inputCls} />
          </div>

          {/* Requirements */}
          <div className="p-4 bg-sky-700/10 rounded-lg outline outline-1 outline-sky-700/50 flex flex-col gap-2">
            <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Password Requirements:</span>
            <div className="flex flex-col gap-1">
              {['At least 8 characters long', 'Contains uppercase and lowercase letters', 'Contains at least one number'].map((req) => (
                <div key={req} className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-sky-700 mt-0.5 shrink-0" />
                  <span className="text-sky-700 text-xs font-normal font-['Inter'] leading-4">{req}</span>
                </div>
              ))}
            </div>
          </div>

          {status === 'success' && <p className="text-green-600 text-sm font-['Space_Grotesk']">Password updated successfully.</p>}
          {status === 'error' && <p className="text-red-600 text-sm font-['Space_Grotesk']">Passwords do not match.</p>}

          <div className="flex items-center gap-6">
            <button type="button" onClick={() => setForm({ current: '', newPass: '', confirm: '' })}
              className="w-36 p-4 rounded-xl outline outline-1 outline-sky-700 text-sky-700 text-base font-medium font-['Space_Grotesk'] hover:bg-sky-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-6 p-4 bg-sky-700 rounded-xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
