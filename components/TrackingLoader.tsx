'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface TrackingConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsoleVerification?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
  whatsappChatEnabled?: boolean;
  whatsappChatNumber?: string;
  whatsappChatText?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
  customFooterScripts?: string;
}

interface SiteSettings {
  whatsapp?: string;
}

const WHATSAPP_QUICK_ACTIONS = [
  { label: "General Enquiries", subtitle: "Ask anything", message: "Hi, I have a general enquiry about your products." },
  { label: "Sales", subtitle: "Pricing & product advice", message: "Hi, I am interested in purchasing from PRAG." },
  { label: "Support", subtitle: "Technical help", message: "Hello, I need support from PRAG." },
  { label: "Delivery", subtitle: "Orders & logistics", message: "Hi, I need to inquire about delivery options." },
];

export default function TrackingLoader() {
  const [cfg, setCfg] = useState<TrackingConfig | null>(null);
  const [fallbackWhatsapp, setFallbackWhatsapp] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    fetch(`/api/tracking?host=${encodeURIComponent(host)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<TrackingConfig>) : null))
      .then((data) => data && setCfg(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<SiteSettings>) : null))
      .then((data) => setFallbackWhatsapp((data?.whatsapp ?? '').trim()))
      .catch(() => {});
  }, []);

  if (!cfg) return null;

  const configuredWhatsapp = (cfg.whatsappChatNumber ?? '').trim();
  const whatsappNumber = (configuredWhatsapp || fallbackWhatsapp).replace(/\D/g, '');
  const isWhatsappEnabled = Boolean(cfg.whatsappChatEnabled) || (!configuredWhatsapp && Boolean(fallbackWhatsapp));
  const whatsappText = (cfg.whatsappChatText ?? '').trim() || 'Chat with us on WhatsApp';
  const hasWhatsappNumber = Boolean(whatsappNumber);

  function openWhatsApp(message: string) {
    if (!whatsappNumber) return;
    // Use wa.me shortlink which is more reliable for mobile apps and prefilled text
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsMenuOpen(false);
  }

  return (
    <>
      {cfg.customHeadScripts && (
        <Script id="custom-head" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: cfg.customHeadScripts }} />
      )}

      {cfg.googleTagManagerId && (
        <Script id="gtm" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.googleTagManagerId}');`,
          }} />
      )}

      {cfg.googleAnalyticsId && cfg.googleAnalyticsId !== 'G-K1FJPNG5K9' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${cfg.googleAnalyticsId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${cfg.googleAnalyticsId}');`,
            }} />
        </>
      )}

      {cfg.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${cfg.metaPixelId}');fbq('track','PageView');`,
          }} />
      )}

      {cfg.tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${cfg.tiktokPixelId}');ttq.page();}(window,document,'ttq');`,
          }} />
      )}

      {cfg.customBodyScripts && (
        <Script id="custom-body" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: cfg.customBodyScripts }} />
      )}

      {cfg.customFooterScripts && (
        <Script id="custom-footer" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: cfg.customFooterScripts }} />
      )}

      {isWhatsappEnabled && hasWhatsappNumber && (
        <div className="fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3">
          {isMenuOpen && (
            <div className="w-[280px] overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-2xl backdrop-blur">
              <div className="bg-gradient-to-br from-[#25D366] to-[#12B76A] px-4 py-3 text-white flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold font-['Montserrat'] truncate">Chat with PRAG</p>
                  <p className="mt-0.5 text-xs text-white/85 font-['Montserrat'] line-clamp-2">We typically reply within a few minutes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="shrink-0 rounded-full p-1.5 hover:bg-white/10 transition-colors text-white"
                  aria-label="Close WhatsApp chat widget"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-3 pt-3 pb-3">
                <p className="px-1 pb-2 text-[11px] font-semibold tracking-wide uppercase text-zinc-500 font-['Montserrat']">Choose an option</p>
                <div className="flex flex-col gap-2">
                  {WHATSAPP_QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="group rounded-xl border border-zinc-200/70 bg-white px-3 py-2 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/60"
                      onClick={() => openWhatsApp(action.message)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 font-['Montserrat'] truncate">{action.label}</p>
                        {action.subtitle && <p className="mt-0.5 text-xs text-zinc-600 font-['Montserrat'] truncate">{action.subtitle}</p>}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openWhatsApp("Hi PRAG, I need help.")}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#25D366] to-[#12B76A] text-white px-4 py-2.5 text-sm font-semibold shadow-lg shadow-emerald-200/50 transition-transform duration-200 hover:scale-[1.02] font-['Montserrat']"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
                    <path d="M20.52 3.48A11.85 11.85 0 0012.06 0C5.51 0 .19 5.32.19 11.87c0 2.09.54 4.14 1.57 5.95L0 24l6.35-1.67a11.84 11.84 0 005.71 1.46h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.24-6.14-3.41-8.44zm-8.45 18.3h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.22-3.77.99 1.01-3.68-.24-.38A9.8 9.8 0 012.2 11.87c0-5.44 4.42-9.87 9.86-9.87 2.63 0 5.09 1.03 6.95 2.91a9.8 9.8 0 012.86 6.96c0 5.44-4.42 9.87-9.86 9.87zm5.41-7.39c-.3-.15-1.75-.86-2.02-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.91-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.43s1.05 2.82 1.2 3.02c.15.2 2.06 3.14 5 4.4.7.3 1.25.47 1.67.6.7.22 1.34.19 1.84.12.56-.08 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.56-.35z" />
                  </svg>
                  Start WhatsApp chat
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            aria-label={whatsappText}
            aria-expanded={isMenuOpen}
            title={whatsappText}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#3BEA8A] text-white shadow-lg transition-transform duration-200 hover:scale-[1.06]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current">
              <path d="M20.52 3.48A11.85 11.85 0 0012.06 0C5.51 0 .19 5.32.19 11.87c0 2.09.54 4.14 1.57 5.95L0 24l6.35-1.67a11.84 11.84 0 005.71 1.46h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.24-6.14-3.41-8.44zm-8.45 18.3h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.22-3.77.99 1.01-3.68-.24-.38A9.8 9.8 0 012.2 11.87c0-5.44 4.42-9.87 9.86-9.87 2.63 0 5.09 1.03 6.95 2.91a9.8 9.8 0 012.86 6.96c0 5.44-4.42 9.87-9.86 9.87zm5.41-7.39c-.3-.15-1.75-.86-2.02-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.91-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.43s1.05 2.82 1.2 3.02c.15.2 2.06 3.14 5 4.4.7.3 1.25.47 1.67.6.7.22 1.34.19 1.84.12.56-.08 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.56-.35z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
