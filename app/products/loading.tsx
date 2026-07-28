export default function Loading() {
  return (
    <main className="w-full bg-white flex flex-col">
      {/* Hero skeleton */}
      <div className="w-full px-4 md:px-14 pt-10 md:pt-20 pb-8 md:pb-10 bg-stone-50 flex flex-col items-center gap-4 md:gap-6">
        <div className="h-12 w-64 bg-stone-200 rounded animate-pulse" />
        <div className="h-5 w-96 bg-stone-200 rounded animate-pulse" />
      </div>

      {/* Category pills skeleton */}
      <div className="w-full px-6 md:px-20 py-8">
        <div className="flex items-center gap-3 pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-stone-100 rounded-full animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="w-full px-6 md:px-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full h-[300px] md:h-[330px] bg-stone-100 rounded-lg animate-pulse" />
              <div className="h-5 w-3/4 bg-stone-200 rounded animate-pulse mx-auto" />
              <div className="h-5 w-1/2 bg-stone-200 rounded animate-pulse mx-auto" />
              <div className="h-9 w-28 bg-stone-200 rounded-full animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
