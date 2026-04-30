'use client';

import AuthPanel from '@/components/AuthPanel';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

type Step = 'form' | 'otp' | 'success';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const body = {
      first_name: fd.get('first_name') as string,
      last_name: fd.get('last_name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      password: fd.get('password') as string,
    };
    const confirm = fd.get('confirm_password') as string;

    if (body.password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed.'); return; }
      setEmail(body.email);
      setPassword(body.password);
      setStep('otp');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(idx: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Verification failed.'); return; }
      setStep('success');
      if (data.autoLogin) setTimeout(() => { router.push('/account'); router.refresh(); }, 1500);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError('');
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name: '', last_name: '' }),
    });
  }

  return (
    <main className="min-h-screen bg-white flex">
      <AuthPanel
        headline="Shop Reliable Power Systems Built for Real-World Performance"
        subtext="Explore stabilizers, inverters, batteries, and complete power solutions designed to keep your home or business running without interruption."
      />

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="lg:hidden mb-8 self-start">
          <Image
            src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png"
            alt="Prag" width={120} height={28}
            style={{ height: 'auto', width: 'auto', filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg)' }}
          />
        </div>

        <div className="w-full max-w-[480px] flex flex-col gap-6">

          {/* ── Step 1: Registration form ── */}
          {step === 'form' && (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="text-stone-900 text-3xl md:text-4xl font-semibold font-['Onest'] leading-tight">Get Started</h2>
                <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">Enter your details to start shopping on PRAG</span>
              </div>

              {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">{error}</div>}

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                  <input name="confirm_password" type="password" placeholder="Confirm password" required className={inputCls} />
                </div>

                <div className="p-4 bg-sky-700/10 rounded-xl border border-sky-700/20 flex flex-col gap-2">
                  <span className="text-sky-700 text-sm font-medium font-['Space_Grotesk']">Password Requirements:</span>
                  {['At least 8 characters long', 'Contains uppercase and lowercase letters', 'Contains at least one number'].map((r) => (
                    <div key={r} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span className="text-sky-700 text-xs font-normal font-['Inter']">{r}</span>
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50 mt-2">
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">Already have an account?</span>
                  <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Login</Link>
                </div>
              </form>
            </>
          )}

          {/* ── Step 2: OTP verification ── */}
          {step === 'otp' && (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="text-stone-900 text-3xl md:text-4xl font-semibold font-['Onest'] leading-tight">Verify your email</h2>
                <p className="text-neutral-500 text-sm font-normal font-['Space_Grotesk']">
                  We sent a 6-digit code to <span className="text-zinc-900 font-medium">{email}</span>. Enter it below to confirm your account.
                </p>
              </div>

              {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">{error}</div>}

              <form onSubmit={handleVerify} className="flex flex-col gap-6">
                <div onPaste={handleOtpPaste} className="flex justify-between gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-full h-14 text-center text-2xl font-bold text-zinc-900 bg-white rounded-xl border border-gray-200 focus:border-sky-700 focus:outline-none transition-colors font-['Space_Grotesk']"
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || otp.join('').length < 6}
                  className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <p className="text-center text-sm text-neutral-500 font-['Space_Grotesk']">
                  Didn&apos;t receive a code?{' '}
                  <button type="button" onClick={resendOtp} className="text-sky-700 font-medium hover:underline">
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-sky-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-stone-900 text-3xl font-semibold font-['Onest']">Account created!</h2>
                <p className="text-neutral-500 text-sm font-['Space_Grotesk']">Your email has been verified. Redirecting you now...</p>
              </div>
              <Link href="/account" className="w-full h-14 bg-sky-700 rounded-2xl text-white text-base font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors flex items-center justify-center">
                Go to my account
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
