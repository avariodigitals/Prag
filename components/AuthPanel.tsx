import Image from 'next/image';

interface Props {
  headline: string;
  subtext: string;
}

export default function AuthPanel({ headline, subtext }: Props) {
  return (
    <div className="w-[700px] h-[984px] relative rounded-[30px] overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-sky-700 rounded-[30px]" />
      {/* Decorative grid squares */}
      {[
        [91, 303], [218, 657], [215, 417], [343, 534], [470, 889], [468, 649],
        [595, 303], [722, 657], [720, 417], [470, 192], [218, 309], [343, 300],
      ].map(([left, top], i) => (
        <div
          key={i}
          className="w-32 h-32 absolute rounded-xl border-2 border-white backdrop-blur-[34px]"
          style={{ left, top }}
        />
      ))}
      <Image src="https://central.prag.global/wp-content/uploads/2026/04/prag-inverter-stabilizer-white-logo.png" alt="Prag" width={150} height={34} className="absolute left-[60px] top-[70px]" style={{ height: 'auto', width: 'auto' }} />
      <div className="absolute left-[60px] top-[288px] w-[539px] flex flex-col gap-6">
        <h1 className="text-white text-5xl font-bold font-['Onest']">{headline}</h1>
        <p className="text-white text-lg font-normal font-['Space_Grotesk']">{subtext}</p>
      </div>
    </div>
  );
}
