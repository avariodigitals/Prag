'use client';

import Script from 'next/script';
import { resolveSalesIqWidgetCode, stripSalesIqEmbed } from '@/lib/salesiq';
import { Headphones, MessageCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import UnifiedChatLauncher from '@/components/UnifiedChatLauncher';

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
  zohoSalesIqCode?: string;
}

// Default GA4 measurement ID for the shop domain. Used when the admin config
// is unavailable or does not specify one.
const DEFAULT_GA_ID = 'G-K1FJPNG5K9';

interface SiteSettings {
  whatsapp?: string;
}

export default function TrackingLoader({ salesIqEnvironmentCode = '' }: { salesIqEnvironmentCode?: string }) {
  const [cfg, setCfg] = useState<TrackingConfig | null>(null);
  const [cfgResolved, setCfgResolved] = useState(false);
  const [fallbackWhatsapp, setFallbackWhatsapp] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = window.location.hostname;
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<SiteSettings>) : null))
      .then((settings) => {
        if (settings) setFallbackWhatsapp((settings.whatsapp ?? '').trim());
      })
      .catch(() => {});
    // Resolve tracking independently of site settings. A hung request must not
    // prevent the default chat widget from loading.
    fetch(`/api/tracking?host=${encodeURIComponent(host)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })
      .then((r) => (r.ok ? (r.json() as Promise<TrackingConfig>) : null))
      .catch(() => null)
      .then((trackingData) => {
        if (trackingData) setCfg(trackingData);
        // Search Console verification meta — injected client-side because the
        // root layout no longer reads per-request headers (keeps pages static).
        // For GSC HTML-tag verification, prefer the GOOGLE_SITE_VERIFICATION
        // env var, which renders the tag into the static HTML.
        const verification = trackingData?.googleSearchConsoleVerification?.trim();
        if (verification && !document.querySelector('meta[name="google-site-verification"]')) {
          const meta = document.createElement('meta');
          meta.name = 'google-site-verification';
          meta.content = verification;
          document.head.appendChild(meta);
        }
        setCfgResolved(true);
      });
  }, []);

  // No close button in the pop-out — clicking anywhere outside hides it.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onDocPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocPointerDown);
    return () => document.removeEventListener('mousedown', onDocPointerDown);
  }, [isMenuOpen]);

  // Wait for the config before loading GA/GTM so the correct IDs are used.
  // On failure, fall back to the default GA ID rather than losing analytics.
  if (!cfgResolved) return null;

  const gaId = (cfg?.googleAnalyticsId ?? '').trim() || DEFAULT_GA_ID;
  const gtmId = (cfg?.googleTagManagerId ?? '').trim();

  const salesIqCode = resolveSalesIqWidgetCode(salesIqEnvironmentCode, cfg?.zohoSalesIqCode);

  // The root bootstrap runs first; remove pasted copies from custom scripts.
  const customHeadScripts = stripSalesIqEmbed(cfg?.customHeadScripts);
  const customBodyScripts = stripSalesIqEmbed(cfg?.customBodyScripts);
  const customFooterScripts = stripSalesIqEmbed(cfg?.customFooterScripts);

  const configuredWhatsapp = (cfg?.whatsappChatNumber ?? '').trim();
  const globalNumber = (configuredWhatsapp || fallbackWhatsapp).replace(/\D/g, '');
  const isWhatsappEnabled = Boolean(cfg?.whatsappChatEnabled) || (!configuredWhatsapp && Boolean(fallbackWhatsapp));
  const whatsappText = (cfg?.whatsappChatText ?? '').trim() || 'Chat with us on WhatsApp';
  const hasWhatsappNumber = Boolean(globalNumber);
  // Real anchor (not window.open) so browsers/adblockers never treat it as a popup.
  const whatsappHref = `https://wa.me/${globalNumber || '2348032170129'}?text=${encodeURIComponent('Hi PRAG, I need help.')}`;

  // Zoho's own launcher button is hidden by CSS; open its chat from here
  // instead. Different widget builds expose different APIs, so try each and
  // fall back to clicking the (hidden) float element. The script loads async,
  // so retry briefly before giving up.
  function openLiveChat() {
    setIsMenuOpen(false);
    let attempts = 0;
    const tryOpen = () => {
      const salesiq = (window as unknown as {
        $zoho?: {
          salesiq?: {
            floatbutton?: { click?: () => void };
            chatwindow?: { open?: () => void };
          };
        };
      }).$zoho?.salesiq;
      if (typeof salesiq?.floatbutton?.click === 'function') {
        salesiq.floatbutton.click();
        return true;
      }
      if (typeof salesiq?.chatwindow?.open === 'function') {
        salesiq.chatwindow.open();
        return true;
      }
      const el = document.querySelector<HTMLElement>('[data-id="zsalesiq"] .zsiq-float');
      if (el) {
        el.click();
        return true;
      }
      return false;
    };
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryOpen() || attempts >= 12) window.clearInterval(timer);
    }, 250);
  }

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
      </Script>
      {gtmId && (
        <Script id="gtm-loader" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }} />
      )}

      {customHeadScripts && (
        <Script id="custom-head" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: customHeadScripts }} />
      )}

      {cfg?.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${cfg.metaPixelId}');fbq('track','PageView');`,
          }} />
      )}

      {cfg?.tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${cfg.tiktokPixelId}');ttq.page();}(window,document,'ttq');`,
          }} />
      )}

      {customBodyScripts && (
        <Script id="custom-body" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: customBodyScripts }} />
      )}

      {customFooterScripts && (
        <Script id="custom-footer" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: customFooterScripts }} />
      )}

      <Script
        id="zsiqscript"
        strategy="afterInteractive"
        defer
        src={`https://salesiq.zohopublic.com/widget?wc=${encodeURIComponent(salesIqCode)}`}
      />

      <div ref={menuRef} className="hidden chat-launcher-whatsapp fixed z-[80] flex flex-col items-end gap-3">
        {isMenuOpen && (
          <>
            {isWhatsappEnabled && hasWhatsappNumber && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                aria-label={whatsappText}
                title={whatsappText}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#3BEA8A] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.06]"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
                  <path d="M20.52 3.48A11.85 11.85 0 0012.06 0C5.51 0 .19 5.32.19 11.87c0 2.09.54 4.14 1.57 5.95L0 24l6.35-1.67a11.84 11.84 0 005.71 1.46h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.24-6.14-3.41-8.44zm-8.45 18.3h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.22-3.77.99 1.01-3.68-.24-.38A9.8 9.8 0 012.2 11.87c0-5.44 4.42-9.87 9.86-9.87 2.63 0 5.09 1.03 6.95 2.91a9.8 9.8 0 012.86 6.96c0 5.44-4.42 9.87-9.86 9.87zm5.41-7.39c-.3-.15-1.75-.86-2.02-.95-.27-.1-.46-.15-.66.15-.2.3-.76.95-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.91-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.43s1.05 2.82 1.2 3.02c.15.2 2.06 3.14 5 4.4.7.3 1.25.47 1.67.6.7.22 1.34.19 1.84.12.56-.08 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.56-.35z" />
                </svg>
              </a>
            )}

            <button
              type="button"
              onClick={openLiveChat}
              aria-label="Live chat"
              title="Live chat"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.06]"
            >
              <Headphones className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label={isMenuOpen ? 'Cancel' : 'Chat with PRAG — WhatsApp or live chat'}
          aria-expanded={isMenuOpen}
          title={isMenuOpen ? 'Cancel' : 'Chat with PRAG — WhatsApp or live chat'}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#3BEA8A] text-white shadow-lg transition-transform duration-200 hover:scale-[1.06]"
        >
          {isMenuOpen ? (
            <X className="h-7 w-7" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </div>
      <UnifiedChatLauncher
        whatsappEnabled={isWhatsappEnabled && hasWhatsappNumber}
        whatsappNumber={globalNumber}
        whatsappText={whatsappText}
      />
    </>
  );
}
