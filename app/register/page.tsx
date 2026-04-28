import AuthPanel from '@/components/AuthPanel';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export const metadata = { title: 'Create Account – Prag' };

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

const inputCls = "w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors";

export default function RegisterPage() {
  return (
    <main className="w-full min-h-screen bg-white flex overflow-hidden">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      <div className="flex-1 flex items-start justify-center px-16 py-10 overflow-y-auto">
        <div className="w-[641px] flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-stone-900 text-4xl font-semibold font-['Onest'] leading-10">Get Started</h2>
            <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">Enter your details to start shopping on Prag</span>
          </div>

          <form action={`${SHOP_URL}/my-account`} method="POST" className="flex flex-col gap-3">
            <input type="hidden" name="action" value="register" />
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">First Name</label>
                <input name="first_name" type="text" placeholder="John" required className={inputCls} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Last Name</label>
                <input name="last_name" type="text" placeholder="Doe" required className={inputCls} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Email Address</label>
              <input name="email" type="email" placeholder="you@company.com" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Phone Number</label>
              <input name="phone" type="tel" placeholder="+234 9052177845" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Password</label>
              <input name="password" type="password" placeholder="Enter Password" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Confirm Password</label>
              <input name="password2" type="password" placeholder="Confirm Password" required className={inputCls} />
            </div>

            {/* Password requirements */}
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

            <div className="flex flex-col items-center gap-6 mt-2">
              <button type="submit"
                className="w-full px-6 py-4 bg-sky-700 rounded-[30px] text-white text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-800 transition-colors">
                Sign up
              </button>
              <div className="flex items-center gap-1">
                <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">Already have an account?</span>
                <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Login</Link>
              </div>
            </div>
          </form>

          <div className="relative h-7">
            <div className="absolute inset-x-0 top-[14px] h-px bg-gray-100" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[4px] px-2 bg-white">
              <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">OR</span>
            </div>
          </div>

          <a href={`${SHOP_URL}/my-account?google_login=1`}
            className="w-full p-4 bg-white rounded-3xl outline outline-[1.5px] outline-neutral-700 flex justify-center items-center gap-4 hover:bg-gray-50 transition-colors">
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
            <span className="text-neutral-700 text-base font-medium font-['Space_Grotesk'] leading-6">Continue with Google</span>
          </a>
        </div>
      </div>
    </main>
  );
}
