import { pushToDataLayer } from './dataLayer';

export interface BusinessData {
  business_id: string;
  business_name: string;
  business_category: string;
  is_premium: boolean;
}

/**
 * Normalizes categories: Hospedagem -> Hotel, Gastronomia -> Restaurante, Shopping -> Lojas, etc.
 */
function normalizeCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'Hospedagem': 'Hotel',
    'Gastronomia': 'Restaurante',
    'Shopping': 'Lojas',
    'Natureza': 'Atrações',
    'Cultura': 'Atrações'
  };
  return categoryMap[category] || category;
}

/**
 * Returns current page title and full location URL.
 */
function getPageInfo() {
  return {
    page_title: document.title || 'Vem Pra Penedo',
    page_location: window.location.href
  };
}

/**
 * 1. click_whatsapp
 * Triggered on any WhatsApp link click (e.g. business card, detail page, category pages).
 */
export function pushWhatsappClick(business: BusinessData): void {
  pushToDataLayer({
    event: 'click_whatsapp',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: normalizeCategory(business.business_category),
    is_premium: business.is_premium,
    ...getPageInfo()
  });
}

/**
 * 2. click_instagram
 * Triggered on any Instagram link click.
 */
export function pushInstagramClick(business: BusinessData): void {
  pushToDataLayer({
    event: 'click_instagram',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: normalizeCategory(business.business_category),
    is_premium: business.is_premium,
    ...getPageInfo()
  });
}

/**
 * 3. premium_card_click
 * Triggered when clicking a card in the "Destaques Premium" section.
 */
export function pushPremiumCardClick(business: Omit<BusinessData, 'is_premium'>, position: number): void {
  pushToDataLayer({
    event: 'premium_card_click',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: normalizeCategory(business.business_category),
    card_position: position,
    page_location: window.location.href
  });
}

/**
 * 4. portal_search
 * Triggered when the user searches the portal.
 */
export function pushSearch(searchTerm: string, resultsFound: number): void {
  pushToDataLayer({
    event: 'portal_search',
    search_term: searchTerm,
    results_found: resultsFound,
    page_location: window.location.href
  });
}

/**
 * 5. business_page_view
 * Triggered when an exclusive partner detail page is rendered.
 */
export function pushBusinessPageView(business: BusinessData): void {
  pushToDataLayer({
    event: 'business_page_view',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: normalizeCategory(business.business_category),
    is_premium: business.is_premium
  });
}

/**
 * 6. page_scroll
 * Triggered automatically at scroll depths (25%, 50%, 75%, 100%).
 */
export function pushScroll(percentage: number, businessId: string | null): void {
  pushToDataLayer({
    event: 'page_scroll',
    business_id: businessId || null,
    scroll_percentage: percentage,
    page_location: window.location.href
  });
}

/**
 * 7. page_engagement
 * Triggered automatically when the user spends 30s, 60s, 120s on a page.
 */
export function pushPageEngagement(seconds: number, businessId: string | null): void {
  pushToDataLayer({
    event: 'page_engagement',
    business_id: businessId || null,
    engagement_time: seconds,
    page_location: window.location.href
  });
}

/**
 * SPA page_view event.
 * Triggered automatically on hash/route change.
 */
export function pushPageView(path: string, title: string): void {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
    page_location: window.location.href
  });
}
