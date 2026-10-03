import React from 'react';
import { Language, CreatorProfile, SiteUIConfig } from '../types';
import { ShieldCheck, MessageCircle } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageToggle: () => void;
  onOpenOrderModal: () => void;
  onOpenAdminModal: () => void;
  creator: CreatorProfile;
  ordersCount: number;
  uiConfig?: SiteUIConfig;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageToggle,
  onOpenOrderModal,
  onOpenAdminModal,
  creator,
  ordersCount,
  uiConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors">
      {/* Dynamic Announcement Bar if Enabled */}
      {uiConfig?.announcement?.enabled && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 px-4 py-1.5 text-center text-xs font-bold tracking-wide shadow-sm flex items-center justify-center gap-2">
          <span>{lang === 'gu' ? uiConfig.announcement.textGu : uiConfig.announcement.textEn}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Brand Logo / Wordmark */}
        <a href="#" className="flex items-center gap-2.5 group">
          {creator.logoImage ? (
            <img
              src={creator.logoImage}
              alt={creator.studioName}
              className="h-10 w-auto max-w-[150px] object-contain rounded"
            />
          ) : (
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-sm">
              MK
            </span>
          )}
          <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
            {lang === 'gu' ? creator.studioNameGu : creator.studioName}
          </span>
        </a>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a href="#portfolio" className="hover:text-amber-400 transition-colors">
            {lang === 'gu' ? 'કામ / પોર્ટફોલિયો' : 'Portfolio'}
          </a>
          <a href="#video-reels" className="hover:text-amber-400 transition-colors">
            {lang === 'gu' ? 'વિડિઓ રીલ્સ' : 'Video Reels'}
          </a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">
            {lang === 'gu' ? 'ભાવ પત્રક' : 'Price Plans'}
          </a>
          <a href="#reviews" className="hover:text-amber-400 transition-colors">
            {lang === 'gu' ? 'ગ્રાહકોના રીવ્યુ' : 'Reviews'}
          </a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">
            {lang === 'gu' ? 'પ્રશ્નોત્તરી (FAQ)' : 'FAQ'}
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={onLanguageToggle}
            type="button"
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
            title="Switch Language"
          >
            {lang === 'gu' ? 'English' : 'ગુજરાતી'}
          </button>

          {/* Dedicated Prominent Admin Panel Button */}
          <button
            onClick={onOpenAdminModal}
            type="button"
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 transition-all cursor-pointer whitespace-nowrap"
            title={lang === 'gu' ? 'એડમિન પેનલ' : 'Admin Panel'}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'gu' ? 'એડમિન પેનલ' : 'Admin Panel'}</span>
            {ordersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-neutral-950">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenOrderModal}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-neutral-950" />
            <span>{lang === 'gu' ? 'ઓર્ડર કરો' : 'Order Now'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
