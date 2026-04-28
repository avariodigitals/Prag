import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata = { title: 'About Us – Prag' };

const STATS = [
  { value: '50K+', label: 'Systems Installed' },
  { value: '20+', label: 'Years Active' },
  { value: '500+', label: 'Happy Clients' },
  { value: '36', label: 'States Covered' },
];

const VALUES = [
  { title: 'Engineering for Reliable Power', body: 'Engineering Power Systems with Precision, Technical Expertise, and a Focus on Long-Term Performance' },
  { title: 'Reliable Power Systems You Trust', body: 'Building Reliable Power Solutions That Perform Consistently Under Real-World Conditions' },
  { title: 'Practical Solutions for Real Conditions', body: 'Delivering Practical Power Solutions Designed for Real Environments, Not Just Ideal Scenarios' },
  { title: 'Designed to Meet Your Needs', body: 'Putting Client Needs First by Designing Power Systems Around Real Challenges and Requirements' },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      <div className="w-full px-14 pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">
          Engineering Reliable Power Solutions for Real-World Challenges
        </h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Prag is a power solutions company focused on designing and delivering systems that solve unstable electricity problems for homes, businesses, and industries.
        </p>
      </div>

      {/* About section */}
      <section className="w-full px-20 py-24 flex flex-col gap-10">
        <div className="flex items-start gap-20">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">ABOUT PRAG</span>
          </div>
          <div className="flex-1 flex flex-col gap-20">
            <div className="flex flex-col gap-6">
              <h2 className="text-zinc-900 text-5xl font-medium font-['Space_Grotesk']">Built on Engineering, Driven by Real Power Challenges</h2>
              <p className="text-zinc-500 text-xl font-normal font-['Space_Grotesk']">
                Prag was founded to address one core problem — unreliable electricity. Instead of simply supplying equipment, we set out to design complete power solutions that ensure stability, efficiency, and long-term performance.
                <br /><br />
                Today, we work with homeowners, businesses, and industrial clients to deliver systems tailored to their specific needs, backed by technical expertise and real-world experience.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-sky-700 text-5xl font-light font-['Onest']">{stat.value}</span>
                  <span className="text-sky-700 text-3xl font-normal font-['Onest']">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="relative w-full h-[499px] rounded-3xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 text-lg font-['Space_Grotesk']">About Team Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="w-full px-20 py-24 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">OUR STORY</span>
          </div>
          <h2 className="w-[1082px] text-center text-zinc-900 text-5xl font-medium font-['Space_Grotesk']">
            Nigeria&apos;s Leading Provider of Voltage Regulation, Power Backup, Storage, and Renewable Energy Solutions.
          </h2>
        </div>
        <div className="flex items-center gap-10">
          <div className="relative w-[539px] h-[499px] rounded-3xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200">
            <span className="text-slate-400 text-lg font-['Space_Grotesk']">Our Story Image</span>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            {[
              'Prag Power Engineering was founded in 2005 by a team of electrical engineers who were frustrated with the poor quality of power solutions being installed across Nigeria.',
              'We started with a simple mission: engineer power systems that actually work in Nigerian conditions — not imported cookie-cutter solutions, but systems designed specifically for the voltage fluctuations, frequent outages, and harsh environments we face here.',
              'Twenty years later, we\'ve installed over 50,000 systems across 36 states. Our engineers hold COREN certifications and international qualifications.',
              'We\'ve grown, but our mission hasn\'t changed: reliable power engineering, done right.',
            ].map((para, i) => (
              <p key={i} className="text-zinc-500 text-xl font-normal font-['Space_Grotesk']">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="w-full px-20 py-24 bg-stone-50 flex flex-col items-center gap-20">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-sky-700" />
            <span className="text-zinc-900 text-base font-normal font-['Space_Grotesk']">OUR CORE VALUES</span>
          </div>
          <h2 className="w-[631px] text-center text-zinc-900 text-5xl font-bold font-['Onest']">Built on Principles That Deliver Reliable Results</h2>
          <p className="text-center text-neutral-700 text-xl font-normal font-['Onest']">Our work is guided by a commitment to quality, precision, and long-term performance.</p>
        </div>
        <div className="w-full flex flex-col gap-6">
          {[VALUES.slice(0, 2), VALUES.slice(2)].map((row, ri) => (
            <div key={ri} className="flex gap-6">
              {row.map((val) => (
                <div key={val.title} className="flex-1 p-6 bg-white rounded-3xl outline outline-[0.3px] outline-zinc-500/50 flex flex-col gap-36">
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-sky-700 rounded-full w-fit">
                      <div className="w-4 h-4 bg-white rounded-sm" />
                    </div>
                    <h3 className="text-zinc-900 text-2xl font-medium font-['Onest']">{val.title}</h3>
                  </div>
                  <p className="text-neutral-700 text-lg font-normal font-['Onest']">{val.body}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
