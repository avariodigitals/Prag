import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full bg-white flex flex-col min-h-screen">
      {/* Mobile */}
      <div className="flex md:hidden self-stretch h-[600px] px-4 py-6 flex-col justify-center items-center gap-10 overflow-hidden">
        <span className="w-full text-center text-sky-700 text-8xl font-bold font-['Onest'] leading-[100px]">404</span>
        <h1 className="w-full text-center text-black text-4xl font-bold font-['Onest'] leading-10">Page Not Found</h1>
        <p className="w-full text-center text-stone-500 text-base font-normal font-['Space_Grotesk'] leading-5">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved, deleted, or the URL might be incorrect.
        </p>
        <Link href="/" className="px-8 py-3.5 bg-sky-700 rounded-3xl text-white text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-800 transition-colors">
          Go to Homepage
        </Link>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-1 justify-center items-center px-96 py-20">
        <div className="flex flex-col items-center gap-10 text-center">
          <span className="text-sky-700 text-[180px] font-bold font-['Onest'] leading-none">404</span>
          <h1 className="text-black text-5xl font-bold font-['Onest'] leading-tight">Page Not Found</h1>
          <p className="max-w-xl text-stone-500 text-xl font-normal font-['Space_Grotesk'] leading-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The page may have been moved, deleted, or the URL might be incorrect.
          </p>
          <Link href="/" className="px-8 py-3.5 bg-sky-700 rounded-3xl text-white text-lg font-medium font-['Space_Grotesk'] leading-7 hover:bg-sky-800 transition-colors">
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
