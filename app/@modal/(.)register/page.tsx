'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, X } from 'lucide-react';

const inputCls = "w-full h-12 px-4 bg-white rounded-xl border border-gray-200 text-neutral-700 text-sm font-normal font-['Space_Grotesk'] focus:border-sky-700 focus:outline-none transition-colors";

type Step = 'form' | 'otp' | 'success';

export default function RegisterModal() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      window.location.assign('/register');
    }
  }, []);

  function closeModal() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  }

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
    if (body.password !== confirm) { setError('Passwords do not match.'); setLoading(false); return; }
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
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
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
    /* Intercepting route — the previous page is mounted behind this overlay */
    <div className="lg:hidden fixed inset-0 backdrop-blur-md bg-black/50 flex items-end justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="w-full max-h-[92dvh] overflow-y-auto bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8"
        onClick={e => e.stopPropagation()}>
        {/* drag handle */}
        <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-4" />

        {/* header: logo + close */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/" aria-label="Go to homepage" className="inline-flex">
            <Image src="/Prag Logo.png" alt="Prag" width={100} height={24} style={{ height: 'auto', width: 'auto' }} />
          </Link>
          <button type="button" onClick={closeModal} aria-label="Close"
            className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-4">

          {/* ── Step 1: Registration form ── */}
          {step === 'form' && (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-stone-900 text-xl font-semibold font-['Onest'] leading-tight">Get Started</h2>
                <span className="text-neutral-500 text-sm font-['Space_Grotesk']">Enter your details to start shopping on PRAG</span>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">{error}</div>}

              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="flex gap-3">
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

                <button type="submit" disabled={loading}
                  className="w-full h-12 bg-sky-700 rounded-2xl text-white text-sm font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50 mt-1">
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-neutral-500 text-sm font-['Space_Grotesk']">Already have an account?</span>
                  <Link href="/login" className="text-sky-700 text-sm font-medium font-['Space_Grotesk'] hover:underline">Login</Link>
                </div>
              </form>
            </>
          )}

          {/* ── Step 2: OTP verification ── */}
          {step === 'otp' && (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-stone-900 text-xl font-semibold font-['Onest'] leading-tight">Verify your email</h2>
                <p className="text-neutral-500 text-sm font-['Space_Grotesk']">
                  We sent a 6-digit code to <span className="text-zinc-900 font-medium">{email}</span>.
                </p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-['Space_Grotesk']">{error}</div>}

              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <div onPaste={handleOtpPaste} className="flex justify-between gap-2">
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
                      className="w-full h-12 text-center text-xl font-bold text-zinc-900 bg-white rounded-xl border border-gray-200 focus:border-sky-700 focus:outline-none transition-colors font-['Space_Grotesk']"
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || otp.join('').length < 6}
                  className="w-full h-12 bg-sky-700 rounded-2xl text-white text-sm font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <p className="text-center text-sm text-neutral-500 font-['Space_Grotesk']">
                  Didn&apos;t receive a code?{' '}
                  <button type="button" onClick={resendOtp} className="text-sky-700 font-medium hover:underline">Resend</button>
                </p>
              </form>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-sky-700" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-stone-900 text-xl font-semibold font-['Onest']">Account created!</h2>
                <p className="text-neutral-500 text-sm font-['Space_Grotesk']">Your email has been verified. Redirecting you now...</p>
              </div>
              <Link href="/account" className="w-full h-12 bg-sky-700 rounded-2xl text-white text-sm font-semibold font-['Space_Grotesk'] hover:bg-sky-800 transition-colors flex items-center justify-center">
                Go to my account
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
