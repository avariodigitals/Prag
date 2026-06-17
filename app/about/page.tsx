'use client';

import Image from 'next/image';
import CountUp from '@/components/CountUp';
import { useEffect, useState } from 'react';

export const metadata = { title: 'About Us - Nigeria Number #1 Inverter, Battery, Stabilizer, Solar Solutions and more' };

const STATS = [
  { value: 50, suffix: 'K+', label: 'Systems Installed' },
  { value: 20, suffix: '+', label: 'Years Active' },
  { value: 36, suffix: '', label: 'States Covered' },
];

const VALUES = [
  { title: 'Engineering for Reliable Power', body: 'Engineering Power Systems with Precision, Technical Expertise, and a Focus on Long-Term Performance' },
  { title: 'Reliable Power Systems You Trust', body: 'Building Reliable Power Solutions That Perform Consistently Under Real-World Conditions' },
  { title: 'Practical Solutions for Real Conditions', body: 'Delivering Practical Power Solutions Designed for Real Environments, Not Just Ideal Scenarios' },
  { title: 'Designed to Meet Your Needs', body: 'Putting Client Needs First by Designing Power Systems Around Real Challenges and Requirements' },
];

const STORY_PARAS = [
  'PRAG Power Engineering was founded in 2005 by a team of electrical engineers who were frustrated with the poor quality of power solutions being installed across Nigeria. They saw expensive imported equipment failing because installers didn\'t understand Nigerian power conditions. They saw families and businesses suffering from systems that were never properly designed.',
  'We started with a simple mission: engineer power systems that actually work in Nigerian conditions. Not imported cookie-cutter solutions, but systems designed specifically for the voltage fluctuations, frequent outages, and harsh environments we face here.',
  'Twenty years later, we\'ve installed over 50,000 systems across 36 states. Our engineers hold COREN certifications and international qualifications. Our systems are running in homes, hospitals, hotels, banks, factories, and data centers across Nigeria.',
  'We\'ve grown, but our mission hasn\'t changed: reliable power engineering, done right.',
];

interface PageContent {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
}

async function getPageContent(): Promise<PageContent | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pages/content`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const pages = await res.json() as PageContent[];
      return pages.find((p: PageContent) => p.slug === 'about') || null;
    }
  } catch (error) {
    console.error('Failed to fetch page content:', error);
  }
  return null;
}

export default function AboutPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) {
        const content = await getPageContent();
        if (!cancelled) {
          setPageContent(content);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="w-full bg-white flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white flex flex-col">

      {/* Hero */}
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          Engineering Reliable Power Solutions for Real-World Challenges
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          PRAG is a power solutions company focused on designing and delivering systems that solve unstable electricity problems for homes, businesses, and industries.
        </p>
      </div>

      {/* About section */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20">

            {/* Kicker — left column */}
            <div className="flex items-center gap-[6px] shrink-0 pt-2">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
              <span className="text-zinc-900 text-xs font-medium font-['Montserrat'] uppercase tracking-widest">About PRAG</span>
            </div>

            {/* Content — right column */}
            <div className="flex-1 flex flex-col gap-20">
              {/* Heading + body */}
              <div className="flex flex-col gap-6">
                <h2 className="text-zinc-900 text-[32px] md:text-[48px] font-medium font-['Montserrat'] leading-tight">
                  Built on Engineering, Driven by Real Power Challenges
                </h2>
                <div className="flex flex-col gap-6">
                  <p className="text-zinc-500 text-[18px] md:text-[20px] font-normal font-['Montserrat'] leading-relaxed">
                    PRAG was founded to address one core problem, unreliable electricity. Instead of simply supplying equipment, we set out to design complete power solutions that ensure stability, efficiency, and long-term performance.
                  </p>
                  <p className="text-zinc-500 text-[18px] md:text-[20px] font-normal font-['Montserrat'] leading-relaxed">
                    Today, we work with homeowners, businesses, and industrial clients to deliver systems tailored to their specific needs, backed by technical expertise and real-world experience.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-[2px]">
                    <span className="text-sky-700 text-[40px] md:text-[48px] font-light font-['Montserrat'] leading-none">
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-sky-700 text-[20px] md:text-[28px] font-normal font-['Montserrat'] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Image */}
              <div className="relative w-full h-64 md:h-[499px] rounded-3xl overflow-hidden">
                <Image
                  src="https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6.png"
                  alt="PRAG solar installation"
                  fill
                  sizes="(max-width: 768px) 100vw, 1082px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10">

          {/* Kicker + heading — centered */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
              <span className="text-zinc-900 text-xs font-medium font-['Montserrat'] uppercase tracking-widest">Our Story</span>
            </div>
            <h2 className="text-zinc-900 text-[32px] md:text-[48px] font-medium font-['Montserrat'] leading-tight max-w-[1082px]">
              Nigeria&apos;s Leading Provider of Voltage Regulation, Power Backup, Storage, and Renewable Energy Solutions.
            </h2>
          </div>

          {/* Image (left) + text (right) */}
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 w-full">
            <div className="relative w-full md:w-[539px] h-64 md:h-[499px] rounded-3xl overflow-hidden shrink-0">
              <Image
                src="https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png"
                alt="Our Story"
                fill
                sizes="(max-width: 768px) 100vw, 539px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              {STORY_PARAS.map((para, i) => (
                <p key={i} className="text-zinc-500 text-[18px] md:text-[20px] font-normal font-['Montserrat'] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full px-6 md:px-20 py-8 md:py-24 bg-stone-50">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

          {/* Kicker + heading + subtitle — centered */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-4 h-4 bg-sky-700 rounded-sm shrink-0" aria-hidden="true" />
              <span className="text-zinc-900 text-xs font-medium font-['Montserrat'] uppercase tracking-widest">Our Core Values</span>
            </div>
            <h2 className="text-zinc-900 text-[32px] md:text-[48px] font-bold font-['Montserrat'] tracking-[-2px] leading-tight max-w-xl">
              Built on Principles That Deliver Reliable Results
            </h2>
            <p className="text-zinc-500 text-[18px] md:text-[20px] font-normal font-['Montserrat'] max-w-lg">
              Our work is guided by a commitment to quality, precision, and long-term performance.
            </p>
          </div>

          {/* Value cards grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <div
                key={`${val.title}-${i}`}
                className="p-6 bg-white rounded-3xl border border-zinc-400 flex flex-col gap-10 md:gap-[60px]"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  </div>
                  <h3 className="text-zinc-900 text-[20px] font-medium font-['Montserrat'] leading-snug">
                    {val.title}
                  </h3>
                </div>
                <p className="text-zinc-500 text-[16px] font-normal font-['Montserrat'] leading-relaxed">
                  {val.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
