import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface Props {
  orderId: string;
  orderDate: string;
}

export default function OrderReceivedModal({ orderId, orderDate }: Props) {
  return (
    <div className="relative z-20 w-[762px] pb-6 bg-white rounded-3xl shadow-lg outline outline-1 outline-zinc-100 flex flex-col items-center gap-5 overflow-hidden">
      {/* Header bar */}
      <div className="w-full h-20 px-6 py-6 bg-white border-b border-stone-50" />

      {/* Body */}
      <div className="w-full flex flex-col items-center gap-6">
        <div className="px-6 flex flex-col items-center gap-8">
          {/* Icon + title */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-sky-700/10 rounded-full">
              <CheckCircle className="w-14 h-14 text-sky-700" />
            </div>
            <h2 className="text-neutral-950 text-2xl font-medium font-['Space_Grotesk'] leading-7">
              Order Received
            </h2>
            <p className="text-zinc-500 text-sm font-normal font-['Space_Grotesk'] leading-5">
              Thank you for your order!
            </p>
          </div>
        </div>

        <div className="w-full px-8 py-6 flex flex-col items-center gap-8">
          {/* Order details */}
          <div className="w-full flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <span className="text-neutral-950 text-base font-medium font-['Space_Grotesk'] leading-6">
                Order Number
              </span>
              <span className="text-sky-700 text-2xl font-medium font-['Space_Grotesk'] leading-7">
                {orderId ? `#${orderId}` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-950 text-base font-medium font-['Space_Grotesk'] leading-6">
                Order Date
              </span>
              <span className="text-neutral-700 text-lg font-medium font-['Space_Grotesk'] leading-7">
                {orderDate}
              </span>
            </div>
          </div>

          {/* Confirmation message */}
          <div className="w-full p-6 bg-sky-700/10 rounded-xl flex justify-center items-center">
            <p className="text-center text-sky-700 text-lg font-medium font-['Space_Grotesk'] leading-7">
              We&apos;ve sent a confirmation email with your order details. Our sales representative will reach out to you in a short while.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/products"
            className="w-full h-16 px-6 py-4 bg-sky-700 rounded-[30px] flex justify-center items-center hover:bg-sky-800 transition-colors"
          >
            <span className="text-white text-lg font-medium font-['Space_Grotesk'] leading-7">
              Continue Shopping
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
