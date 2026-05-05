export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-20 py-6 bg-stone-50">
        <div className="h-8 w-24 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-stone-100 rounded-xl" />
          ))}
        </div>
        <div className="w-full md:w-80 h-64 bg-stone-100 rounded-xl" />
      </div>
    </div>
  );
}
