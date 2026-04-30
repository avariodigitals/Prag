'use client';

import AuthPanel from '@/components/AuthPanel';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

const REQUIREMENTS = [
  'At least 8 characters long',
  'Contains uppercase and lowercase letters',
  'Contains at least one number',
];

export default function RegisterPage() {
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-white flex">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 lg:px-16 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 self-start">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png"
            alt="Prag" width={120} height={28}
            style={{ height: 'auto', width: 'auto', filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg)' }}
          />
        </div>

        <div className="w-full max-w-[480px] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-stone-900 text-3xl md:text-4xl font-semibold font-['Onest'] leading-tight">Get Started</h2>
            <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">Enter your details to start shopping on PRAG</span>
          </div>

          <form action={`${SHOP_URL}/my-account`} method="POST" className="flex flex-col gap-4">
            <input type="hidden" name="action" value="register" />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">First Name</label>
                <input name="first_name" type="text" placeholder="John" required className={inputCls} />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Last Name</label>
                <input name="last_name" type="text" placeholder="Doe" required className={inputCls} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Email Address</label>
              <input name="email" type="email" placeholder="you@company.com" required className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Phone Number</label>
              <input name="phone" type="tel" placeholder="+234 9052177845" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Password</label>
              <input name="password" type="password" placeholder="Enter password" required
                value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk']">Confirm Password</label>
              <input name="password2" type="password" placeholder="Confirm password" required className={inputCls} />
            </div>

            <div className="p-4 bg-sky-700/10 rounded-xl border border-sky-700/20 flex flex-col gap-2">
              <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">Password Requirements:</span>
              <div className="flex flex-col gap-1">
                {REQUIREMENTS.map((req) => (
                  <div key={req} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                    <span className="text-sky-700 text-xs font-normal font-['Inter']">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit"
              className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors mt-2">
              Sign up
            </button>

            <div className="flex items-center justify-center gap-1">
              <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">Already have an account?</span>
              <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Login</Link>
            </div>
          </form>

          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-neutral-400 text-sm font-['Space_Grotesk'] shrink-0">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <a href={`${SHOP_URL}/my-account?google_login=1`}
            className="w-full h-14 bg-white rounded-2xl border border-gray-200 flex justify-center items-center gap-3 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-neutral-700 text-base font-medium font-['Space_Grotesk']">Continue with Google</span>
          </a>

          <p className="text-center text-xs text-gray-400 font-['Space_Grotesk'] pb-4">
            By signing up, you agree to our{' '}
            <Link href="/terms-of-use" className="text-sky-700 hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-sky-700 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
