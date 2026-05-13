'use client';

import { useState, useEffect } from 'react';

const TIERS = ['Authorized Dealer', 'Certified Installer', 'Product Reseller'];
const ALLOWED_TIERS = new Set(TIERS);
const EMPTY_FORM = { name: '', business: '', phone: '', email: '', city: '', type: '', tier: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s\-(). ]{0,25}$/;
const INJECTION_RE = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed|<svg/i;

function validateDistributorForm(form: typeof EMPTY_FORM): string | null {
  if (!form.name.trim() || form.name.trim().length > 100) return 'Enter a valid full name (max 100 characters).';
  if (INJECTION_RE.test(form.name)) return 'Name contains invalid characters.';
  if (!form.business.trim() || form.business.trim().length > 150) return 'Enter a valid business name.';
  if (INJECTION_RE.test(form.business)) return 'Business name contains invalid characters.';
  if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';
  if (form.phone && !PHONE_RE.test(form.phone)) return 'Enter a valid phone number (digits, spaces, +, -, ( ) only).';
  if (form.city && (form.city.length > 100 || INJECTION_RE.test(form.city))) return 'City contains invalid characters.';
  if (form.type && (form.type.length > 150 || INJECTION_RE.test(form.type))) return 'Business type contains invalid characters.';
  if (form.tier && !ALLOWED_TIERS.has(form.tier)) return 'Select a valid partnership tier.';
  if (INJECTION_RE.test(form.message)) return 'Message contains invalid content.';
  if (form.message.length > 2000) return 'Message is too long (max 2000 characters).';
  return null;
}

interface Toast { type: 'success' | 'error'; message: string }

function FormToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm w-[calc(100vw-3rem)] ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}
      role="alert" aria-live="assertive">
      <div className="mt-0.5 shrink-0">
        {toast.type === 'success' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-['Montserrat']">
          {toast.type === 'success' ? 'Application Received!' : 'Submission Failed'}
        </p>
        <p className="text-base md:text-lg font-['Montserrat'] opacity-90 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="ml-1 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

const inputCls = "w-full h-12 p-2.5 bg-white rounded-lg border-[1.31px] border-zinc-100 text-zinc-900 text-sm font-normal font-['Montserrat'] focus:border-sky-700 outline-none transition-colors";

export default function DistributorForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error = validateDistributorForm(form);
    if (error) { setToast({ type: 'error', message: error }); return; }
    setSending(true);
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
      if (res.ok && data.success) {
        setForm(EMPTY_FORM);
        setToast({ type: 'success', message: "Our partnership team will contact you within 2 business days." });
      } else {
        setToast({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {toast && <FormToast toast={toast} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[884px] p-4 md:p-8 bg-white rounded-xl outline outline-1 outline-zinc-100 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-zinc-900 text-base md:text-lg font-normal font-['Montserrat'] leading-5">Full Name *</label>
            <input required type="text" value={form.name} onChange={set('name')} maxLength={100} className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-zinc-900 text-base md:text-lg font-normal font-['Montserrat'] leading-5">Business Name *</label>
            <input required type="text" value={form.business} onChange={set('business')} maxLength={150} className={inputCls} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Phone Number</label>
            <input type="tel" value={form.phone} onChange={set('phone')} maxLength={25} className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Email Address *</label>
            <input required type="email" value={form.email} onChange={set('email')} className={inputCls} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">City</label>
            <input type="text" value={form.city} onChange={set('city')} maxLength={100} className={inputCls} />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Business type</label>
            <input type="text" value={form.type} onChange={set('type')} maxLength={150} className={inputCls} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Preferred Partnership Tier</label>
          <select value={form.tier} onChange={set('tier')} className={inputCls}>
            <option value="">Select tier</option>
            {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-900 text-base md:text-lg font-medium font-['Montserrat'] leading-5">Tell Us About Your Business</label>
          <textarea value={form.message} onChange={set('message')} rows={5} maxLength={2000}
            className="w-full p-2.5 bg-white rounded-lg border-[1.31px] border-zinc-100 text-zinc-900 text-sm font-normal font-['Montserrat'] focus:border-sky-700 outline-none transition-colors resize-none" />
        </div>

        <button type="submit" disabled={sending}
          className="w-full py-3 bg-sky-700 rounded-lg text-white text-base font-semibold font-['DM_Sans'] leading-6 hover:bg-sky-800 transition-colors disabled:opacity-60">
          {sending ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </>
  );
}
