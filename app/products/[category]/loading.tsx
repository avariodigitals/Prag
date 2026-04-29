import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

function ProductSkeleton() {
  return (
    <div className="min-w-[300px] flex flex-col gap-4">
      <div className="h-80 rounded-2xl bg-stone-100 animate-pulse" />
      <div className="flex flex-col items-center gap-4 px-2">
        <div className="h-5 w-3/4 rounded bg-zinc-100 animate-pulse" />
        <div className="h-4 w-24 rounded bg-zinc-100 animate-pulse" />
        <div className="flex w-full justify-center gap-3.5">
          <div className="h-11 w-[130px] rounded-full bg-sky-100 animate-pulse" />
          <div className="h-11 w-[110px] rounded-full bg-zinc-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CategoryLoading() {
  return (
    <main className="w-full bg-white flex flex-col">
      <TopBar />
      <NavBar />

      <div className="w-full pt-16 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6 px-4">
        <div className="h-5 w-56 rounded bg-sky-100 animate-pulse" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-64 rounded bg-sky-100 animate-pulse" />
          <div className="h-5 w-[min(531px,80vw)] rounded bg-sky-100 animate-pulse" />
        </div>
      </div>

      <div className="w-full px-4 md:px-20 py-10 bg-white flex flex-col gap-10">
        <div className="flex justify-between items-center gap-4">
          <div className="flex min-w-0 flex-1 gap-3 border-b border-gray-200 overflow-hidden">
            {[120, 150, 130, 160].map((width) => (
              <div
                key={width}
                className="h-12 shrink-0 rounded-t bg-zinc-100 animate-pulse"
                style={{ width }}
              />
            ))}
          </div>
          <div className="h-11 w-36 shrink-0 rounded-lg bg-zinc-100 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
