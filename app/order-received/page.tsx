import OrderReceivedModal from '@/components/OrderReceivedModal';

interface Props {
  searchParams: Promise<{ order_id?: string; order_date?: string }>;
}

export const metadata = { title: 'Order Received – Prag' };

export default async function OrderReceivedPage({ searchParams }: Props) {
  const { order_id, order_date } = await searchParams;

  return (
    <main className="w-full bg-white flex flex-col">
      {/* Blurred background content */}
      <div className="w-full p-20 relative flex flex-col items-center gap-10">
        <div className="absolute inset-0 bg-zinc-300/50 backdrop-blur-xl z-10" />

        <OrderReceivedModal
          orderId={order_id ?? ''}
          orderDate={order_date ?? new Date().toLocaleDateString('en-GB')}
        />
      </div>
    </main>
  );
}
