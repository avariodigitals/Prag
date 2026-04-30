'use client';

import AuthPanel from '@/components/AuthPanel';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.get('username'), password: formData.get('password') }),
      });
      const data = await res.json();
      if (res.ok) { router.push('/'); router.refresh(); }
      else setError(data.message || 'Login failed. Please check your credentials.');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png"
            alt="Prag" width={120} height={28}
            style={{ height: 'auto', width: 'auto', filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg)' }}
          />
        </div>

        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-stone-900 text-3xl md:text-4xl font-semibold font-['Onest'] leading-tight">Welcome back!</h2>
            <div className="flex items-center gap-1">
              <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">Don&apos;t have an account?</span>
              <Link href="/register" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Sign Up</Link>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Email Address</label>
              <input name="username" type="email" placeholder="you@company.com" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Password</label>
              <input name="password" type="password" placeholder="Enter password" required className={inputCls} />
            </div>

            <div className="flex justify-end">
              <Link href="/login/forgot-password" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>


        </div>
      </div>
    </main>
  );
}
