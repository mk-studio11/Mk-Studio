import React from 'react';
import { CreatorProfile, Language } from '../types';
import { Phone, MessageCircle, Mail, Instagram, MapPin } from 'lucide-react';

interface FooterProps {
  creator: CreatorProfile;
  lang: Language;
  onOpenOrderModal: () => void;
  onOpenAdminModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  creator,
  lang,
  onOpenOrderModal,
  onOpenAdminModal,
}) => {
  const cleanPhone = creator.whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Col 1: Studio info */}
          <div className="md:col-span-5">
            <h3 className="text-xl font-bold text-white mb-3">
              {lang === 'gu' ? creator.studioNameGu : creator.studioName}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-sm">
              {lang === 'gu' ? creator.taglineGu : creator.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{creator.city}</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="md:col-span-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'gu' ? 'ઝડપી લિંક્સ' : 'Quick Navigation'}
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'પોસ્ટર ડિઝાઇન સેમ્પલ્સ' : 'Poster Portfolio'}
                </a>
              </li>
              <li>
                <a href="#video-reels" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'ઇન્સ્ટા રીલ્સ & શોર્ટ્સ' : 'Video Reel Showcase'}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'ભાવ પત્રક & પેકેજ' : 'Pricing Plans'}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'ગ્રાહકોના મંતવ્યો' : 'Client Feedback'}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  {lang === 'gu' ? 'પ્રશ્નોત્તરી (FAQ)' : 'FAQ & Turnaround'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Connect & WhatsApp */}
          <div className="md:col-span-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {lang === 'gu' ? 'સીધો સંપર્ક કરો' : 'Direct Contact'}
            </div>
            <div className="space-y-3 text-xs mb-6">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {creator.phone}</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{lang === 'gu' ? 'કોલ:' : 'Call:'} {creator.phone}</span>
              </a>

              <a
                href={`mailto:${creator.email}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{creator.email}</span>
              </a>

              <a
                href={`https://instagram.com/${creator.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@{creator.instagram}</span>
              </a>
            </div>

            <button
              onClick={onOpenOrderModal}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors cursor-pointer text-center"
            >
              {lang === 'gu' ? 'નવો ઓર્ડર બુક કરો' : 'Start New Project'}
            </button>
          </div>

        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {creator.studioName}. {lang === 'gu' ? 'સર્વ હક સુરક્ષિત.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-3">
            <span>{lang === 'gu' ? 'ગુજરાત, ભારત' : 'Gujarat, India'}</span>
            <span aria-hidden="true">·</span>
            {onOpenAdminModal && (
              <>
                <button
                  onClick={onOpenAdminModal}
                  type="button"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  🔐 {lang === 'gu' ? 'એડમિન પેનલ લોગીન' : 'Admin Panel Login'}
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{lang === 'gu' ? 'Photoshop · Premiere Pro' : 'Adobe Suite & DaVinci'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
