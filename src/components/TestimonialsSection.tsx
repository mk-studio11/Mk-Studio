import React from 'react';
import { ClientReview, Language } from '../types';
import { Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  reviews: ClientReview[];
  lang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviews,
  lang,
}) => {
  return (
    <section id="reviews" className="py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {lang === 'gu' ? 'ગ્રાહકોનો વિશ્વાસ અને અનુભવ' : 'Client Testimonials'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 [text-wrap:balance]">
            {lang === 'gu' ? 'સંતુષ્ટ વેપારીઓ અને ક્રિએટર્સના શબ્દો' : 'Trusted by Businesses Across Gujarat'}
          </h2>
          <p className="text-sm text-neutral-400">
            {lang === 'gu'
              ? 'અમદાવાદ, સુરત, રાજકોટ અને વડોદરાના સફળ ઉદ્યોગસાહસિકોના સાચા રિવ્યુ.'
              : 'Honest feedback from entrepreneurs, jewelers, and creators who rely on our creative studio.'}
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 italic">
                  "{lang === 'gu' ? rev.commentGu : rev.comment}"
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-4 border-t border-neutral-800/80">
                <div className="text-xs font-bold text-white">
                  {rev.clientName}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  {lang === 'gu' ? rev.businessTypeGu : rev.businessType}
                </div>
                <div className="text-[10px] text-amber-400/90 mt-1 flex items-center gap-1.5">
                  <span>{rev.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'gu' ? rev.projectTypeGu : rev.projectType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
