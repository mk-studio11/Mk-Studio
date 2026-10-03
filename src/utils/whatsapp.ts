import { Order, CreatorProfile } from '../types';

export function generateWhatsAppOrderUrl(
  order: Partial<Order>,
  creator: CreatorProfile,
  lang: 'gu' | 'en' = 'gu'
): string {
  const cleanPhone = creator.whatsapp.replace(/[^0-9]/g, '');

  let text = '';
  if (lang === 'gu') {
    text = `*નવો ડિઝાઇન ઓર્ડર - ${order.id || 'નવો ઓર્ડર'}* 🎨🎬\n` +
      `---------------------------------\n` +
      `👤 *ગ્રાહકનું નામ:* ${order.clientName || 'N/A'}\n` +
      `📱 *મોબાઇલ નંબર:* ${order.phone || 'N/A'}\n` +
      `📍 *શહેર:* ${order.city || 'N/A'}\n` +
      `📌 *સર્વિસ:* ${order.serviceCategoryLabel || order.serviceCategory || 'પોસ્ટર / વિડિઓ'}\n` +
      (order.itemReferenceTitle ? `🖼️ *રેફરન્સ સેમ્પલ:* ${order.itemReferenceTitle}\n` : '') +
      `⏱️ *ડિલિવરી સ્પીડ:* ${order.urgency === 'express' ? 'સુપર ફાસ્ટ (૬ કલાક)' : 'સામાન્ય (૨૪-૪૮ કલાક)'}\n` +
      `💰 *અંદાજિત ભાવ:* ₹${order.estimatedPrice || 0}\n` +
      `---------------------------------\n` +
      `📝 *કામની વિગતો / લખાણ:*\n${order.requirementsText || 'નથી લખ્યું'}\n` +
      `---------------------------------\n` +
      `કૃપા કરીને આ ઓર્ડર કન્ફર્મ કરી આગળની વિગત જણાવો. આભાર! 🙏`;
  } else {
    text = `*NEW DESIGN ORDER - ${order.id || 'New Request'}* 🎨🎬\n` +
      `---------------------------------\n` +
      `👤 *Client Name:* ${order.clientName || 'N/A'}\n` +
      `📱 *Phone:* ${order.phone || 'N/A'}\n` +
      `📍 *City:* ${order.city || 'N/A'}\n` +
      `📌 *Service:* ${order.serviceCategoryLabel || order.serviceCategory || 'Poster / Video'}\n` +
      (order.itemReferenceTitle ? `🖼️ *Reference:* ${order.itemReferenceTitle}\n` : '') +
      `⏱️ *Delivery Urgency:* ${order.urgency === 'express' ? 'Express (6 Hours)' : 'Standard (24-48 Hours)'}\n` +
      `💰 *Estimated Price:* ₹${order.estimatedPrice || 0}\n` +
      `---------------------------------\n` +
      `📝 *Project Requirements / Copy:*\n${order.requirementsText || 'N/A'}\n` +
      `---------------------------------\n` +
      `Please confirm receipt and let me know next steps. Thank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateDirectInquiryUrl(creator: CreatorProfile, messageGu: string, messageEn: string, lang: 'gu' | 'en' = 'gu'): string {
  const cleanPhone = creator.whatsapp.replace(/[^0-9]/g, '');
  const msg = lang === 'gu' ? messageGu : messageEn;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}
