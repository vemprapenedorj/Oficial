/** Official contact channel used across the Vem Pra Penedo portal. */
export const OFFICIAL_WHATSAPP_NUMBER = '5524992087767';

export const getOfficialWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
