export const dynamic = 'force-dynamic';

import Image from 'next/image';
import CountUp from '@/components/CountUp';
import { getB2CPublicContent, findB2CPage, findVisibleSectionsByType } from '@/lib/b2cContent';

export const metadata = {
  title: 'About Us – Prag',
  alternates: { canonical: 'https://shop.prag.global/about' },
};

const FALLBACK_STATS = [
  { value: 50000, display: 50, suffix: 'K+', label: 'Systems Installed' },
  { value: 20, display: 20, suffix: '+', label: 'Years Active' },
  { value: 36, display: 36, suffix: '', label: 'States Covered' },
];

const FALLBACK_VALUES = [
  { title: 'Engineering Excellence', body: 'Engineering Power Systems with Precision, Technical Expertise, and a Focus on Long-Term Performance' },
  { title: 'Reliable Power Systems You Trust', body: 'Building Reliable Power Solutions That Perform Consistently Under Real-World Conditions' },
  { title: 'Practical Solutions for Real Conditions', body: 'Delivering Practical Power Solutions Designed for Real Environments, Not Just Ideal Scenarios' },
  { title: 'Designed to Meet Your Needs', body: 'Putting Client Needs First by Designing Power Systems Around Real Challenges and Requirements' },
];

const STORY_PARAS = [
  'PRAG was founded with a clear mission: to help homes and businesses overcome the challenges of unreliable electricity.\nPoor voltage conditions, unreliable backup systems, and improperly designed solar installations often result in equipment damage, downtime, and unnecessary costs.',
  'We set out to address these challenges through sound engineering and practical system design.\nSince 2012, we have helped customers across Nigeria protect their equipment, maintain business continuity, and improve power reliability.',
  'Today, PRAG provides voltage stabilization, backup power, solar energy, and energy storage solutions backed by technical expertise and real-world experience.\nOur focus remains the same: delivering reliable power solutions designed for the realities of Nigerian power conditions.',
];

// Parse admin stats content lines like "50K+ Systems Installed" into structured stats
function parseStats(content: string): { display: number; suffix: string; label: string }[] {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    // Match patterns like "50K+ Systems Installed", "20+ Years Active", "36 States Covered"
    const match = line.match(/^(\d+)(K\+|\+|)\s+(.+)$/);
    if (match) {
      return { display: Number(match[1]), suffix: match[2], label: match[3] };
    }
    // Fallback: just show the whole line as label
    return { display: 0, suffix: '', label: line };
  });
}

// Parse admin values content into title/body pairs.
// Format: "Title: Body text" per block, separated by blank lines.
// Also handles "Title\nBody text" (title on first line, body on rest).
function parseValues(content: string): { title: string; body: string }[] {
  const blocks = content.split('\n\n').map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    // Try "Title: Body" format first
    const colonMatch = block.match(/^([^:]+):\s*([\s\S]+)$/);
    if (colonMatch) {
      return { title: colonMatch[1].trim(), body: colonMatch[2].trim() };
    }
    // Fallback: title on first line, body on rest
    const lines = block.split('\n').map(l => l.trim());
    const title = lines[0] || '';
    const body = lines.slice(1).join(' ');
    return { title, body: body || title };
  });
}

export default async function AboutPage() {
  const content = await getB2CPublicContent();
  const page = findB2CPage(content, '/about');
  const heroSection = findVisibleSectionsByType(page, 'hero')[0];
  const contentSections = findVisibleSectionsByType(page, 'content');
  const introSection = contentSections[0];
  const storySection = contentSections[1];
  const statsSection = findVisibleSectionsByType(page, 'stats')[0];
  const valuesSection = findVisibleSectionsByType(page, 'values')[0];

  const heroTitle = heroSection?.summary || 'Engineering Reliable Power Solutions for Real-World Challenges';
  const heroDesc = heroSection?.content || 'PRAG delivers power stabilization, backup power, solar energy, and energy storage solutions designed for Nigerian power conditions.';
  const introKicker = introSection?.kicker || 'ABOUT PRAG';
  const introTitle = introSection?.summary || 'Built on Engineering, Driven by Real Power Challenges';
  const introContent = introSection?.content || `At PRAG, we believe reliable power starts with proper engineering.
                Rather than simply supplying equipment, we design complete power systems tailored to each client's needs, ensuring long-term performance, protection, and efficiency.

                We help homes, businesses, and industries achieve reliable, efficient, and sustainable power through engineering-led system design and implementation.

                Our solutions are backed by years of practical experience and thousands of successful installations across Nigeria.`;
  const introImage = introSection?.imageUrl || 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6.png';
  const storyKicker = storySection?.kicker || 'OUR STORY';
  const storyTitle = storySection?.summary || 'Nigeria\'s Leading Provider of Voltage Regulation, Power Backup, Storage, and Renewable Energy Solutions.';
  const storyContent = storySection?.content || STORY_PARAS.join('\n\n');
  const storyImage = storySection?.imageUrl || 'https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png';

  // Use admin stats if available, otherwise fallback
  const stats = statsSection?.content ? parseStats(statsSection.content) : FALLBACK_STATS;
  const values = valuesSection?.content ? parseValues(valuesSection.content) : FALLBACK_VALUES;
  const valuesTitle = valuesSection?.summary || 'Built on Principles That Deliver Reliable Results';
  const valuesIntro = valuesSection?.kicker || 'Our work is guided by a commitment to quality, precision, and long-term performance.';

  return (
    <main className="w-full bg-white flex flex-col">

      {/* Hero */}
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-4xl font-bold font-['Onest'] text-center leading-snug">
          {heroTitle}
        </h1>
        <p className="max-w-[531px] text-center text-black text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed">
          {heroDesc}
        </p>
      </div>

      {/* About section */}
      <section className="w-full px-4 md:px-20 py-12 md:py-24 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-widest">{introKicker}</span>
          </div>
          <div className="flex-1 flex flex-col gap-10 md:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-zinc-900 text-xl md:text-3xl font-semibold font-['Space_Grotesk'] leading-snug">
                {introTitle}
              </h2>
              <p className="text-zinc-500 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed whitespace-pre-line">
                {introContent}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-10 md:gap-0">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 w-full">
                  <span className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest'] text-center">
                    <CountUp value={stat.display} suffix={stat.suffix} />
                  </span>
                  <span className="text-zinc-500 text-sm md:text-base font-normal font-['Onest'] text-center">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Team image */}
            <div className="relative w-full h-64 md:h-[499px] rounded-3xl overflow-hidden">
              <Image
                src={introImage}
                alt="PRAG Team"
                fill
                sizes="(max-width: 768px) 100vw, 1082px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="w-full px-4 md:px-20 py-12 md:py-24 flex flex-col items-center gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-widest">{storyKicker}</span>
          </div>
          <h2 className="max-w-[1082px] text-center text-zinc-900 text-xl md:text-3xl font-semibold font-['Space_Grotesk'] leading-snug">
            {storyTitle}
          </h2>
        </div>
        {/* Story: text first, image below on mobile; side-by-side on desktop */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10">
          <div className="relative w-full md:w-[539px] h-64 md:h-[499px] rounded-3xl overflow-hidden shrink-0 order-2 md:order-1">
            <Image
              src={storyImage}
              alt="Our Story"
              fill
              sizes="(max-width: 768px) 100vw, 539px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-6 order-1 md:order-2">
            {storyContent.split('\n\n').map((para, i) => (
              <p key={i} className="text-zinc-500 text-base md:text-lg font-normal font-['Space_Grotesk'] leading-relaxed whitespace-pre-line">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="w-full px-4 md:px-20 py-12 md:py-24 bg-stone-50 flex flex-col items-center gap-10 md:gap-20">
        <div className="flex flex-col items-center gap-4 md:gap-7">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-zinc-900 text-sm font-medium font-['Space_Grotesk'] uppercase tracking-widest">OUR CORE VALUES</span>
          </div>
          <h2 className="max-w-[631px] text-center text-zinc-900 text-xl md:text-3xl font-medium font-['Onest'] leading-snug">
            {valuesTitle}
          </h2>
          <p className="text-center text-neutral-500 text-base md:text-lg font-normal font-['Onest'] leading-relaxed">
            {valuesIntro}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl outline outline-[0.3px] outline-zinc-600 flex flex-col gap-8 md:gap-12">
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-sky-700 rounded-full w-fit">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <h3 className="text-zinc-900 text-base md:text-lg font-semibold font-['Onest'] leading-snug">{val.title}</h3>
              </div>
              <p className="text-neutral-500 text-base md:text-lg font-normal font-['Onest'] leading-relaxed">{val.body}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
