import React, { useState } from 'react';
import { Order, CreatorProfile, Language } from '../types';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import { CheckCircle2, MessageCircle, Copy, Check, X, QrCode } from 'lucide-react';

interface OrderReceiptModalProps {
  order: Order | null;
  creator: CreatorProfile;
  lang: Language;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  creator,
  lang,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!order) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = () => {
    const url = generateWhatsAppOrderUrl(order, creator, lang);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">
            {lang === 'gu' ? 'ઓર્ડર સફળતાપૂર્વક નોંધાયો!' : 'Order Placed Successfully!'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {lang === 'gu'
              ? 'અમારો ડિઝાઇનર ટૂંક સમયમાં તમારો સંપર્ક કરશે.'
              : 'Our creator is reviewing your project details.'}
          </p>
        </div>

        {/* Receipt Container */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
            <span className="text-neutral-400">{lang === 'gu' ? 'ઓર્ડર નંબર:' : 'Order ID:'}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 text-sm">{order.id}</span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">{lang === 'gu' ? 'ગ્રાહક:' : 'Client:'}</span>
            <span className="font-semibold text-white">{order.clientName} ({order.phone})</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">{lang === 'gu' ? 'સર્વિસ:' : 'Service:'}</span>
            <span className="font-semibold text-white">{order.serviceCategoryLabel || order.serviceCategory}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">{lang === 'gu' ? 'ડિલિવરી સ્પીડ:' : 'Turnaround:'}</span>
            <span className="text-white font-medium">
              {order.urgency === 'express'
                ? (lang === 'gu' ? '૬ કલાક એક્સપ્રેસ' : '6 Hours Express')
                : (lang === 'gu' ? 'સામાન્ય (૨૪-૪૮ કલાક)' : 'Standard 24-48h')}
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold">
            <span className="text-neutral-300">{lang === 'gu' ? 'કુલ રકમ:' : 'Total Amount:'}</span>
            <span className="text-amber-400 text-base tabular-nums">₹{order.estimatedPrice}</span>
          </div>
        </div>

        {/* Designer UPI Info */}
        <div className="p-3.5 rounded-xl bg-neutral-800/40 border border-neutral-800 mb-6 flex items-center justify-between text-xs">
          <div>
            <div className="text-[11px] text-neutral-400">{lang === 'gu' ? 'પેમેન્ટ UPI ID (કામ એપ્રૂવ થયા પછી):' : 'UPI ID for Payment (After Approval):'}</div>
            <div className="font-mono text-white font-bold">{creator.upiId}</div>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">{lang === 'gu' ? 'GPay / PhonePe / Paytm' : 'All UPI Apps'}</span>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleSendWA}
            type="button"
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <MessageCircle className="w-4 h-4 fill-neutral-950" />
            <span>{lang === 'gu' ? 'આ ઓર્ડર વોટ્સએપ પર પણ મોકલો' : 'Notify Designer on WhatsApp'}</span>
          </button>

          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer text-center"
          >
            {lang === 'gu' ? 'ઠીક છે, બંધ કરો' : 'Done & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
