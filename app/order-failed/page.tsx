import OrderFailedModal from '@/components/OrderFailedModal';

interface Props {
  searchParams: Promise<{ order_id?: string; retry?: string }>;
}

export const metadata = { title: 'Order Failed – PRAG' };

export default async function OrderFailedPage({ searchParams }: Props) {
  const { order_id, retry } = await searchParams;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <div className="w-full min-h-screen px-4 py-8 md:p-20 relative flex flex-col items-center justify-center gap-10">
        <div className="absolute inset-0 bg-zinc-300/50 backdrop-blur-xl z-10" />

        <OrderFailedModal orderId={order_id ?? ''} retryQuery={retry ?? ''} />
      </div>
    </main>
  );
}
