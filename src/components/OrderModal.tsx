import React, { useState, useEffect } from 'react';
import {
  Language,
  ServiceCategory,
  PortfolioItem,
  PricingPlan,
  Order,
  CreatorProfile,
} from '../types';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import { X, MessageCircle, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  creator: CreatorProfile;
  preselectedItem?: PortfolioItem | null;
  preselectedPlan?: PricingPlan | null;
  onSubmitOrder: (order: Order) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  lang,
  creator,
  preselectedItem,
  preselectedPlan,
  onSubmitOrder,
}) => {
  const [serviceType, setServiceType] = useState<string>('single-poster');
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('અમદાવાદ (Ahmedabad)');
  const [requirementsText, setRequirementsText] = useState<string>('');
  const [driveLink, setDriveLink] = useState<string>('');
  const [urgency, setUrgency] = useState<'normal' | 'express'>('normal');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync preselected plan or item
  useEffect(() => {
    if (preselectedPlan) {
      setServiceType(preselectedPlan.id);
    } else if (preselectedItem) {
      if (preselectedItem.category === 'video') {
        setServiceType('single-reel');
      } else {
        setServiceType('single-poster');
      }
    }
  }, [preselectedPlan, preselectedItem]);

  if (!isOpen) return null;

  // Calculate pricing based on service and urgency
  const calculateTotal = (): { base: number; express: number; total: number } => {
    let base = 299;
    if (preselectedItem) {
      base = preselectedItem.price;
    } else if (preselectedPlan) {
      base = preselectedPlan.price;
    } else {
      switch (serviceType) {
        case 'single-poster':
          base = 299;
          break;
        case 'single-reel':
          base = 599;
          break;
        case 'cinematic-video':
          base = 1999;
          break;
        case 'monthly-posters':
          base = 4999;
          break;
        case 'vip-creator-combo':
          base = 7499;
          break;
        case 'thumbnail':
          base = 249;
          break;
        default:
          base = 399;
      }
    }

    const express = urgency === 'express' ? 150 : 0;
    return { base, express, total: base + express };
  };

  const { base, express, total } = calculateTotal();

  const getServiceLabel = () => {
    if (preselectedItem) {
      return lang === 'gu' ? preselectedItem.titleGu : preselectedItem.title;
    }
    if (preselectedPlan) {
      return lang === 'gu' ? preselectedPlan.nameGu : preselectedPlan.name;
    }
    const map: Record<string, { gu: string; en: string }> = {
      'single-poster': { gu: 'સિંગલ પોસ્ટર ડિઝાઇન', en: 'Single Poster Design' },
      'single-reel': { gu: 'ઇન્સ્ટા રીલ / શોર્ટ એડિટિંગ', en: 'Instagram Reel Edit' },
      'cinematic-video': { gu: 'સિનેમેટિક ઇવેન્ટ / લગ્ન ટીઝર', en: 'Cinematic Teaser Edit' },
      'monthly-posters': { gu: 'મહિનાનું ૩૦ પોસ્ટર પેકેજ', en: 'Monthly 30 Posters Pack' },
      'vip-creator-combo': { gu: 'VIP બ્રાન્ડ કોમ્બો (પોસ્ટર + રીલ્સ)', en: 'VIP Brand Combo' },
      thumbnail: { gu: 'યુટ્યુબ થંબનેલ ડિઝાઇન', en: 'YouTube Thumbnail' },
      custom: { gu: 'કસ્ટમ રિક્વાયરમેન્ટ', en: 'Custom Requirement' },
    };
    return lang === 'gu' ? map[serviceType]?.gu || 'ડિઝાઇન સર્વિસ' : map[serviceType]?.en || 'Design Service';
  };

  const validate = (): boolean => {
    if (!clientName.trim()) {
      setErrorMsg(lang === 'gu' ? 'કૃપા કરીને તમારું નામ લખો' : 'Please enter your name');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg(lang === 'gu' ? 'કૃપા કરીને સાચો ૧૦ અંકનો મોબાઈલ નંબર લખો' : 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!requirementsText.trim()) {
      setErrorMsg(lang === 'gu' ? 'કૃપા કરીને પોસ્ટર કે વિડિઓમાં શું લખવું છે તેની વિગત લખો' : 'Please describe your requirements / text needed');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const createOrderObject = (): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ORD-${randomNum}`,
      clientName: clientName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      serviceCategory: preselectedItem ? preselectedItem.category : 'poster',
      serviceCategoryLabel: getServiceLabel(),
      selectedPlanId: preselectedPlan ? preselectedPlan.id : serviceType,
      itemReferenceId: preselectedItem ? preselectedItem.id : undefined,
      itemReferenceTitle: preselectedItem ? (lang === 'gu' ? preselectedItem.titleGu : preselectedItem.title) : undefined,
      requirementsText: `${requirementsText.trim()}${driveLink.trim() ? `\n(Google Drive/Files: ${driveLink.trim()})` : ''}`,
      urgency,
      estimatedPrice: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return newOrder;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order = createOrderObject();
    onSubmitOrder(order);

    const waUrl = generateWhatsAppOrderUrl(order, creator, lang);
    window.open(waUrl, '_blank');
    onClose();
  };

  const handleSaveOnlineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order = createOrderObject();
    onSubmitOrder(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8"
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

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-neutral-800">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            {lang === 'gu' ? 'ઓનલાઇન ઓર્ડર બુકિંગ' : 'Online Order Booking'}
          </div>
          <h3 className="text-2xl font-bold text-white">
            {lang === 'gu' ? 'પોસ્ટર / વિડિઓ એડિટિંગ ઓર્ડર કરો' : 'Order Your Design & Video'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {lang === 'gu'
              ? 'નીચેની વિગતો ભરો. તમે સીધો વોટ્સએપ પર ઓર્ડર મોકલી શકો છો અથવા અહીં સબમિટ કરી શકો છો.'
              : 'Fill in details below. You can send directly via WhatsApp or book online instantly.'}
          </p>
        </div>

        {/* Preselected banner */}
        {(preselectedItem || preselectedPlan) && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-neutral-400">{lang === 'gu' ? 'પસંદ કરેલ ડિઝાઇન/પ્લાન:' : 'Selected Item/Plan:'}</span>{' '}
              <strong className="text-amber-400 font-bold ml-1">{getServiceLabel()}</strong>
            </div>
            <span className="font-bold text-white tabular-nums">₹{base}</span>
          </div>
        )}

        {/* Form Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-5">
          {/* Service Picker (if no preselected item/plan) */}
          {!preselectedItem && !preselectedPlan && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                {lang === 'gu' ? '૧. શું બનાવડાવવું છે? (સર્વિસ પસંદ કરો)' : '1. Select Service Type'}
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="single-poster">{lang === 'gu' ? 'સિંગલ પોસ્ટર ડિઝાઇન (₹299)' : 'Single Poster Design (₹299)'}</option>
                <option value="single-reel">{lang === 'gu' ? 'ઇન્સ્ટાગ્રામ રીલ / શોર્ટ એડિટિંગ (₹599)' : 'Instagram Reel / Short Edit (₹599)'}</option>
                <option value="cinematic-video">{lang === 'gu' ? 'સિનેમેટિક ઇવેન્ટ / લગ્ન ટીઝર (₹1,999)' : 'Cinematic Event / Wedding Teaser (₹1,999)'}</option>
                <option value="monthly-posters">{lang === 'gu' ? 'મહિનાનું ૩૦ પોસ્ટર પેકેજ (₹4,999)' : 'Monthly 30 Posters Growth Pack (₹4,999)'}</option>
                <option value="vip-creator-combo">{lang === 'gu' ? 'કમ્પ્લીટ VIP બ્રાન્ડ કોમ્બો (₹7,499)' : 'Complete VIP Brand Combo (₹7,499)'}</option>
                <option value="thumbnail">{lang === 'gu' ? 'યુટ્યુબ થંબનેલ ડિઝાઇન (₹249)' : 'YouTube Thumbnail (₹249)'}</option>
                <option value="custom">{lang === 'gu' ? 'અન્ય કોઈ કસ્ટમ કામ' : 'Other Custom Requirement'}</option>
              </select>
            </div>
          )}

          {/* Client Details (Name & Phone) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {lang === 'gu' ? 'તમારું પૂરું નામ *' : 'Your Full Name *'}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={lang === 'gu' ? 'દા.ત. રમેશભાઈ પટેલ' : 'e.g. Ramesh Patel'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {lang === 'gu' ? 'વોટ્સએપ / મોબાઈલ નંબર *' : 'WhatsApp / Mobile Number *'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={lang === 'gu' ? 'દા.ત. 98250 12345' : 'e.g. 98250 12345'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {lang === 'gu' ? 'તમારું શહેર / ગામ' : 'Your City / Town'}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={lang === 'gu' ? 'અમદાવાદ, સુરત, રાજકોટ, વડોદરા...' : 'Ahmedabad, Surat, Rajkot, etc.'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Requirements & Text to write on poster */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {lang === 'gu'
                ? 'પોસ્ટર કે વિડિઓ માટેની વિગત & લખાણ *'
                : 'Project Requirements / Text to include *'}
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder={
                lang === 'gu'
                  ? 'પોસ્ટર પર જે નામ, તારીખ, ઓફર કે શુભેચ્છા લખવાની હોય તે અહીં લખો...'
                  : 'Enter text, titles, offer discounts, dates, or contact info to place on design...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Optional File / Drive Link */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {lang === 'gu' ? 'ફોટો / લોગો / ગૂગલ ડ્રાઈવ લિંક (જો હોય તો)' : 'Photo / Logo / Google Drive Link (Optional)'}
            </label>
            <input
              type="url"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder={lang === 'gu' ? 'https://drive.google.com/... અથવા વોટ્સએપ પર મોકલી શકો છો' : 'Google Drive link, or send raw files on WhatsApp'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              {lang === 'gu' ? '💡 તમે ઓર્ડર કર્યા પછી સીધા તમારા ફોટો/લોગો વોટ્સએપ પર પણ મોકલી શકો છો.' : '💡 You can also attach raw photos/footage on WhatsApp after submitting.'}
            </p>
          </div>

          {/* Turnaround Urgency Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              {lang === 'gu' ? 'ડિલિવરી સ્પીડ પસંદ કરો' : 'Turnaround Speed'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  urgency === 'normal'
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-neutral-800 bg-neutral-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="urgency"
                    value="normal"
                    checked={urgency === 'normal'}
                    onChange={() => setUrgency('normal')}
                    className="accent-amber-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {lang === 'gu' ? 'સામાન્ય (૨૪-૪૮ કલાક)' : 'Standard (24-48 Hours)'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'સામાન્ય ડિલિવરી સમય' : 'Standard schedule'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400">{lang === 'gu' ? 'મફત' : 'Free'}</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  urgency === 'express'
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-neutral-800 bg-neutral-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="urgency"
                    value="express"
                    checked={urgency === 'express'}
                    onChange={() => setUrgency('express')}
                    className="accent-amber-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{lang === 'gu' ? 'સુપર ફાસ્ટ (૬ કલાક)' : 'Super Fast (6 Hours)'}</span>
                      <Clock className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang === 'gu' ? 'પ્રાયોરિટી ઇમરજન્સી ડિલિવરી' : 'Emergency priority turnaround'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-400 tabular-nums">+₹150</span>
              </label>
            </div>
          </div>

          {/* Pricing Summary Calculation */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>{lang === 'gu' ? 'ડિઝાઇન / એડિટિંગ બેઝ ભાવ:' : 'Base Service Rate:'}</span>
              <span className="text-white tabular-nums font-semibold">₹{base}</span>
            </div>
            {express > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>{lang === 'gu' ? 'સુપર ફાસ્ટ ડિલિવરી ચાર્જ:' : 'Express Priority Fee:'}</span>
                <span className="tabular-nums font-semibold">+₹{express}</span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
              <span>{lang === 'gu' ? 'કુલ અંદાજિત કિંમત:' : 'Estimated Total:'}</span>
              <span className="text-base text-amber-400 tabular-nums">₹{total}</span>
            </div>
          </div>

          {/* Submission Buttons */}
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleSendViaWhatsApp}
              type="button"
              className="py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-neutral-950" />
              <span>{lang === 'gu' ? 'વોટ્સએપ પર ઓર્ડર મોકલો' : 'Order via WhatsApp'}</span>
            </button>

            <button
              onClick={handleSaveOnlineOrder}
              type="button"
              className="py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'gu' ? 'ઓનલાઇન ઓર્ડર બુક કરો' : 'Book Order Online'}</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 text-center">
            {lang === 'gu'
              ? '🔒 કામ શરૂ કરતા પહેલા અમે તમારી સાથે વોટ્સએપ પર સેમ્પલ પ્રિવ્યુ શેર કરીશું.'
              : '🔒 We will share design proofs via WhatsApp before final delivery.'}
          </p>
        </form>
      </div>
    </div>
  );
};
