export interface DetailItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  fullInfo: string;
  location?: string;
  hours?: string;
  rating?: number;
  mapsUrl?: string;
  whatsapp?: string;
  instagramUrl?: string;
  tags?: string[];
  isPremium?: boolean;
  badge?: string;
  tripadvisorUrl?: string;
  slug?: string;
  galeria?: string[];
  descricao_longa?: string;
  whatsappUrl?: string;
  videoUrl?: string;
  bookingUrl?: string;
  date?: string;
  latitude?: string;
  longitude?: string;
  googleProfileUrl?: string;
  reviewCount?: number;
  priceRange?: string;
  paymentAccepted?: string;
  currenciesAccepted?: string;
  email?: string;
  siteUrl?: string;
  seo_title?: string;
  seo_description?: string;
}

export type Page = 'home' | 'o-que-fazer' | 'onde-ficar' | 'gastronomia' | 'compras' | 'blog' | 'contato' | 'politica-de-privacidade' | 'politica-de-cookies' | 'premium-detail' | '404';
