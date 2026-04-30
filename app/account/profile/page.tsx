'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Pencil, User, CheckCircle2, AlertCircle } from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

const inputCls = (disabled: boolean) =>
  `w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] text-neutral-700 text-sm font-normal font-['Space_Grotesk'] transition-colors outline-none ${
    disabled ? 'outline-gray-100 text-gray-400 cursor-default' : 'outline-gray-200 focus:outline-sky-700'
  }`;

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  meta: {
    prag_phone?: string;
    prag_avatar?: string;
    billing_address_1?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postcode?: string;
  };
  avatar_urls?: Record<string, string>;
}

export default function PersonalInfoPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: '', state: '', postcode: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/account/profile')
      .then(r => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setForm({
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          email: data.email ?? '',
          phone: data.meta?.prag_phone ?? '',
          address: data.meta?.billing_address_1 ?? '',
          city: data.meta?.billing_city ?? '',
          state: data.meta?.billing_state ?? '',
          postcode: data.meta?.billing_postcode ?? '',
        });
        setAvatarUrl(data.meta?.prag_avatar || data.avatar_urls?.['96'] || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/account/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: form.first_name,
        last_name: form.last_name,
        meta: {
          prag_phone: form.phone,
          billing_address_1: form.address,
          billing_city: form.city,
          billing_state: form.state,
          billing_postcode: form.postcode,
        },
      }),
    });
    setSaving(false);
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) setEditing(false);
    setTimeout(() => setStatus('idle'), 3000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setAvatarUrl(data.url);
    setAvatarUploading(false);
  }

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <svg className="w-8 h-8 text-sky-700 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[941px] p-6 md:p-11 bg-white rounded-[20px] outline outline-1 outline-zinc-100 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">Personal Information</h2>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-zinc-500 flex items-center gap-2 hover:outline-sky-700 hover:text-sky-700 transition-colors disabled:opacity-50">
          <span className="text-zinc-500 text-sm font-medium font-['Space_Grotesk'] leading-5">
            {saving ? 'Saving...' : editing ? 'Save' : 'Edit'}
          </span>
          <Pencil className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-['Space_Grotesk']">
          <CheckCircle2 size={16} /> Profile updated successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-['Space_Grotesk']">
          <AlertCircle size={16} /> Failed to save. Please try again.
        </div>
      )}

      {/* Avatar */}
      <div className="relative inline-flex items-center gap-5">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 outline outline-4 outline-white shadow">
          {avatarUrl
            ? <Image src={avatarUrl} alt="Avatar" fill className="object-cover" sizes="96px" />
            : <User className="w-12 h-12 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          }
          {avatarUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 left-16 w-7 h-7 p-1.5 bg-white rounded-full shadow flex items-center justify-center hover:bg-sky-50 transition-colors">
          <Pencil className="w-4 h-4 text-sky-700" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Personal info fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">First Name</label>
            <input type="text" value={form.first_name} onChange={set('first_name')} disabled={!editing} className={inputCls(!editing)} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Last Name</label>
            <input type="text" value={form.last_name} onChange={set('last_name')} disabled={!editing} className={inputCls(!editing)} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Email Address</label>
          <input type="email" value={form.email} disabled className={inputCls(true)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Phone Number</label>
          <input type="tel" value={form.phone} onChange={set('phone')} disabled={!editing} className={inputCls(!editing)} placeholder="+234..." />
        </div>
      </div>

      {/* Shipping address */}
      <h3 className="text-zinc-900 text-2xl font-medium font-['Space_Grotesk'] leading-7">Shipping Address</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Street Address</label>
          <input type="text" value={form.address} onChange={set('address')} disabled={!editing} className={inputCls(!editing)} placeholder="Address" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">City</label>
            <input type="text" value={form.city} onChange={set('city')} disabled={!editing} className={inputCls(!editing)} placeholder="City" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">State / Region</label>
            <select value={form.state} onChange={set('state')} disabled={!editing} className={inputCls(!editing)}>
              <option value="">Select state</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">ZIP / Postal Code</label>
            <input type="text" value={form.postcode} onChange={set('postcode')} disabled={!editing} className={inputCls(!editing)} placeholder="100001" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Country</label>
            <input type="text" value="Nigeria" disabled className={inputCls(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
