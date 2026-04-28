const STEPS = ['Contact Details', 'Shipping Method', 'Payment'];

interface Props {
  activeStep: number; // 0-based
}

export default function CheckoutStepper({ activeStep }: Props) {
  return (
    <div className="flex items-center gap-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-normal font-['Inter'] ${i <= activeStep ? 'bg-sky-700' : 'bg-zinc-500'}`}>
              {i + 1}
            </div>
            <span className={`text-base font-medium font-['Onest'] ${i <= activeStep ? 'text-sky-700' : 'text-zinc-500'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-28 h-0 border-t-2 mb-6 ${i < activeStep ? 'border-sky-700' : 'border-zinc-500'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
