'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface TrackingConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsoleVerification?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
  customHeadScripts?: string;
  customBodyScripts?: string;
  customFooterScripts?: string;
}

export default function TrackingLoader() {
  const [cfg, setCfg] = useState<TrackingConfig | null>(null);

  useEffect(() => {
    const host = window.location.hostname;
    fetch(`/api/tracking?host=${encodeURIComponent(host)}`)
      .then((r) => (r.ok ? (r.json() as Promise<TrackingConfig>) : null))
      .then((data) => data && setCfg(data))
      .catch(() => {});
  }, []);

  if (!cfg) return null;

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
    </>
  );
}
