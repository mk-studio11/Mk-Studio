import React, { useState } from 'react';
import { Language, CreatorProfile } from '../types';
import { Lock, X, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  creator: CreatorProfile;
  lang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  creator,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const validPassword = creator.adminPassword || creator.adminPin || '1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === validPassword.trim()) {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoAccess = () => {
    setPin(validPassword);
    setError(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {lang === 'gu' ? 'એડમિન પેનલ લોગીન' : 'Admin Panel Login'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {lang === 'gu'
              ? 'પોતાના લોગો, પોસ્ટર, વિડિઓ અને ભાવ બદલવા માટે પાસવર્ડ દાખલ કરો.'
              : 'Enter your Admin Password to manage your logo, posters, videos and prices.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {lang === 'gu' ? 'એડમિન સિક્યુરિટી પાસવર્ડ (Admin Password)' : 'Security Password'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder={lang === 'gu' ? 'પાસવર્ડ દાખલ કરો...' : 'Enter password...'}
                autoFocus
                className={`w-full pl-9 pr-10 py-3 rounded-xl bg-neutral-950 border text-white text-base focus:outline-none transition-colors ${
                  error
                    ? 'border-red-500 focus:border-red-500 bg-red-950/10'
                    : 'border-neutral-800 focus:border-amber-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'gu'
                    ? `ખોટો પાસવર્ડ! (હાલનો પાસવર્ડ: ${validPassword} છે)`
                    : `Incorrect password! (Current password: ${validPassword})`}
                </span>
              </p>
            )}
          </div>

          {/* Current Password Info Box */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>
              {lang === 'gu' ? 'હાલનો પાસવર્ડ:' : 'Current Password:'}{' '}
              <strong className="text-amber-400 font-mono text-xs">{validPassword}</strong>
            </span>
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="px-2.5 py-1 rounded bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 font-semibold cursor-pointer transition-colors"
            >
              {lang === 'gu' ? 'ઓટો ફિલ & પ્રવેશ' : 'Auto Fill & Enter'}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-400/10"
          >
            {lang === 'gu' ? 'એડમિન પેનલમાં પ્રવેશ કરો' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};
