'use client';

import { useEffect, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/lib/woocommerce';

interface Props {
  settings?: SiteSettings;
  whatsappNumber?: string;
}

export default function SlideOutChat({ settings, whatsappNumber }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const enabled = settings?.slideout_chat_enabled ?? true;
  const title = settings?.slideout_chat_title || 'Not sure what to pick?';
  const subtitle = settings?.slideout_chat_subtitle || 'Chat with us';
  const message = settings?.slideout_chat_message || 'Hi PRAG team, I was browsing your product pages and need help choosing the right product. Can you assist?';

  useEffect(() => {
    if (dismissed || !enabled) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight > 0 && scrolled / pageHeight > 0.3) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed, enabled]);

  if (dismissed || !enabled) return null;

  const waNumber = (whatsappNumber || '').replace(/[^\d]/g, '');
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/2348032170129?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed right-0 bottom-24 z-40 transition-transform duration-500 ease-out ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-stretch">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] transition-colors pl-4 pr-5 py-4 rounded-l-2xl shadow-lg shadow-black/10 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold font-['Onest'] leading-tight whitespace-nowrap">
              {title}
            </span>
            <span className="text-white/90 text-xs font-medium font-['Onest'] leading-tight whitespace-nowrap">
              {subtitle}
            </span>
          </div>
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="bg-[#25D366] hover:bg-[#1ebe5d] transition-colors w-7 flex items-center justify-center rounded-l-none border-l border-white/20"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>
    </div>
  );
}
