export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-20 py-6 md:py-10 bg-stone-50 flex flex-col gap-4">
        <div className="h-3 w-32 bg-stone-200 rounded" />
        <div className="h-8 w-48 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-6 md:py-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-20 bg-stone-100 rounded-2xl" />
          ))}
        </div>
        <div className="flex-1 h-96 bg-stone-100 rounded-xl" />
      </div>
    </div>
  );
}
