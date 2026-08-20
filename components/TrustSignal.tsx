import Image from 'next/image';
import type { SiteSettings } from '@/lib/woocommerce';

// PRAG product images — stabilizer, inverter, solar panel.
const PRODUCT_IMAGES = [
  {
    src: 'https://central.prag.global/wp-content/uploads/2026/04/7ee70985fdddba92a39a6e67f80ec4773cbf34fd.png',
    alt: 'PRAG Voltage Stabilizer',
  },
  {
    src: 'https://central.prag.global/wp-content/uploads/2026/04/eebd514c0d3e75e4f32cb8fd691c7b3613fd99d5.png',
    alt: 'PRAG Inverter',
  },
  {
    src: 'https://central.prag.global/wp-content/uploads/2026/04/b5564cf299de3eea9dbe804a547cf74e99bc41a7.png',
    alt: 'PRAG Solar Panel',
  },
];

// Background image — solar technician working on a panel.
const LANDSCAPE_BG =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1600&q=80';

export default function TrustSignal({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.trust_signal_enabled ?? true;
  if (!enabled) return null;

  const bannerHeading = settings?.trust_signal_banner_heading ?? 'Trusted by thousands of homes & businesses across Nigeria';

  return (
    <section className="w-full px-4 md:px-20 py-10 md:py-14 bg-white">
      <div className="w-full max-w-[1280px] mx-auto">
        {/* Banner panel — portrait on mobile, landscape on desktop */}
        <div className="relative overflow-hidden rounded-3xl aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:h-[360px]">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={LANDSCAPE_BG}
              alt="PRAG solar installation"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
          {/* Gradient overlay — top-weighted on mobile (portrait), left-weighted on desktop (landscape) */}
          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(7,14,28,0.82) 0%, rgba(7,14,28,0.55) 40%, rgba(7,14,28,0.15) 65%, rgba(7,14,28,0.0) 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(7,14,28,0.82) 0%, rgba(7,14,28,0.55) 40%, rgba(7,14,28,0.15) 65%, rgba(7,14,28,0.0) 100%)',
            }}
          />

          {/* Content: text top, product images bottom on mobile; text left, images right on desktop */}
          <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between gap-4 px-6 md:px-12 py-6 pt-10 sm:pt-6 md:py-0">
            <div className="max-w-md w-full sm:w-auto flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 className="text-white text-3xl md:text-5xl font-bold font-['Onest'] leading-tight tracking-tight">
                {bannerHeading}
              </h3>
            </div>

            {/* Product images — cluster, raised & bold */}
            <div className="relative flex items-center justify-center w-full sm:w-[380px] md:w-[560px] h-full shrink-0 -mt-4 md:-mt-6">
              {/* Glow behind the cluster */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/4 rounded-full bg-sky-400/30 blur-3xl" aria-hidden="true" />

              {/* Stabilizer — left */}
              <div className="relative w-[38%] aspect-square -mr-8 md:-mr-16 mt-4 z-10">
                <Image
                  src={PRODUCT_IMAGES[0].src}
                  alt={PRODUCT_IMAGES[0].alt}
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
                  sizes="210px"
                />
              </div>

              {/* Inverter — center front, largest */}
              <div className="relative w-[52%] aspect-square z-20">
                <Image
                  src={PRODUCT_IMAGES[1].src}
                  alt={PRODUCT_IMAGES[1].alt}
                  fill
                  className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]"
                  sizes="290px"
                />
              </div>

              {/* Solar panel — right */}
              <div className="relative w-[40%] aspect-square -ml-8 md:-ml-16 mt-2 z-10">
                <Image
                  src={PRODUCT_IMAGES[2].src}
                  alt={PRODUCT_IMAGES[2].alt}
                  fill
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
                  sizes="220px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
