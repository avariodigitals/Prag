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
      {/* Breadcrumb + title */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sky-700 text-sm md:text-2xl font-medium font-['Onest'] hover:underline">Home</Link>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest'] mx-1">/</span>
          <span className="text-zinc-500 text-xs md:text-base font-medium font-['Onest']">{breadcrumb}</span>
        </div>
        <h1 className="text-black text-2xl md:text-4xl font-medium font-['Onest']">{title}</h1>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex justify-center">
        <div className="w-full max-w-[997px] p-4 md:p-8 bg-white rounded-2xl outline outline-1 outline-zinc-100 flex flex-col gap-8 md:gap-10">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-4 md:gap-6">
              <h2 className="text-neutral-950 text-xl md:text-3xl font-medium font-['Space_Grotesk']">{section.heading}</h2>
              <div className="text-neutral-700 text-sm md:text-base font-normal font-['Space_Grotesk'] leading-6">{section.body}</div>
            </div>
          ))}
          {highlight}
        </div>
      </div>
    </main>
  );
}
