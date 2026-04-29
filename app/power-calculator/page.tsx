import PowerCalculatorTool from '@/components/PowerCalculatorTool';

export const metadata = { title: 'Power Calculator – Prag' };

export default function PowerCalculatorPage() {
  return (
    <main className="w-full bg-white flex flex-col">
      <div className="w-full pt-20 pb-10 bg-stone-50 flex flex-col items-center gap-6">
        <h1 className="text-sky-700 text-5xl font-bold font-['Onest'] text-center">
          What Size System Do You Actually Need?
        </h1>
        <p className="w-[531px] text-center text-sky-700 text-lg font-normal font-['Space_Grotesk']">
          Select your appliances, set daily usage hours, and get an instant system recommendation — free, no signup required.
        </p>
      </div>
      <PowerCalculatorTool />
    </main>
  );
}
