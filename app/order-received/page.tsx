import OrderReceivedModal from '@/components/OrderReceivedModal';

interface Props {
  searchParams: Promise<{
    order_id?: string;
    order_date?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }>;
}

export const metadata = { title: 'Order Received – PRAG' };

export default async function OrderReceivedPage({ searchParams }: Props) {
  const { order_id, order_date, first_name, last_name, email, phone } = await searchParams;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      {/* Blurred background content */}
      <div className="w-full min-h-screen px-4 py-8 md:p-20 relative flex flex-col items-center justify-center gap-10">
        <div className="absolute inset-0 bg-zinc-300/50 backdrop-blur-xl z-10" />

        <OrderReceivedModal
          orderId={order_id ?? ''}
          orderDate={order_date ?? new Date().toLocaleDateString('en-GB')}
          firstName={first_name ?? ''}
          lastName={last_name ?? ''}
          email={email ?? ''}
          phone={phone ?? ''}
        />
      </div>
    </main>
  );
}
