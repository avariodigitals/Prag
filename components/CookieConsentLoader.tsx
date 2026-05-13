'use client';

import { useEffect } from 'react';

const CONSENT_SCRIPT_SRC = 'https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js';

const CONSENT_CONFIG = {
  notice_banner_type: 'simple',
  consent_type: 'express',
  palette: 'light',
  language: 'en',
  page_load_consent_levels: ['strictly-necessary'],
  notice_banner_reject_button_hide: false,
  preferences_center_close_button_hide: false,
  page_refresh_confirmation_buttons: false,
  website_name: 'PRAG Store',
  website_privacy_policy_url: 'https://shop.prag.global/privacy',
};

declare global {
  interface Window {
    cookieconsent?: {
      run: (config: typeof CONSENT_CONFIG) => void;
      openPreferencesCenter?: () => void;
      showPreferences?: () => void;
      showSettings?: () => void;
      show?: () => void;
    };
    __pragCookieConsentInitialized?: boolean;
  }
}

export default function CookieConsentLoader() {
  useEffect(() => {
    const injectOverrides = () => {
      const existing = document.getElementById('prag-cookie-consent-overrides');
      if (existing) return;

      const style = document.createElement('style');
      style.id = 'prag-cookie-consent-overrides';
      style.textContent = `
        #termsfeed-com---nb.termsfeed-com---is-visible,
        .termsfeed-com---nb.termsfeed-com---is-visible,
        .termsfeed-com---nb-simple.termsfeed-com---is-visible {
          position: fixed !important;
          inset: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          z-index: 2147483647 !important;
          padding: 1rem !important;
        }

        #termsfeed-com---nb.termsfeed-com---is-hidden,
        .termsfeed-com---nb.termsfeed-com---is-hidden,
        .termsfeed-com---nb-simple.termsfeed-com---is-hidden {
          display: none !important;
        }

        .termsfeed-com---nb-simple .cc-nb-main-container,
        #termsfeed-com---nb .cc-nb-main-container,
        #termsfeed-com---nb > div:first-child {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: min(92vw, 720px) !important;
          max-height: calc(100vh - 2rem) !important;
          overflow: auto !important;
          margin: 0 !important;
          border-radius: 18px !important;
          border: 1px solid #d1d5db !important;
          box-shadow: 0 24px 60px rgba(2, 6, 23, 0.35) !important;
          background: #ffffff !important;
        }

        .termsfeed-com---nb-simple .cc-nb-buttons-container {
          display: flex !important;
          justify-content: center !important;
          gap: 0.75rem !important;
          flex-wrap: wrap !important;
        }

        .termsfeed-com---nb-simple .cc-nb-okagree,
        .termsfeed-com---pc-overlay .cc-cp-foot-save,
        .termsfeed-com---pc-overlay .cc-cp-foot-button,
        #termsfeed-com---preferences-center .cc-cp-foot-save,
        #termsfeed-com---preferences-center .cc-cp-foot-button {
          border-radius: 9999px !important;
          border: 1px solid #0369a1 !important;
          background: #0369a1 !important;
          color: #ffffff !important;
          font-weight: 600 !important;
        }

        .termsfeed-com---nb-simple .cc-nb-reject {
          border-radius: 9999px !important;
          border: 1px solid #0369a1 !important;
          background: #ffffff !important;
          color: #0369a1 !important;
          font-weight: 600 !important;
        }

        .termsfeed-com---nb-simple .cc-nb-changep,
        .termsfeed-com---pc-overlay .cc-cp-body-tabs-item-link,
        .termsfeed-com---pc-overlay .cc-cp-foot-byline a,
        #termsfeed-com---preferences-center .cc-cp-body-tabs-item-link,
        #termsfeed-com---preferences-center .cc-cp-foot-byline a {
          color: #0369a1 !important;
        }

        #termsfeed-com---preferences-center.termsfeed-com---pc-overlay {
          position: fixed !important;
          inset: 0 !important;
          padding: 1rem !important;
          background: transparent !important;
          z-index: 2147483647 !important;
        }

        #termsfeed-com---preferences-center .termsfeed-com---pc-dialog {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: min(94vw, 820px) !important;
          max-width: 820px !important;
          max-height: calc(100vh - 2rem) !important;
          margin: 0 !important;
          border-radius: 18px !important;
          overflow: hidden !important;
          background: #ffffff !important;
          box-shadow: 0 24px 60px rgba(2, 6, 23, 0.35) !important;
        }

        #termsfeed-com---preferences-center .cc-pc-head,
        #termsfeed-com---preferences-center .cc-cp-body,
        #termsfeed-com---preferences-center .cc-cp-foot {
          background: #ffffff !important;
        }

        #termsfeed-com---preferences-center .cc-cp-body {
          max-height: calc(100vh - 14rem) !important;
          overflow: auto !important;
        }

        @media (max-width: 640px) {
          #termsfeed-com---preferences-center.termsfeed-com---pc-overlay {
            padding: 0.5rem !important;
          }

          #termsfeed-com---preferences-center .termsfeed-com---pc-dialog {
            width: calc(100vw - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
            border-radius: 14px !important;
          }

          #termsfeed-com---preferences-center .cc-cp-body {
            max-height: calc(100vh - 12rem) !important;
          }

          .termsfeed-com---nb-simple .cc-nb-main-container,
          #termsfeed-com---nb .cc-nb-main-container,
          #termsfeed-com---nb > div:first-child {
            width: calc(100vw - 1rem) !important;
            max-height: calc(100vh - 1rem) !important;
            border-radius: 14px !important;
          }
        }

        .termsfeed-com---pc-overlay .cc-cp-body-tabs-item-link[aria-selected='true'],
        .termsfeed-com---pc-overlay .cc-cp-body-tabs-item-link:hover,
        #termsfeed-com---preferences-center .cc-cp-body-tabs-item-link[aria-selected='true'],
        #termsfeed-com---preferences-center .cc-cp-body-tabs-item-link:hover {
          color: #0b4f79 !important;
        }

        .termsfeed-com---pc-overlay .cc-custom-checkbox input,
        #termsfeed-com---preferences-center .cc-custom-checkbox input {
          accent-color: #0369a1 !important;
        }
      `;

      document.head.appendChild(style);
    };

    injectOverrides();

    const openPreferencesCenter = () => {
      if (!window.cookieconsent) return false;

      if (typeof window.cookieconsent.openPreferencesCenter === 'function') {
        window.cookieconsent.openPreferencesCenter();
        return true;
      }
      if (typeof window.cookieconsent.showPreferences === 'function') {
        window.cookieconsent.showPreferences();
        return true;
      }
      if (typeof window.cookieconsent.showSettings === 'function') {
        window.cookieconsent.showSettings();
        return true;
      }
      if (typeof window.cookieconsent.show === 'function') {
        window.cookieconsent.show();
        return true;
      }

      return false;
    };

    const runConsent = () => {
      if (window.__pragCookieConsentInitialized) return true;
      if (!window.cookieconsent || typeof window.cookieconsent.run !== 'function') return false;

      window.cookieconsent.run(CONSENT_CONFIG);
      window.__pragCookieConsentInitialized = true;
      return true;
    };

    const bindPreferencesLink = () => {
      const trigger = document.getElementById('open_preferences_center');
      if (!trigger || trigger.getAttribute('data-prag-bound') === 'true') return;

      trigger.setAttribute('data-prag-bound', 'true');
      trigger.addEventListener('click', (event) => {
        event.preventDefault();

        if (!openPreferencesCenter()) {
          window.__pragCookieConsentInitialized = false;
          runConsent();
          openPreferencesCenter();
        }
      });
    };

    bindPreferencesLink();

    if (runConsent()) return;

    let script = document.querySelector('script[data-prag-cookie-consent="true"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = CONSENT_SCRIPT_SRC;
      script.async = true;
      script.charset = 'UTF-8';
      script.dataset.pragCookieConsent = 'true';
      document.head.appendChild(script);
    }

    const onLoad = () => {
      injectOverrides();
      runConsent();
      bindPreferencesLink();
    };

    script.addEventListener('load', onLoad);

    let attempts = 0;
    const maxAttempts = 60;
    const interval = window.setInterval(() => {
      attempts += 1;
      injectOverrides();
      bindPreferencesLink();
      if (runConsent() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => {
      script?.removeEventListener('load', onLoad);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
