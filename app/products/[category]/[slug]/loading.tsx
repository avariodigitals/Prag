export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-20 py-3 bg-stone-50">
        <div className="h-3 w-64 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-6 md:py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[620px] h-72 md:h-[551px] bg-stone-100 rounded-2xl shrink-0" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-7 w-3/4 bg-stone-200 rounded" />
          <div className="h-6 w-1/3 bg-stone-200 rounded" />
          <div className="h-4 w-full bg-stone-100 rounded" />
          <div className="h-4 w-5/6 bg-stone-100 rounded" />
          <div className="h-4 w-4/6 bg-stone-100 rounded" />
          <div className="mt-4 h-12 w-40 bg-stone-200 rounded-3xl" />
          <div className="flex gap-4 mt-2">
            <div className="flex-1 h-12 bg-sky-100 rounded-3xl" />
            <div className="flex-1 h-12 bg-stone-200 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
