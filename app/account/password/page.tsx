'use client';

import { useState } from 'react';
import { CheckCircle, CheckCircle2, AlertCircle } from 'lucide-react';

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors";

const REQUIREMENTS = [
  { label: 'At least 8 characters long', test: (p: string) => p.length >= 8 },
  { label: 'Contains uppercase and lowercase letters', test: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: 'Contains at least one number', test: (p: string) => /\d/.test(p) },
];

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  function reset() {
    setForm({ current: '', newPass: '', confirm: '' });
    setStatus('idle');
    setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      setErrorMsg('New passwords do not match.');
      setStatus('error');
      return;
    }
    if (!REQUIREMENTS.every(r => r.test(form.newPass))) {
      setErrorMsg('New password does not meet requirements.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const res = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPass }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('success');
      setForm({ current: '', newPass: '', confirm: '' });
    } else {
      setErrorMsg(data.error || 'Failed to update password.');
      setStatus('error');
    }
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
      <div className="px-8 py-6 border-b border-gray-200 rounded-tl-2xl rounded-tr-3xl">
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
              {REQUIREMENTS.map((req) => {
                const met = form.newPass ? req.test(form.newPass) : false;
                return (
                  <div key={req.label} className="flex items-start gap-1">
                    <CheckCircle className={`w-3 h-3 mt-0.5 shrink-0 ${met ? 'text-green-600' : 'text-sky-700'}`} />
                    <span className={`text-xs font-normal font-['Inter'] leading-4 ${met ? 'text-green-600' : 'text-sky-700'}`}>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-['Space_Grotesk']">
              <CheckCircle2 size={16} /> Password updated successfully.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-['Space_Grotesk']">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-6">
            <button type="button" onClick={reset}
              className="w-36 p-4 rounded-xl outline outline-1 outline-sky-700 text-sky-700 text-base font-medium font-['Space_Grotesk'] hover:bg-sky-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={status === 'loading'}
              className="px-6 p-4 bg-sky-700 rounded-xl text-white text-base font-medium font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-60">
              {status === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
