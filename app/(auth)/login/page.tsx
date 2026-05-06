'use client';

import AuthPanel from '@/components/AuthPanel';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  function handleCancel() {
    const returnTo = sessionStorage.getItem('prag:returnTo');
    if (returnTo && !returnTo.startsWith('/login') && !returnTo.startsWith('/register')) {
      router.push(returnTo);
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }

  return (
    <main className="min-h-screen lg:h-screen bg-white lg:flex lg:flex-row lg:overflow-hidden">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      {/* Desktop form */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16 lg:overflow-y-auto">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-stone-900 text-xl md:text-2xl font-semibold font-['Onest'] leading-tight">Welcome back!</h2>
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
              className="w-full h-12 bg-sky-700 rounded-2xl text-white text-sm font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>


        </div>
      </div>

      {/* Mobile popup login — bottom sheet */}
      <div className="lg:hidden fixed inset-0 bg-black/40 flex items-end justify-center z-50">
        <div className="w-full max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8">
          {/* drag handle */}
          <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-4" />

          {/* header: logo + close */}
          <div className="flex items-center justify-between mb-5">
            <Link href="/" aria-label="Go to homepage" className="inline-flex">
              <Image src="/Prag Logo.png" alt="Prag" width={100} height={24} style={{ height: 'auto', width: 'auto' }} />
            </Link>
            <button type="button" onClick={handleCancel} aria-label="Close"
              className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-stone-900 text-xl font-semibold font-['Onest'] leading-tight">Welcome back!</h2>
            <div className="flex items-center gap-1">
              <span className="text-neutral-500 text-sm font-['Space_Grotesk']">Don&apos;t have an account?</span>
              <Link href="/register" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Sign Up</Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
              className="w-full h-12 bg-sky-700 rounded-2xl text-white text-sm font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
