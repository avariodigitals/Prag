'use client';

import AuthPanel from '@/components/AuthPanel';
import Link from 'next/link';
import { useState } from 'react';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSent(true);
      else setError('No account found with that email address.');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen lg:h-screen bg-white flex flex-col lg:flex-row lg:overflow-hidden">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-16 lg:overflow-y-auto">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          {sent ? (
            <div className="flex flex-col gap-4 text-center">
              <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-stone-900 text-2xl font-semibold font-['Onest']">Check your email</h2>
              <p className="text-neutral-500 text-sm font-['Space_Grotesk']">
                We sent a password reset link to <span className="text-zinc-900 font-medium">{email}</span>
              </p>
              <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="text-stone-900 text-3xl font-semibold font-['Onest'] leading-tight">Forgot password?</h2>
                <p className="text-neutral-500 text-sm font-['Space_Grotesk']">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Email Address</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={inputCls}
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="flex items-center justify-center gap-1">
                <span className="text-neutral-500 text-sm font-['Space_Grotesk']">Remember your password?</span>
                <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
