import { pushToDataLayer } from './dataLayer';

/** Google Analytics event helper routed through the GTM data layer. */
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
    event: action,
    event_category: finalCategory.toLowerCase(),
    event_label: label,
    page_location: window.location.href,
  });
};
