import React from 'react';
import { Language, CreatorProfile, SiteUIConfig } from '../types';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  lang: Language;
  creator: CreatorProfile;
  uiConfig?: SiteUIConfig;
  onOpenOrderModal: () => void;
  onExploreWork: () => void;
  onViewPricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  creator,
  uiConfig,
  onOpenOrderModal,
  onExploreWork,
  onViewPricing,
}) => {
  const heroData = uiConfig?.heroContent;
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-neutral-800">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Screen Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Typographic Impact */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial Lead-in - Zero pill text with dot separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
              <span>
                {lang === 'gu'
                  ? (heroData?.badgeGu || 'પ્રોફેશનલ ગ્રાફિક્સ & વિડિઓ એડિટિંગ')
                  : (heroData?.badgeEn || 'Professional Graphics & Video Editing')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'gu' ? 'ગુજરાત' : 'Gujarat, India'}</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 [text-wrap:balance]">
              {lang === 'gu' ? (
                heroData?.headlineGu || creator.heroHeadlineGu || (
                  <>
                    તમારા બિઝનેસ માટે <span className="text-amber-400">આકર્ષક પોસ્ટર</span> અને <span className="text-amber-400">સિનેમેટિક વિડિઓઝ</span>
                  </>
                )
              ) : (
                heroData?.headlineEn || creator.heroHeadlineEn || (
                  <>
                    High-Impact <span className="text-amber-400">Poster Designs</span> & Viral <span className="text-amber-400">Cinematic Edits</span>
                  </>
                )
              )}
            </h1>

            {/* Sub-prose */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl">
              {lang === 'gu'
                ? (heroData?.subheadGu || creator.heroSubheadGu || 'તહેવારની શુભેચ્છાઓ, દુકાન-શોરૂમની જાહેરાત, ઇન્સ્ટાગ્રામ રીલ્સ, યુટ્યુબ થંબનેલ કે લગ્ન ટીઝર – તમારા વિચારોને પ્રોફેશનલ રૂપ આપો. ૨૪ કલાકમાં રેડી ડિલિવરી અને સસ્તો ભાવ.')
                : (heroData?.subheadEn || creator.heroSubheadEn || 'From festival posters and retail launch campaigns to viral Instagram reels and wedding teasers. Crafted with precision in Photoshop & Premiere Pro with express 24h turnaround.')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenOrderModal}
                type="button"
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/10 hover:shadow-amber-400/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>
                  {lang === 'gu'
                    ? (heroData?.primaryCtaGu || 'ઓનલાઇન ઓર્ડર કરો')
                    : (heroData?.primaryCtaEn || 'Start Your Order')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreWork}
                type="button"
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <span>
                  {lang === 'gu'
                    ? (heroData?.secondaryCtaGu || 'કામના સેમ્પલ જુઓ')
                    : (heroData?.secondaryCtaEn || 'Explore Portfolio')}
                </span>
              </button>

              <button
                onClick={onViewPricing}
                type="button"
                className="px-4 py-3.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {lang === 'gu' ? 'ભાવ પત્રક (₹)' : 'Pricing Rates (₹)'}
              </button>
            </div>

            {/* Proof Metrics - Clean unboxed text layout with typographic separators */}
            <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {creator.stats.postersCompleted}+
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu' ? 'પોસ્ટર ડિઝાઇન' : 'Posters Delivered'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {creator.stats.videosEdited}+
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu' ? 'વિડિઓઝ & રીલ્સ' : 'Reels & Videos'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
                  {creator.stats.rating} / 5.0
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu' ? 'ગ્રાહક સંતોષ રેટિંગ' : 'Customer Rating'}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {lang === 'gu' ? '૨૪ કલાક' : '24 Hours'}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {lang === 'gu' ? 'સુપર ફાસ્ટ ડિલિવરી' : 'Turnaround Time'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Container & Floating Feature Ribbon */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src={creator.heroImage || '/src/assets/images/hero_creative_studio_1790948250383.jpg'}
                alt="Creative Design & Video Editing Studio Workstation"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-500"
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-transparent" />

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'gu' ? 'પ્રીમિયમ સોફ્ટવેર સ્વીટ' : 'Industry Standard Workflow'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>Adobe Photoshop</span>
                      <span aria-hidden="true">·</span>
                      <span>Premiere Pro</span>
                      <span aria-hidden="true">·</span>
                      <span>After Effects</span>
                    </div>
                  </div>

                  <button
                    onClick={onExploreWork}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors cursor-pointer"
                    title={lang === 'gu' ? 'કામ જુઓ' : 'Explore portfolio'}
                  >
                    <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Trust highlights checklist */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'gu' ? '૧૦૦% ઓરિજિનલ ક્રિએટિવ' : 'Original Artwork'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'gu' ? 'વોટ્સએપ & ઇન્સ્ટા સાઇઝ' : 'WhatsApp Ready'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'gu' ? 'ફ્રી સુધારા (Revisions)' : 'Free Revisions'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
