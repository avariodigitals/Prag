export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-20 py-6 bg-stone-50">
        <div className="h-8 w-48 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-8 grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-56 bg-stone-100 rounded-xl" />
            <div className="h-4 w-3/4 bg-stone-200 rounded" />
            <div className="h-4 w-1/2 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
