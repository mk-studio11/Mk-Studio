import React, { useState } from 'react';
import { PricingPlan, Language, SiteUIConfig } from '../types';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface PricingSectionProps {
  plans: PricingPlan[];
  lang: Language;
  uiConfig?: SiteUIConfig;
  onSelectPlan: (plan: PricingPlan) => void;
  onRequestCustom: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  plans,
  lang,
  uiConfig,
  onSelectPlan,
  onRequestCustom,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'poster' | 'video' | 'combo'>('all');

  const filteredPlans = plans.filter((plan) => {
    if (activeCategory === 'all') return true;
    return plan.category === activeCategory;
  });

  return (
    <section id="pricing" className="py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {lang === 'gu'
              ? (uiConfig?.pricingContent?.badgeGu || 'પારદર્શક ભાવ અને પેકેજ')
              : (uiConfig?.pricingContent?.badgeEn || 'Transparent Rates & Packages')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 [text-wrap:balance]">
            {lang === 'gu'
              ? (uiConfig?.pricingContent?.headlineGu || 'તમારા બજેટ અનુસાર સરળ ભાવ પત્રક')
              : (uiConfig?.pricingContent?.headlineEn || 'Affordable Pricing for Every Need')}
          </h2>
          <p className="text-sm text-neutral-400">
            {lang === 'gu'
              ? (uiConfig?.pricingContent?.subheadGu || 'કોઈ છુપો ચાર્જ નથી. હાઈ-ક્વોલિટી ફાઈલ્સ, ફ્રી સુધારા (રિવિઝન), અને ઝડપી ડિલિવરી સાથે સર્વશ્રેષ્ઠ સર્વિસ.')
              : (uiConfig?.pricingContent?.subheadEn || 'No hidden charges. High-resolution exports, complimentary revisions, and priority turnaround included.')}
          </p>

          {/* Segmented Category Filter */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setActiveCategory('all')}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'gu' ? 'બધા પેકેજ' : 'All Packages'}
            </button>
            <button
              onClick={() => setActiveCategory('poster')}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'poster'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'gu' ? 'પોસ્ટર પ્લાન્સ' : 'Poster Plans'}
            </button>
            <button
              onClick={() => setActiveCategory('video')}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'video'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'gu' ? 'વિડિઓ એડિટિંગ' : 'Video Plans'}
            </button>
            <button
              onClick={() => setActiveCategory('combo')}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'combo'
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {lang === 'gu' ? 'બ્રાન્ડિંગ કોમ્બો' : 'Combo Bundles'}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPlans.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-amber-400 bg-neutral-900/90 shadow-xl shadow-amber-400/5 -translate-y-1'
                    : 'border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                }`}
              >
                {/* Popular Marker */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-black uppercase tracking-wider shadow">
                    {lang === 'gu' ? 'સૌથી વધુ પસંદગી' : 'Most Popular'}
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {lang === 'gu' ? plan.nameGu : plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {lang === 'gu' ? plan.taglineGu : plan.tagline}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-neutral-800">
                    <span className="text-4xl font-extrabold text-white tabular-nums">
                      ₹{plan.price}
                    </span>
                    {plan.discountPrice && (
                      <span className="text-sm text-neutral-500 line-through tabular-nums">
                        ₹{plan.discountPrice}
                      </span>
                    )}
                    {plan.period && (
                      <span className="text-xs text-neutral-400">
                        {lang === 'gu' ? plan.periodGu : plan.period}
                      </span>
                    )}
                  </div>

                  {/* Feature Inclusions List */}
                  <div className="space-y-3 mb-8">
                    {(lang === 'gu' ? plan.featuresGu : plan.features).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Ideal For Note */}
                  <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/80 mb-5 text-[11px] text-neutral-400">
                    <strong className="text-neutral-300">{lang === 'gu' ? 'શ્રેષ્ઠ કોના માટે:' : 'Best for:'}</strong>{' '}
                    {lang === 'gu' ? plan.idealForGu : plan.idealFor}
                  </div>

                  {/* Primary CTA */}
                  <button
                    onClick={() => onSelectPlan(plan)}
                    type="button"
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-md'
                        : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                    }`}
                  >
                    <span>{lang === 'gu' ? 'આ પ્લાન ઓર્ડર કરો' : 'Select & Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Custom Project Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {lang === 'gu' ? 'તમારે કોઈ સ્પેશિયલ / કસ્ટમ પ્રોજેક્ટ કરાવવો છે?' : 'Need a Custom Requirement or Bulk Order?'}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lang === 'gu'
                  ? 'બ્રોશર, કેટલોગ, યુટ્યુબ પોડકાસ્ટ એડિટિંગ કે લોગો બ્રાન્ડિંગ માટે સીધો સંપર્ક કરી અંદાજિત ખર્ચ જાણો.'
                  : 'Contact directly for custom video documentaries, catalog designs, podcast editing, or agency retainers.'}
              </p>
            </div>
          </div>

          <button
            onClick={onRequestCustom}
            type="button"
            className="px-5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            {lang === 'gu' ? 'કસ્ટમ રિક્વાયરમેન્ટ મોકલો' : 'Request Custom Quote'}
          </button>
        </div>

      </div>
    </section>
  );
};
