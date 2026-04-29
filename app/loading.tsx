export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <svg
          className="w-12 h-12 text-sky-700 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    </div>
  );
}
