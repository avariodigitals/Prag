import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Section {
  heading: string;
  body: React.ReactNode;
}

interface Props {
  title: string;
  breadcrumb: string;
  sections: Section[];
  highlight?: React.ReactNode;
}

export default function PolicyPageLayout({ title, breadcrumb, sections, highlight }: Props) {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      {/* Breadcrumb + title */}
      <div className="w-full px-20 py-10 bg-stone-50 flex flex-col gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-base font-medium font-['Onest']">{breadcrumb}</span>
        </div>
        <h1 className="text-black text-4xl font-medium font-['Onest']">{title}</h1>
      </div>

      {/* Content */}
      <div className="w-full px-20 py-10 flex justify-center">
        <div className="w-[997px] p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 flex flex-col gap-10">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-6">
              <h2 className="text-neutral-950 text-3xl font-medium font-['Space_Grotesk']">{section.heading}</h2>
              <div className="text-neutral-700 text-base font-normal font-['Space_Grotesk']">{section.body}</div>
            </div>
          ))}
          {highlight}
        </div>
      </div>

      <Footer />
    </main>
  );
}
