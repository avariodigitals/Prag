export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-14 pt-10 pb-8 bg-stone-50 flex flex-col items-center gap-4">
        <div className="h-8 w-2/3 bg-stone-200 rounded" />
        <div className="h-4 w-1/2 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-12 flex flex-col gap-8">
        <div className="h-6 w-1/3 bg-stone-200 rounded" />
        <div className="h-4 w-full bg-stone-100 rounded" />
        <div className="h-4 w-5/6 bg-stone-100 rounded" />
        <div className="h-64 w-full bg-stone-100 rounded-3xl" />
      </div>
    </div>
  );
}
