import { pushToDataLayer } from './dataLayer';

export interface BusinessData {
  business_id: string;
  business_name: string;
  business_category: string;
  is_premium: boolean;
}

const getPageInfo = () => {
  return {
    page_title: document.title || 'Vem Pra Penedo',
    page_location: window.location.href
  };
};

export const pushWhatsappClick = (business: BusinessData) => {
  pushToDataLayer({
    event: 'click_whatsapp',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: business.business_category,
    is_premium: business.is_premium,
    ...getPageInfo()
  });
};

export const pushInstagramClick = (business: BusinessData) => {
  pushToDataLayer({
    event: 'click_instagram',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: business.business_category,
    is_premium: business.is_premium,
    ...getPageInfo()
  });
};

export const pushPremiumCardClick = (business: Omit<BusinessData, 'is_premium'>, position: number) => {
  pushToDataLayer({
    event: 'premium_card_click',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: business.business_category,
    card_position: position,
    page_location: window.location.href
  });
};

export const pushSearch = (term: string, count: number) => {
  pushToDataLayer({
    event: 'portal_search',
    search_term: term,
    results_found: count,
    page_location: window.location.href
  });
};

export const pushBusinessPageView = (business: BusinessData) => {
  pushToDataLayer({
    event: 'business_page_view',
    business_id: business.business_id,
    business_name: business.business_name,
    business_category: business.business_category,
    is_premium: business.is_premium
  });
};

export const pushScroll = (percentage: number, businessId?: string | null) => {
  pushToDataLayer({
    event: 'page_scroll',
    business_id: businessId || null,
    scroll_percentage: percentage,
    page_location: window.location.href
  });
};

export const pushPageEngagement = (seconds: number, businessId?: string | null) => {
  pushToDataLayer({
    event: 'page_engagement',
    business_id: businessId || null,
    engagement_time: seconds,
    page_location: window.location.href
  });
};

export const pushPageView = (path: string, title: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
    page_location: window.location.href
  });
};
