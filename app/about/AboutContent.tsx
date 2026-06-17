'use client';

import { useEffect, useState } from 'react';

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

export default function AboutContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) {
        await getPageContent();
        if (!cancelled) {
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

      {/* Built on Engineering */}
      <div className="w-full px-4 md:px-14 py-8 md:py-10 flex flex-col items-center gap-4 md:gap-6">
        <h2 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          Built on Engineering, Driven by Real Power Challenges
        </h2>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          PRAG was founded to address one core problem, unreliable electricity. Instead of simply supplying equipment, we set out to design complete power solutions that ensure stability, efficiency, and long-term performance.
        </p>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          Today, we work with homeowners, businesses, and industrial clients to deliver systems tailored to their specific needs, backed by technical expertise and real-world experience.
        </p>
      </div>

      {/* Stats */}
      <div className="w-full px-4 md:px-14 py-8 md:py-10 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-4xl md:text-5xl font-bold text-amber-600 font-['Montserrat']">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-black text-sm md:text-base font-medium font-['Montserrat'] text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="w-full px-4 md:px-14 py-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug mb-8">
            Our Story
          </h2>
          <div className="flex flex-col gap-4 md:gap-6">
            {STORY_PARAS.map((para, i) => (
              <p key={i} className="text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="w-full px-4 md:px-14 py-8 md:py-10 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug mb-8">
            Our Core Values
          </h2>
          <p className="text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed mb-8 max-w-[531px] mx-auto">
            Built on Principles That Deliver Reliable Results
          </p>
          <p className="text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed mb-8 max-w-[531px] mx-auto">
            Our work is guided by a commitment to quality, precision, and long-term performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-black text-lg font-semibold font-['Montserrat'] mb-3">
                  {value.title}
                </h3>
                <p className="text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
