import Image from 'next/image';
import CountUp from '@/components/CountUp';

export const metadata = { title: 'About Us – Prag' };

const STATS = [
  { value: 50000, display: 50, suffix: 'K+', label: 'Systems Installed' },
  { value: 20, display: 20, suffix: '+', label: 'Years Active' },
  { value: 500, display: 500, suffix: '+', label: 'Happy Clients' },
  { value: 36, display: 36, suffix: '', label: 'States Covered' },
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

export default function AboutPage() {
  return (
    <main className="w-full bg-white flex flex-col">

      {/* Hero */}
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-sky-700 text-2xl md:text-4xl font-bold font-['Onest'] text-center leading-snug">
          Engineering Reliable Power Solutions for Real-World Challenges
        </h1>
        <p className="max-w-[531px] text-center text-sky-700 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed">
          PRAG is a power solutions company focused on designing and delivering systems that solve unstable electricity problems for homes, businesses, and industries.
        </p>
      </div>

      {/* About section */}
      <section className="w-full px-4 md:px-20 py-12 md:py-24 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-20">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-zinc-900 text-xs font-medium font-['Space_Grotesk'] uppercase tracking-widest">ABOUT PRAG</span>
          </div>
          <div className="flex-1 flex flex-col gap-10 md:gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-zinc-900 text-xl md:text-3xl font-semibold font-['Space_Grotesk'] leading-snug">
                Built on Engineering, Driven by Real Power Challenges
              </h2>
              <p className="text-zinc-500 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed">
                PRAG was founded to address one core problem, unreliable electricity. Instead of simply supplying equipment, we set out to design complete power solutions that ensure stability, efficiency, and long-term performance.
                <br /><br />
                Today, we work with homeowners, businesses, and industrial clients to deliver systems tailored to their specific needs, backed by technical expertise and real-world experience.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-10 md:gap-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5 w-full">
                  <span className="text-sky-700 text-3xl md:text-4xl font-bold font-['Onest'] text-center">
                    <CountUp value={stat.display} suffix={stat.suffix} />
                  </span>
                  <span className="text-zinc-500 text-xs md:text-sm font-normal font-['Onest'] text-center">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Team image */}
            <div className="relative w-full h-64 md:h-[499px] rounded-3xl overflow-hidden">
              <Image
                src="https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6.png"
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
            <span className="text-zinc-900 text-xs font-medium font-['Space_Grotesk'] uppercase tracking-widest">OUR STORY</span>
          </div>
          <h2 className="max-w-[1082px] text-center text-zinc-900 text-xl md:text-3xl font-semibold font-['Space_Grotesk'] leading-snug">
            Nigeria&apos;s Leading Provider of Voltage Regulation, Power Backup, Storage, and Renewable Energy Solutions.
          </h2>
        </div>
        {/* Story: text first, image below on mobile; side-by-side on desktop */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10">
          <div className="relative w-full md:w-[539px] h-64 md:h-[499px] rounded-3xl overflow-hidden shrink-0 order-2 md:order-1">
            <Image
              src="https://central.prag.global/wp-content/uploads/2026/04/51105cfa2d7e118079c6acdb18a81c8b54dc18e6-1.png"
              alt="Our Story"
              fill
              sizes="(max-width: 768px) 100vw, 539px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-6 order-1 md:order-2">
            {STORY_PARAS.map((para, i) => (
              <p key={i} className="text-zinc-500 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="w-full px-4 md:px-20 py-12 md:py-24 bg-stone-50 flex flex-col items-center gap-10 md:gap-20">
        <div className="flex flex-col items-center gap-4 md:gap-7">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-sky-700" />
            <span className="text-zinc-900 text-xs font-medium font-['Space_Grotesk'] uppercase tracking-widest">OUR CORE VALUES</span>
          </div>
          <h2 className="max-w-[631px] text-center text-zinc-900 text-xl md:text-3xl font-bold font-['Onest'] leading-snug">
            Built on Principles That Deliver Reliable Results
          </h2>
          <p className="text-center text-neutral-500 text-sm md:text-base font-normal font-['Onest'] leading-relaxed">
            Our work is guided by a commitment to quality, precision, and long-term performance.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((val) => (
            <div key={val.title} className="p-6 bg-white rounded-3xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-16 md:gap-36">
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-sky-700 rounded-full w-fit">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <h3 className="text-zinc-900 text-base md:text-lg font-semibold font-['Onest'] leading-snug">{val.title}</h3>
              </div>
              <p className="text-neutral-500 text-sm md:text-base font-normal font-['Onest'] leading-relaxed">{val.body}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
