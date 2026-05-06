import Link from 'next/link';
import { XCircle } from 'lucide-react';

interface Props {
  orderId: string;
}

export default function OrderFailedModal({ orderId }: Props) {
  return (
    <div className="relative z-20 w-full max-w-[762px] pb-4 md:pb-6 bg-white rounded-2xl md:rounded-3xl shadow-lg outline outline-1 outline-zinc-100 flex flex-col items-center gap-4 md:gap-5 overflow-hidden">
      <div className="w-full h-14 md:h-20 px-4 md:px-6 py-4 md:py-6 bg-white border-b border-stone-50" />

      <div className="w-full flex flex-col items-center gap-6">
        <div className="px-4 md:px-6 flex flex-col items-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-rose-600/10 rounded-full">
              <XCircle className="w-14 h-14 text-rose-600" />
            </div>
            <h2 className="text-neutral-950 text-xl md:text-2xl font-medium font-['Space_Grotesk'] leading-7 text-center">
              Payment Failed
            </h2>
            <p className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] leading-5 text-center">
              Your payment was not completed.
            </p>
          </div>
        </div>

        <div className="w-full px-4 md:px-8 py-4 md:py-6 flex flex-col items-center gap-6 md:gap-8">
          <div className="w-full flex justify-between items-start">
            <span className="text-neutral-950 text-base font-medium font-['Space_Grotesk'] leading-6">
              Order Number
            </span>
            <span className="text-rose-700 text-lg md:text-2xl font-medium font-['Space_Grotesk'] leading-7 text-right break-all">
              {orderId ? `#${orderId}` : '—'}
            </span>
          </div>

          <div className="w-full p-4 md:p-6 bg-rose-600/10 rounded-xl flex justify-center items-center">
            <p className="text-center text-rose-700 text-sm md:text-lg font-medium font-['Space_Grotesk'] leading-6 md:leading-7">
              We could not confirm your payment. Please try again or contact support if this persists.
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link
              href="/checkout/payment"
              className="flex-1 h-12 md:h-16 px-6 py-3 md:py-4 bg-sky-700 rounded-[30px] flex justify-center items-center hover:bg-sky-800 transition-colors"
            >
              <span className="text-white text-base md:text-lg font-medium font-['Space_Grotesk'] leading-7">
                Try Payment Again
              </span>
            </Link>
            <Link
              href="/contact"
              className="flex-1 h-12 md:h-16 px-6 py-3 md:py-4 rounded-[30px] border border-sky-700 flex justify-center items-center hover:bg-sky-50 transition-colors"
            >
              <span className="text-sky-700 text-base md:text-lg font-medium font-['Space_Grotesk'] leading-7">
                Contact Support
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
