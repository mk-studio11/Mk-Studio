import React from 'react';
import { CreatorProfile, Language } from '../types';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';

interface FloatingActionsProps {
  creator: CreatorProfile;
  lang: Language;
  onOpenOrderModal: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  creator,
  lang,
  onOpenOrderModal,
}) => {
  const cleanPhone = creator.whatsapp.replace(/[^0-9]/g, '');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultMsg =
    lang === 'gu'
      ? 'નમસ્તે મોહિતભાઈ, મારે પોસ્ટર / વિડિઓ એડિટિંગ કરાવવું છે. વિગતો જણાવશો?'
      : 'Hello! I am looking for graphic design / video editing services. Please share details.';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        type="button"
        className="hidden sm:flex w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 items-center justify-center transition-all shadow-md cursor-pointer"
        title="Scroll to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Direct Call Button */}
      <a
        href={`tel:${cleanPhone}`}
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold shadow-lg hover:border-neutral-500 transition-all"
        title={lang === 'gu' ? 'કોલ કરો' : 'Call'}
      >
        <Phone className="w-3.5 h-3.5 text-amber-400" />
        <span>{lang === 'gu' ? 'કોલ કરો' : 'Call'}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:scale-103 transition-all cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 fill-neutral-950" />
        <span className="hidden xs:inline">{lang === 'gu' ? 'WhatsApp ચેટ' : 'Chat on WhatsApp'}</span>
      </a>
    </div>
  );
};
