import React, { useState } from 'react';
import { Language, SiteUIConfig, ThemeColorOption } from '../types';
import { defaultUIConfig } from '../data/defaultUIConfig';
import {
  Palette,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Layout,
  Type,
  Sliders,
  Megaphone,
} from 'lucide-react';

interface AdminUIEditorProps {
  lang: Language;
  uiConfig: SiteUIConfig;
  onSaveUIConfig: (newConfig: SiteUIConfig) => void;
  onResetUIConfig: () => void;
}

export const AdminUIEditor: React.FC<AdminUIEditorProps> = ({
  lang,
  uiConfig,
  onSaveUIConfig,
  onResetUIConfig,
}) => {
  const [config, setConfig] = useState<SiteUIConfig>(uiConfig);
  const [savedToast, setSavedToast] = useState(false);

  const themeColors: { id: ThemeColorOption; nameGu: string; nameEn: string; bgClass: string; borderClass: string }[] = [
    { id: 'amber', nameGu: 'ગોલ્ડન એમ્બર (શ્રેષ્ઠ)', nameEn: 'Golden Amber (Default)', bgClass: 'bg-amber-400', borderClass: 'border-amber-400' },
    { id: 'blue', nameGu: 'રોયલ બ્લુ', nameEn: 'Royal Blue', bgClass: 'bg-sky-500', borderClass: 'border-sky-500' },
    { id: 'emerald', nameGu: 'એમરાલ્ડ ગ્રીન', nameEn: 'Emerald Green', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-500' },
    { id: 'purple', nameGu: 'સાયબર પર્પલ', nameEn: 'Neon Purple', bgClass: 'bg-purple-500', borderClass: 'border-purple-500' },
    { id: 'red', nameGu: 'ક્રિમસન રેડ', nameEn: 'Crimson Red', bgClass: 'bg-rose-500', borderClass: 'border-rose-500' },
    { id: 'cyan', nameGu: 'સાયન / એક્વા', nameEn: 'Cyan Teal', bgClass: 'bg-cyan-500', borderClass: 'border-cyan-500' },
  ];

  const handleToggleSection = (section: keyof SiteUIConfig['sectionsVisibility']) => {
    setConfig((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [section]: !prev.sectionsVisibility[section],
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUIConfig(config);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    setConfig(defaultUIConfig);
    onResetUIConfig();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>{lang === 'gu' ? 'આખી વેબસાઇટનું UI & લખાણ એડિટર' : 'Full Website UI & Content Customizer'}</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {lang === 'gu'
              ? 'અહીંથી તમે વેબસાઇટના તમામ રંગો, સેક્શન્સ ચાલુ/બંધ, મુખ્ય હેડલાઇન, બેનર્સ અને તમામ લખાણ તમારી મરજી મુજબ બદલી શકો છો.'
              : 'Customize accent themes, toggle sections on/off, edit every headline, banner, and text across the entire website.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'ડિફોલ્ટ રીસેટ' : 'Reset Default'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{lang === 'gu' ? 'UI સેવ & લાગુ કરો' : 'Save & Apply UI'}</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{lang === 'gu' ? '✅ તમામ UI ફેરફારો સેવ થઈ ગયા છે અને વેબસાઇટ પર લાગુ થઈ ગયા છે!' : 'All UI changes saved and applied live!'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. THEME ACCENT COLOR PICKER */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>{lang === 'gu' ? '૧. વેબસાઇટ થીમ અને એક્સેન્ટ કલર' : '1. Website Accent Color & Theme'}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {lang === 'gu' ? 'તમારી બ્રાન્ડ શૈલી અનુસાર પ્રાથમિક હાઇલાઇટ કલર પસંદ કરો:' : 'Choose your primary brand accent color:'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {themeColors.map((theme) => {
              const isSelected = config.themeColor === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setConfig({ ...config, themeColor: theme.id })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? `bg-neutral-800 border-amber-400 shadow-md ring-1 ring-amber-400`
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full ${theme.bgClass} shadow-md`} />
                  <span className="text-[11px] font-bold text-neutral-200 text-center">
                    {lang === 'gu' ? theme.nameGu : theme.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SECTION VISIBILITY CONTROLS (SHOW / HIDE) */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{lang === 'gu' ? '૨. વેબસાઇટ સેક્શન્સ ચાલુ / બંધ કરો' : '2. Section Visibility Controls'}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {lang === 'gu'
                ? 'તમે જે સેક્શન બતાવવા માંગતા ન હોવ, તેને અહીંથી બંધ કરી શકો છો:'
                : 'Turn any section on or off based on your current business focus:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'hero', labelGu: 'હીરો બેનર (Hero Header)', labelEn: 'Hero Header' },
              { key: 'portfolio', labelGu: 'પોસ્ટર ગેલેરી (Posters)', labelEn: 'Posters Portfolio' },
              { key: 'videoReels', labelGu: 'વિડિઓ રીલ્સ (Video Showcase)', labelEn: 'Video Showcase' },
              { key: 'pricing', labelGu: 'ભાવ અને પેકેજ (Pricing)', labelEn: 'Pricing Plans' },
              { key: 'testimonials', labelGu: 'ગ્રાહક રિવ્યૂ (Reviews)', labelEn: 'Client Reviews' },
              { key: 'faq', labelGu: 'સવાલો-જવાબો (FAQ)', labelEn: 'FAQ Section' },
              { key: 'floatingCta', labelGu: 'ફ્લોટિંગ WhatsApp & Call', labelEn: 'Floating CTA Bar' },
            ].map((sec) => {
              const isVisible = config.sectionsVisibility[sec.key as keyof SiteUIConfig['sectionsVisibility']];
              return (
                <div
                  key={sec.key}
                  onClick={() => handleToggleSection(sec.key as keyof SiteUIConfig['sectionsVisibility'])}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    isVisible
                      ? 'bg-neutral-800/90 border-amber-400/40 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-500 opacity-60'
                  }`}
                >
                  <span className="text-xs font-semibold">{lang === 'gu' ? sec.labelGu : sec.labelEn}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {isVisible ? (lang === 'gu' ? 'ચાલુ (ON)' : 'ON') : (lang === 'gu' ? 'બંધ (OFF)' : 'OFF')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. ANNOUNCEMENT BAR */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>{lang === 'gu' ? '૩. ટોપ અનાઉન્સમેન્ટ બાર (Top Alert / Offer Bar)' : '3. Top Announcement Banner'}</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lang === 'gu' ? 'વેબસાઇટની સૌથી ઉપર ખાસ ઓફર કે તહેવારની જાહેરાત બતાવો:' : 'Display festival offers or alerts at the very top of your site:'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfig({ ...config, announcement: { ...config.announcement, enabled: !config.announcement.enabled } })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                config.announcement.enabled ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {config.announcement.enabled ? (lang === 'gu' ? 'ચાલુ છે (Enabled)' : 'Enabled') : (lang === 'gu' ? 'બંધ છે (Disabled)' : 'Disabled')}
            </button>
          </div>

          {config.announcement.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {lang === 'gu' ? 'અનાઉન્સમેન્ટ લખાણ (ગુજરાતીમાં)' : 'Announcement Text (Gujarati)'}
                </label>
                <input
                  type="text"
                  value={config.announcement.textGu}
                  onChange={(e) => setConfig({ ...config, announcement: { ...config.announcement, textGu: e.target.value } })}
                  placeholder="🎉 તહેવાર ઓફર: ફ્લેટ 20% ડિસ્કાઉન્ટ..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {lang === 'gu' ? 'Announcement Text (English)' : 'Announcement Text (English)'}
                </label>
                <input
                  type="text"
                  value={config.announcement.textEn}
                  onChange={(e) => setConfig({ ...config, announcement: { ...config.announcement, textEn: e.target.value } })}
                  placeholder="🎉 Festival Offer: Flat 20% discount on first order..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. HERO SECTION CONTENT EDITOR */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'gu' ? '૪. હીરો સેક્શન લખાણ અને બટન ટેક્સ્ટ' : '4. Hero Section Text & Buttons'}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {lang === 'gu' ? 'મુખ્ય હેડલાઇન, સબ-ટાઇટલ અને બટન પર લખાતા શબ્દો બદલો:' : 'Modify primary headline, subhead, badges, and button labels:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'નાનો બેજ ટેક્સ્ટ (ગુજરાતી)' : 'Badge Text (Gujarati)'}
              </label>
              <input
                type="text"
                value={config.heroContent.badgeGu}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, badgeGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'Badge Text (English)' : 'Badge Text (English)'}
              </label>
              <input
                type="text"
                value={config.heroContent.badgeEn}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, badgeEn: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'મુખ્ય હેડલાઇન (ગુજરાતી) *' : 'Main Headline (Gujarati) *'}
              </label>
              <textarea
                rows={2}
                value={config.heroContent.headlineGu}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, headlineGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'Main Headline (English) *' : 'Main Headline (English) *'}
              </label>
              <textarea
                rows={2}
                value={config.heroContent.headlineEn}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, headlineEn: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'સબ-ટાઇટલ વિગત (ગુજરાતી)' : 'Subhead Description (Gujarati)'}
              </label>
              <textarea
                rows={2}
                value={config.heroContent.subheadGu}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, subheadGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'Subhead Description (English)' : 'Subhead Description (English)'}
              </label>
              <textarea
                rows={2}
                value={config.heroContent.subheadEn}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, subheadEn: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'ઓર્ડર બટન લખાણ (Primary Button)' : 'Primary CTA Button (Gujarati)'}
              </label>
              <input
                type="text"
                value={config.heroContent.primaryCtaGu}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, primaryCtaGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'સેમ્પલ બટન લખાણ (Secondary Button)' : 'Secondary CTA Button (Gujarati)'}
              </label>
              <input
                type="text"
                value={config.heroContent.secondaryCtaGu}
                onChange={(e) => setConfig({ ...config, heroContent: { ...config.heroContent, secondaryCtaGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* 5. PORTFOLIO & VIDEO SECTION HEADINGS */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" />
            <span>{lang === 'gu' ? '૫. ગેલેરી & વિડિઓ સેક્શન હેડલાઇન્સ' : '5. Portfolio & Video Section Headings'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'પોસ્ટર સેક્શન ટાઇટલ (ગુજરાતી)' : 'Posters Headline (Gujarati)'}
              </label>
              <input
                type="text"
                value={config.portfolioContent.headlineGu}
                onChange={(e) => setConfig({ ...config, portfolioContent: { ...config.portfolioContent, headlineGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'વિડિઓ સેક્શન ટાઇટલ (ગુજરાતી)' : 'Video Section Headline (Gujarati)'}
              </label>
              <input
                type="text"
                value={config.videoContent.headlineGu}
                onChange={(e) => setConfig({ ...config, videoContent: { ...config.videoContent, headlineGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* 6. PRICING & FOOTER COPY */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            <span>{lang === 'gu' ? '૬. પ્રાઇસિંગ & ફૂટર લખાણ' : '6. Pricing & Footer Copy'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'પ્રાઇસિંગ સેક્શન હેડલાઇન' : 'Pricing Headline'}
              </label>
              <input
                type="text"
                value={config.pricingContent.headlineGu}
                onChange={(e) => setConfig({ ...config, pricingContent: { ...config.pricingContent, headlineGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {lang === 'gu' ? 'ફૂટર અબાઉટ પેરાગ્રાફ (ગુજરાતી)' : 'Footer About Paragraph (Gujarati)'}
              </label>
              <textarea
                rows={2}
                value={config.footerContent.aboutGu}
                onChange={(e) => setConfig({ ...config, footerContent: { ...config.footerContent, aboutGu: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Big Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-400/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{lang === 'gu' ? 'તમામ UI ફેરફારો સેવ કરો & લાઈવ વેબસાઇટ પર લાગુ કરો' : 'Save All UI Changes & Apply to Live Website'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
