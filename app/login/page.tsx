import AuthPanel from '@/components/AuthPanel';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Login – Prag' };

const SHOP_URL = process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.xyz.com';

export default function LoginPage() {
  return (
    <main className="w-full h-screen bg-white flex overflow-hidden">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-16">
        <div className="w-[641px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-stone-900 text-4xl font-semibold font-['Onest'] leading-10">Welcome back!</h2>
            <div className="flex items-center gap-1">
              <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">Don&apos;t have an account?</span>
              <Link href="/register" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Sign Up</Link>
            </div>
          </div>

          {/* WooCommerce handles actual auth — form posts to shop subdomain */}
          <form action={`${SHOP_URL}/my-account`} method="POST" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Email Address</label>
              <input name="username" type="email" placeholder="you@company.com" required
                className="w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-900 text-xs font-bold font-['Space_Grotesk'] leading-5">Password</label>
              <input name="password" type="password" placeholder="Enter Password" required
                className="w-full h-12 px-4 py-3 bg-white rounded-[10px] outline outline-[1.31px] outline-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:outline-sky-700 outline-none transition-colors" />
            </div>

            <div className="flex flex-col items-center gap-6 mt-2">
              <button type="submit"
                className="w-full h-16 px-6 py-4 bg-sky-700 rounded-[30px] text-white text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-800 transition-colors">
                Log in
              </button>
              <div className="flex items-center gap-1">
                <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">Forgot Password?</span>
                <a href={`${SHOP_URL}/my-account/lost-password`} className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] leading-5">Recover</a>
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="relative h-7">
            <div className="absolute inset-x-0 top-[14px] h-px bg-gray-100" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[4px] px-2 bg-white">
              <span className="text-neutral-700 text-sm font-normal font-['Space_Grotesk'] leading-5">OR</span>
            </div>
          </div>

          {/* Google SSO — handled by WooCommerce plugin */}
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
