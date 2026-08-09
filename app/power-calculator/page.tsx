import PowerCalculatorTool from '@/components/PowerCalculatorTool';

export const metadata = { title: 'Power Calculator' };

export default function PowerCalculatorPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <h1 className="text-black text-2xl md:text-3xl font-bold font-['Montserrat'] text-center leading-snug">
          What Size System Do You Actually Need?
        </h1>
        <p className="max-w-[531px] text-center text-black text-sm md:text-base font-normal font-['Montserrat'] leading-relaxed">
          Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
        </p>
      </div>
      <PowerCalculatorTool />
    </main>
  );
}
