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
  mapUrl?: string;
  whatsapp?: string;
  instagram?: string;
  tags?: string[];
  isPremium?: boolean;
  is_premium?: boolean;
  badge?: string;
  tripadvisorUrl?: string;
  slug?: string;
  galeria?: string[];
  descricao_longa?: string;
  link_whatsapp?: string;
  link_instagram?: string;
  link_maps?: string;
  link_video?: string;
  link_booking?: string;
  tag_destaque?: string;
  date?: string;
}

export type Page = 'home' | 'o-que-fazer' | 'onde-ficar' | 'gastronomia' | 'compras' | 'blog' | 'contato' | 'premium-detail';
