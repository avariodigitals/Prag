export default function Loading() {
  return (
    <div className="w-full bg-white flex flex-col animate-pulse">
      <div className="w-full px-4 md:px-20 py-6 bg-stone-50 flex flex-col gap-3">
        <div className="h-3 w-48 bg-stone-200 rounded" />
        <div className="h-8 w-2/3 bg-stone-200 rounded" />
      </div>
      <div className="w-full px-4 md:px-20 py-8 flex flex-col gap-4 max-w-3xl">
        {Array.from({length: 8}).map((_, i) => (
          <div key={i} className={`h-4 bg-stone-100 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}
