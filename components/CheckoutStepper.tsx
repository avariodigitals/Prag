const STEPS = ['Contact', 'Shipping', 'Payment'];

interface Props {
  activeStep: number;
}

export default function CheckoutStepper({ activeStep }: Props) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium font-['Inter'] ${i <= activeStep ? 'bg-sky-700' : 'bg-zinc-300'}`}>
                {i + 1}
              </div>
              <span className={`text-xs md:text-sm font-medium font-['Onest'] whitespace-nowrap ${i <= activeStep ? 'text-sky-700' : 'text-zinc-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 md:w-24 h-0 border-t-2 mb-5 mx-1 md:mx-2 ${i < activeStep ? 'border-sky-700' : 'border-zinc-300'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
