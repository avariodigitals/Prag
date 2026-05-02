'use client';

import { useState } from 'react';

const TIERS = ['Authorized Dealer', 'Certified Installer', 'Product Reseller'];
const inputCls = "w-full h-12 p-2.5 bg-white rounded-lg border-[1.31px] border-zinc-100 text-zinc-900 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors";

export default function DistributorForm() {
  const [form, setForm] = useState({ name: '', business: '', phone: '', email: '', city: '', type: '', tier: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          business: form.business,
          city: form.city,
          type: form.type,
          tier: form.tier,
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(res.ok && data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[884px] p-4 md:p-8 bg-white rounded-xl outline outline-1 outline-zinc-100 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-normal font-['Space_Grotesk'] leading-5">Full Name *</label>
          <input required type="text" value={form.name} onChange={set('name')} className={inputCls} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-normal font-['Space_Grotesk'] leading-5">Business Name *</label>
          <input required type="text" value={form.business} onChange={set('business')} className={inputCls} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Phone Number</label>
          <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Email Address *</label>
          <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">City</label>
          <input type="text" value={form.city} onChange={set('city')} className={inputCls} />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Business type</label>
          <input type="text" value={form.type} onChange={set('type')} className={inputCls} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Preferred Partnership Tier</label>
        <select value={form.tier} onChange={set('tier')} className={inputCls}>
          <option value="">Select tier</option>
          {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] leading-5">Tell Us About Your Business</label>
        <textarea value={form.message} onChange={set('message')} rows={5}
          className="w-full p-2.5 bg-white rounded-lg border-[1.31px] border-zinc-100 text-zinc-900 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 outline-none transition-colors resize-none" />
      </div>

      {status === 'sent' && <p className="text-green-600 text-sm font-['Space_Grotesk']">Application submitted! We&apos;ll be in touch within 2 business days.</p>}
      {status === 'error' && <p className="text-red-600 text-sm font-['Space_Grotesk']">Something went wrong. Please try again or email us directly.</p>}

      <button type="submit" disabled={status === 'sending'}
        className="w-full py-3 bg-sky-700 rounded-lg text-white text-base font-semibold font-['DM_Sans'] leading-6 hover:bg-sky-800 transition-colors disabled:opacity-60">
        {status === 'sending' ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
