import React, { useState } from 'react';
import { PortfolioItem, Language, SiteUIConfig } from '../types';
import { Eye, PlusCircle, Search, Film, Image as ImageIcon } from 'lucide-react';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  lang: Language;
  uiConfig?: SiteUIConfig;
  onSelectItem: (item: PortfolioItem) => void;
  onOrderStyle: (item: PortfolioItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  items,
  lang,
  uiConfig,
  onSelectItem,
  onOrderStyle,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = [
    { id: 'all', labelGu: 'બધા સેમ્પલ', labelEn: 'All Showcase' },
    { id: 'poster', labelGu: 'પોસ્ટર ડિઝાઇન', labelEn: 'Poster Designs' },
    { id: 'video', labelGu: 'વિડિઓ & રીલ્સ', labelEn: 'Video & Reels' },
    { id: 'festival', labelGu: 'તહેવાર સ્પેશિયલ', labelEn: 'Festive Banners' },
    { id: 'business', labelGu: 'બિઝનેસ & શોરૂમ', labelEn: 'Business Branding' },
    { id: 'thumbnail', labelGu: 'યુટ્યુબ થંબનેલ', labelEn: 'YT Thumbnails' },
  ];

  const filteredItems = items.filter((item) => {
    // Category or subcategory check
    const matchesFilter =
      activeFilter === 'all' ||
      item.category === activeFilter ||
      item.subcategory === activeFilter;

    // Search query check
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.titleGu.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.descriptionGu.toLowerCase().includes(q) ||
      item.software.some((s) => s.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  return (
    <section id="portfolio" className="py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              {lang === 'gu'
                ? (uiConfig?.portfolioContent?.badgeGu || 'અમારું કામ અને ડિઝાઇન ગેલેરી')
                : (uiConfig?.portfolioContent?.badgeEn || 'Curated Portfolio Gallery')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              {lang === 'gu'
                ? (uiConfig?.portfolioContent?.headlineGu || 'લેટેસ્ટ પોસ્ટર અને વિડિઓ વર્ક')
                : (uiConfig?.portfolioContent?.headlineEn || 'Featured Creative Showcase')}
            </h2>
          </div>

          <p className="text-sm text-neutral-400 max-w-md">
            {lang === 'gu'
              ? (uiConfig?.portfolioContent?.subheadGu || 'કોઈપણ સેમ્પલ ગમે તો "આવું બનાવો" પર ક્લિક કરીને સીધો તમારા બિઝનેસ માટે ઓર્ડર બુક કરો.')
              : (uiConfig?.portfolioContent?.subheadEn || 'Love any design style below? Click "Order This Style" to request a custom edition for your brand in minutes.')}
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
          
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  type="button"
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {lang === 'gu' ? tab.labelGu : tab.labelEn}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'gu' ? 'પોસ્ટર કે વિડિઓ શોધો...' : 'Search designs...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

        </div>

        {/* Portfolio Bento Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
            <p className="text-neutral-400 text-sm">
              {lang === 'gu' ? 'કોઈ ડિઝાઇન મળી નથી. અન્ય કીવર્ડથી શોધો.' : 'No designs found for this filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isLarge = index === 0 && activeFilter === 'all';
              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 ${
                    isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  {/* Media Container */}
                  <div className="relative overflow-hidden bg-neutral-950 aspect-[4/3] w-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Gradient Scrim for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    {/* Format Indicator (Video or Poster) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-950/80 backdrop-blur-md border border-neutral-700/60 text-[11px] font-medium text-neutral-200">
                      {item.category === 'video' ? (
                        <>
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'gu' ? 'વિડિઓ રીલ' : 'Video Reel'}</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'gu' ? 'ગ્રાફિક પોસ્ટર' : 'Poster Design'}</span>
                        </>
                      )}
                    </div>

                    {/* Price tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-amber-400 text-neutral-950 text-xs font-bold tabular-nums shadow">
                      ₹{item.price}
                    </div>

                    {/* Quick Lightbox Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/40 backdrop-blur-[2px]">
                      <button
                        onClick={() => onSelectItem(item)}
                        type="button"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'gu' ? 'મોટું જુઓ & વિગતો' : 'View Full Details'}</span>
                      </button>
                    </div>

                    {/* Software tags */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-neutral-300">
                      {item.software.map((s, idx) => (
                        <React.Fragment key={s}>
                          {idx > 0 && <span aria-hidden="true" className="text-neutral-500">·</span>}
                          <span>{s}</span>
                        </React.Fragment>
                      ))}
                      <span aria-hidden="true" className="text-neutral-500">·</span>
                      <span className="text-amber-400">{lang === 'gu' ? item.deliveryTimeGu : item.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5">
                        {lang === 'gu' ? item.titleGu : item.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                        {lang === 'gu' ? item.descriptionGu : item.description}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectItem(item)}
                        type="button"
                        className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {lang === 'gu' ? 'વધુ વિગત' : 'Details'}
                      </button>

                      <button
                        onClick={() => onOrderStyle(item)}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400 hover:text-neutral-950 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'gu' ? 'આવું બનાવો' : 'Order This Style'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
