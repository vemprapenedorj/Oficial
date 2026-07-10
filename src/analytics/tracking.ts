import { pushToDataLayer } from './dataLayer';

/**
 * Google Analytics Event Tracking Helper (Redirected to GTM Data Layer)
 */
export const trackEvent = (action: string, category: string, label: string) => {
  const categoryMap: Record<string, string> = {
    'Hospedagem': 'Hotel',
    'Gastronomia': 'Restaurante',
    'Shopping': 'Lojas',
    'Natureza': 'Atrações',
    'Cultura': 'Atrações'
  };
  
  const finalCategory = categoryMap[category] || category;

  pushToDataLayer({
    event: 'custom_event',
    eventAction: action,
    eventCategory: finalCategory,
    eventLabel: label
  });
};
