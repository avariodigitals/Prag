'use client';

import { ArrowLeft, ChevronRight, Headphones, MessagesSquare, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Panel = 'options' | 'whatsapp';

interface Props {
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappText: string;
}

function withPrefill(link: string, message: string) {
  const separator = link.includes('?') ? '&' : '?';
  return `${link}${separator}text=${encodeURIComponent(message.trim())}`;
}

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.52 3.48A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413zM12.05 21.78h-.005a9.824 9.824 0 01-5.01-1.38l-.36-.214-3.741.982.999-3.648-.235-.374a9.858 9.858 0 01-1.51-5.254c.003-5.45 4.437-9.884 9.893-9.884a9.825 9.825 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.912 9.88zm5.44-7.433c-.297-.149-1.758-.868-2.031-.967-.273-.099-.472-.149-.67.149-.198.297-.769.967-.942 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.917-2.206-.242-.58-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}

export default function UnifiedChatLauncher({ whatsappEnabled, whatsappNumber, whatsappText }: Props) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>('options');
  const menuRef = useRef<HTMLDivElement>(null);
  const number = whatsappNumber.replace(/\D/g, '') || '2348032170129';
  const canUseWhatsApp = whatsappEnabled && Boolean(whatsappNumber);
  const options = [
    { label: 'General Enquiries', subtitle: 'Ask anything', message: 'Hi PRAG, I have a general enquiry.', number },
    { label: 'Sales', subtitle: 'Pricing & product advice', message: 'Hi PRAG Sales, I want to buy and need help.', number: '2347036463977' },
    { label: 'Support', subtitle: 'Technical help', message: 'Hi PRAG Support, I need technical assistance.', number: '2348111043239' },
    { label: 'Delivery', subtitle: 'Orders & logistics', message: 'Hi PRAG, I need help with delivery / logistics.', number: '2347036463977' },
  ];

  useEffect(() => {
    if (!open) return;
    const onDocumentPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPanel('options');
      }
    };
    document.addEventListener('mousedown', onDocumentPointerDown);
    return () => document.removeEventListener('mousedown', onDocumentPointerDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setPanel('options');
  }

  function openWhatsApp(destination: string, message: string) {
    window.open(withPrefill(`https://wa.me/${destination}`, message), '_blank', 'noopener,noreferrer');
    closeMenu();
  }

  function openLiveChat() {
    closeMenu();
    let attempts = 0;
    const tryOpen = () => {
      const salesiq = (window as unknown as {
        $zoho?: { salesiq?: { floatbutton?: { click?: () => void }; chatwindow?: { open?: () => void } } };
      }).$zoho?.salesiq;
      if (typeof salesiq?.floatbutton?.click === 'function') {
        salesiq.floatbutton.click();
        return true;
      }
      if (typeof salesiq?.chatwindow?.open === 'function') {
        salesiq.chatwindow.open();
        return true;
      }
      const launcher = document.querySelector<HTMLElement>('[data-id="zsalesiq"] .zsiq-float');
      if (launcher) {
        launcher.click();
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
    <div ref={menuRef} className="chat-launcher-whatsapp fixed z-[81] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/20">
          {panel === 'options' ? (
            <div className="p-2">
              <div className="px-3 pb-2 pt-1">
                <p className="text-sm font-semibold text-zinc-900">How can we help?</p>
                <p className="mt-0.5 text-xs text-zinc-500">Choose a channel to start a conversation.</p>
              </div>
              {canUseWhatsApp && (
                <button type="button" onClick={() => setPanel('whatsapp')} className="flex w-full items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3 text-left transition-colors hover:bg-emerald-100">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"><WhatsAppIcon /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-zinc-900">WhatsApp</span><span className="mt-0.5 block text-xs text-zinc-600">{whatsappText || 'Message our team on WhatsApp'}</span></span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                </button>
              )}
              <button type="button" onClick={openLiveChat} className={`${canUseWhatsApp ? 'mt-2 ' : ''}flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-left transition-colors hover:bg-blue-100`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Headphones className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-zinc-900">Live chat</span><span className="mt-0.5 block text-xs text-zinc-600">Chat with us on our website</span></span>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3 bg-gradient-to-br from-[#25D366] to-[#12B76A] px-4 py-3 text-white">
                <button type="button" onClick={() => setPanel('options')} className="mt-0.5 rounded-full p-1 hover:bg-white/10" aria-label="Back to chat options"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <div className="min-w-0 flex-1"><p className="truncate text-base font-semibold">{whatsappText || 'Chat with us on WhatsApp'}</p><p className="mt-0.5 text-xs text-white/85">We typically reply within a few minutes.</p></div>
                <button type="button" onClick={closeMenu} className="rounded-full p-1 hover:bg-white/10" aria-label="Close chat options"><X className="h-4 w-4" aria-hidden="true" /></button>
              </div>
              <div className="p-3">
                <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Choose an option</p>
                <div className="flex flex-col gap-2">
                  {options.map((option) => (
                    <button key={option.label} type="button" onClick={() => openWhatsApp(option.number, option.message)} className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/60">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><WhatsAppIcon className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-zinc-900">{option.label}</span><span className="mt-0.5 block truncate text-xs text-zinc-600">{option.subtitle}</span></span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <button type="button" onClick={() => { setOpen((value) => !value); setPanel('options'); }} aria-label={open ? 'Close chat options' : 'Open chat options'} aria-expanded={open} title={open ? 'Close chat options' : 'Chat with us'} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#3BEA8A] text-white shadow-lg transition-transform duration-200 hover:scale-[1.06]">
        {open ? <X className="h-7 w-7" aria-hidden="true" /> : <MessagesSquare className="h-7 w-7" aria-hidden="true" />}
      </button>
    </div>
  );
}
