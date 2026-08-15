import Link from 'next/link';
import type { SiteSettings } from '@/lib/woocommerce';

const FB = {
  title: 'Not Sure What to Buy?',
  description: 'Tell us what you want to power and we\'ll help you find the right PRAG setup.',
  cta: 'Use Power Calculator',
  link: '/power-calculator',
  whatsappText: 'Ask PRAG on WhatsApp',
  whatsappLink: 'https://wa.me/2348032170129',
  image: '',
};

const WHATSAPP_ICON = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CALCULATOR_ICON = (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10" />
    <line x1="12" y1="10" x2="12" y2="10" />
    <line x1="16" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="8" y2="14" />
    <line x1="12" y1="14" x2="12" y2="14" />
    <line x1="16" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="8" y2="18" />
    <line x1="12" y1="18" x2="12" y2="18" />
    <line x1="16" y1="18" x2="16" y2="18" />
  </svg>
);

interface BannerItem {
  image: string;
  link: string;
  enabled: boolean;
}

export default function BrandBanner({ settings }: { settings?: SiteSettings }) {
  const enabled = settings?.brand_banner_enabled ?? true;
  if (!enabled) return null;

  const mode = settings?.brand_banner_mode ?? 'text';
  const showTextBanner = mode === 'text';

  const title = settings?.brand_banner_title || FB.title;
  const description = settings?.brand_banner_description || FB.description;
  const cta = settings?.brand_banner_cta || FB.cta;
  const link = settings?.brand_banner_link || FB.link;
  const whatsappText = settings?.brand_banner_whatsapp_text || FB.whatsappText;
  const image = settings?.brand_banner_image || FB.image;
  const whatsappLink =
    settings?.socials?.whatsapp ||
    (settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, '')}` : FB.whatsappLink);

  const extraBanners: BannerItem[] = (settings?.brand_banners || []).filter((b) => b.enabled !== false && b.image);

  return (
    <section className="w-full py-10 md:py-14 flex flex-col justify-center items-center gap-10 md:gap-14">
      {/* Main text banner — only when mode is 'text' */}
      {showTextBanner && (
      <div
        className="relative w-full overflow-hidden rounded-none md:rounded-3xl min-h-[380px] sm:min-h-[420px] md:min-h-[460px] flex items-center"
        style={image ? { backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundColor: '#0b1220' } : { background: 'linear-gradient(135deg, #0c1a33 0%, #0f2747 45%, #103a5e 100%)' }}
      >
        {/* Readability overlay — left-weighted so text stays clean over any background */}
        <div
          className="absolute inset-0"
          style={{
            background: image
              ? 'linear-gradient(90deg, rgba(7,14,28,0.86) 0%, rgba(7,14,28,0.62) 42%, rgba(7,14,28,0.18) 100%)'
              : 'linear-gradient(90deg, rgba(7,14,28,0.30) 0%, rgba(7,14,28,0.10) 60%, rgba(7,14,28,0) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg, rgba(7,14,28,0.30) 0%, rgba(7,14,28,0.62) 60%, rgba(7,14,28,0.82) 100%)' }} aria-hidden="true" />

        <div className="relative z-10 w-full px-5 py-8 sm:px-8 sm:py-10 md:px-14 md:py-16 flex flex-col items-start gap-4 sm:gap-5 md:gap-6 text-left">
          <h2 className="max-w-[640px] text-white text-2xl sm:text-3xl md:text-[52px] font-bold font-['Onest'] leading-[1.05] sm:leading-[1.08]">
            {title}
          </h2>

          <p className="max-w-[560px] text-white/85 text-base md:text-xl font-normal font-['Montserrat'] leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3 md:gap-4 mt-1">
            <Link
              href={link}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 bg-white rounded-full hover:bg-sky-50 transition-all hover:scale-[1.03]"
            >
              {CALCULATOR_ICON}
              <span className="text-sky-700 text-sm sm:text-base md:text-lg font-semibold font-['Montserrat'] whitespace-nowrap">
                {cta}
              </span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 bg-[#25D366] rounded-full hover:bg-[#1ebe5d] transition-all hover:scale-[1.03]"
            >
              {WHATSAPP_ICON}
              <span className="text-white text-sm sm:text-base md:text-lg font-semibold font-['Montserrat'] whitespace-nowrap">
                {whatsappText}
              </span>
            </a>
          </div>
        </div>
      </div>
      )}

      {/* Additional image-only banners — full width, responsive */}
      {extraBanners.length > 0 && (
        <div className="w-full flex flex-col gap-10 md:gap-14">
          {extraBanners.map((banner, i) => {
            const inner = (
              <div className="relative w-full overflow-hidden rounded-none md:rounded-3xl bg-slate-200">
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-auto block object-cover"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            );
            return (
              <div key={`banner-${i}`} className="w-full">
                {banner.link ? (
                  <Link href={banner.link} className="block w-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
