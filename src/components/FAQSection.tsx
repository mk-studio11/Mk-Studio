import React, { useState } from 'react';
import { Language, FAQItem } from '../types';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  lang: Language;
  faqs?: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang, faqs: propFaqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FAQItem[] = [
    {
      id: 'faq-1',
      qGu: 'ઓર્ડર આપ્યા પછી પોસ્ટર કે વિડિઓ કેટલા સમયમાં મળી જશે?',
      qEn: 'What is the delivery turnaround time for posters and videos?',
      aGu: 'સામાન્ય રીતે સિંગલ પોસ્ટર અને ઇન્સ્ટાગ્રામ રીલ ૨૪ કલાકમાં તૈયાર થઈ જાય છે. જો તમારે તાત્કાલિક જરૂર હોય તો અમારો "સુપર ફાસ્ટ (૬ કલાક)" એક્સપ્રેસ વિકલ્પ પસંદ કરી શકો છો.',
      aEn: 'Standard posters and Instagram reels are delivered within 24 hours. If needed urgently, our 6-hour express turnaround option delivers within the same day.',
    },
    {
      id: 'faq-2',
      qGu: 'જો ડિઝાઇનમાં કોઈ સુધારો (Revision) કરાવવો હોય તો વધારાનો ચાર્જ લાગશે?',
      qEn: 'Do you charge extra for revisions or design corrections?',
      aGu: 'ના, દરેક ઓર્ડરમાં ૨ થી ૩ વખત સુધી ફ્રી સુધારા (Revisions) સામેલ છે. તમને સંતોષ ન થાય ત્યાં સુધી લખાણ, કલર કે ફોટો એડજસ્ટમેન્ટ મફત કરી આપશું.',
      aEn: 'No! All plans include 2 to 3 complimentary revision rounds. Text adjustments, color tweaks, and placement refinements are free until you approve.',
    },
    {
      id: 'faq-3',
      qGu: 'હું મારા બિઝનેસનો લોગો અને ફોટા કેવી રીતે મોકલી શકું?',
      qEn: 'How can I send my brand logo and high-res photos?',
      aGu: 'ઓર્ડર ફોર્મ ભર્યા પછી તમે સીધા અમારા WhatsApp નંબર પર હાઈ-ક્વોલિટી ડોક્યુમેન્ટ મોડમાં ફોટા અને લોગો મોકલી શકો છો, અથવા ગૂગલ ડ્રાઈવ લિંક આપી શકો છો.',
      aEn: 'You can directly attach your logo and images on WhatsApp as document files or share a Google Drive / Dropbox link.',
    },
    {
      id: 'faq-4',
      qGu: 'પેમેન્ટ ક્યારે અને કેવી રીતે કરવાનું રહેશે?',
      qEn: 'When and how do I complete payment?',
      aGu: 'ડિઝાઇન તૈયાર થઈ ગયા પછી અમે તમને વોટ્સએપ પર વોટરમાર્કવાળો પ્રિવ્યુ મોકલીશું. તમે ડિઝાઇન મંજૂર કરો પછી UPI (Google Pay, PhonePe, Paytm) દ્વારા પેમેન્ટ કરી શકો છો.',
      aEn: 'Once the draft preview is ready, we share a proof on WhatsApp. After you approve the final layout, payment is completed conveniently via UPI (GPay/PhonePe).',
    },
    {
      id: 'faq-5',
      qGu: 'ફાઇનલ પોસ્ટર અને વિડિઓ કયા ફોર્મેટમાં મળશે?',
      qEn: 'In which file formats will I receive the final output?',
      aGu: 'પોસ્ટર્સ: WhatsApp Status અને Instagram Feed માટે અલ્ટ્રા HD PNG, JPG તેમજ પ્રિન્ટિંગ માટે PDF. વિડિઓઝ: 1080p અથવા 4K MP4 ફોર્મેટમાં મોકલવામાં આવશે.',
      aEn: 'Posters are delivered in Crystal Clear PNG, JPG, and print-ready PDF. Videos are exported in 1080p Full HD or 4K MP4 format.',
    },
  ];

  const faqs = propFaqs && propFaqs.length > 0 ? propFaqs : defaultFaqs;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-neutral-900/40 border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {lang === 'gu' ? 'વારંવાર પૂછાતા પ્રશ્નો' : 'Frequently Asked Questions'}
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {lang === 'gu' ? 'તમારા મનના પ્રશ્નોના જવાબો' : 'Common Client Queries'}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  type="button"
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-800/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {lang === 'gu' ? faq.qGu : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {lang === 'gu' ? faq.aGu : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
