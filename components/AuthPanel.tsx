import Image from 'next/image';

interface Props {
  headline: string;
  subtext: string;
}

export default function AuthPanel({ headline, subtext }: Props) {
  return (
    <div className="hidden lg:flex w-[520px] xl:w-[600px] shrink-0 relative rounded-[24px] overflow-hidden m-4 self-stretch">
      <div className="absolute inset-0 bg-sky-700" />
      {/* Decorative grid squares */}
      {[
        [91, 303], [218, 657], [215, 417], [343, 534], [470, 889], [468, 649],
        [595, 303], [722, 657], [720, 417], [470, 192], [218, 309], [343, 300],
      ].map(([left, top], i) => (
        <div key={i} className="w-32 h-32 absolute rounded-xl border-2 border-white/30 backdrop-blur-sm"
          style={{ left, top }} />
      ))}
      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        <Image
          src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png"
          alt="Prag" width={140} height={32} style={{ height: 'auto', width: 'auto' }}
        />
        <div className="flex flex-col gap-6">
          <h1 className="text-white text-4xl xl:text-5xl font-bold font-['Onest'] leading-tight">{headline}</h1>
          <p className="text-white/80 text-base xl:text-lg font-normal font-['Space_Grotesk'] leading-relaxed">{subtext}</p>
        </div>
        <p className="text-white/40 text-xs font-['Space_Grotesk']">© 2026 PRAG. All rights reserved.</p>
      </div>
    </div>
  );
}
