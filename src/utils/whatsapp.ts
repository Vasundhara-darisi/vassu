/**
 * Centralized WhatsApp utility for reliable redirect and pre-filled message delivery
 * across all platforms (WhatsApp Web, Desktop app, iOS, Android).
 */

export const DEFAULT_WHATSAPP_PHONE = '917729805155';
export const DEFAULT_WHATSAPP_MESSAGE = 'Hi Vasundhara! I saw your portfolio and would like to connect.';

/**
 * Clean and format the phone number with country code
 */
export const formatWhatsAppNumber = (phone?: string): string => {
  if (!phone) return DEFAULT_WHATSAPP_PHONE;
  let clean = phone.replace(/[^0-9]/g, '');
  
  // If 10 digits (standard Indian number without country code), prepend 91
  if (clean.length === 10) {
    clean = '91' + clean;
  } else if (clean.startsWith('0') && clean.length === 11) {
    clean = '91' + clean.slice(1);
  }

  return clean || DEFAULT_WHATSAPP_PHONE;
};

/**
 * Generate a cross-platform WhatsApp URL with pre-filled message
 */
export const getWhatsAppUrl = (phone?: string, text?: string): string => {
  const formattedPhone = formatWhatsAppNumber(phone);
  const message = (text && text.trim().length > 0) ? text.trim() : DEFAULT_WHATSAPP_MESSAGE;

  // api.whatsapp.com/send works reliably across all mobile apps & web browsers without dropping the message
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
};

/**
 * Open WhatsApp in a new tab/window with pre-filled message
 */
export const openWhatsAppChat = (phone?: string, text?: string): void => {
  const url = getWhatsAppUrl(phone, text);
  window.open(url, '_blank', 'noopener,noreferrer');
};
