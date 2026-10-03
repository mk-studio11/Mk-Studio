import React, { useEffect } from 'react';
import { PortfolioItem, Language } from '../types';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import { X, PlusCircle, CheckCircle2, Film, Image as ImageIcon } from 'lucide-react';

interface MediaLightboxModalProps {
  item: PortfolioItem | null;
  lang: Language;
  onClose: () => void;
  onOrderStyle: (item: PortfolioItem) => void;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  item,
  lang,
  onClose,
  onOrderStyle,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Media Preview */}
        <div className="md:w-1/2 bg-neutral-950 flex items-center justify-center relative min-h-[320px]">
          {item.category === 'video' && item.videoUrl ? (
            <div className="w-full h-full min-h-[320px] max-h-[60vh] md:max-h-[75vh] flex items-center justify-center">
              <UniversalVideoPlayer
                videoUrl={item.videoUrl}
                posterImage={item.image}
                title={item.title}
                className="w-full h-full min-h-[320px]"
                autoPlay={true}
                controls={true}
              />
            </div>
          ) : (
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[60vh] md:max-h-[75vh] object-contain"
            />
          )}

          <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[11px] text-neutral-300 flex items-center gap-1.5 z-20">
            {item.category === 'video' ? <Film className="w-3.5 h-3.5 text-amber-400" /> : <ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
            <span>{item.dimensions || item.duration || 'Full HD'}</span>
          </div>
        </div>

        {/* Right Side: Specifications & Order Action */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-neutral-900">
          <div>
            {/* Category tag */}
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">
              {item.category === 'video' ? (lang === 'gu' ? 'વિડિઓ એડિટિંગ' : 'Video Editing') : (lang === 'gu' ? 'ગ્રાફિક ડિઝાઇન' : 'Graphic Design')}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-2">
              {lang === 'gu' ? item.titleGu : item.title}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-neutral-800">
              <span className="text-xs text-neutral-400">{lang === 'gu' ? 'કિંમત:' : 'Price:'}</span>
              <span className="text-2xl font-extrabold text-amber-400 tabular-nums">₹{item.price}</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
              {lang === 'gu' ? item.descriptionGu : item.description}
            </p>

            {/* Specifications list */}
            <div className="space-y-2.5 text-xs text-neutral-300 mb-8 bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/80">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">{lang === 'gu' ? 'ડિલિવરી સમય:' : 'Delivery Time:'}</span>
                <span className="font-semibold text-white">{lang === 'gu' ? item.deliveryTimeGu : item.deliveryTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">{lang === 'gu' ? 'સોફ્ટવેર ટૂલ્સ:' : 'Software:'}</span>
                <span className="font-semibold text-white">{item.software.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">{lang === 'gu' ? 'સાઈઝ / ફોર્મેટ:' : 'Dimensions / Format:'}</span>
                <span className="font-semibold text-white">{item.dimensions || item.duration || 'Custom Standard'}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                onClose();
                onOrderStyle(item);
              }}
              type="button"
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'gu' ? 'આ ડિઝાઈન જેવું બનાવો (ઓર્ડર કરો)' : 'Order This Exact Style'}</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer text-center"
            >
              {lang === 'gu' ? 'પાછા જાઓ' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
