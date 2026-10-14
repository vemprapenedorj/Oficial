export const EVENT_CATEGORY_LABELS = {
  cultura: 'Cultura', gastronomia: 'Gastronomia', comemoracoes: 'Comemorações',
  'atracoes-sazonais': 'Atrações sazonais', esportes: 'Esportes',
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORY_LABELS;

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  category: EventCategory;
  published: boolean;
  image?: string;
  imageAlt?: string;
  locationName?: string;
  locationAddress?: string;
  locality?: string;
  municipality?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  expectedMonth?: string;
  startTime?: string;
  endTime?: string;
  organizerName?: string;
  entryText?: string;
  price?: number;
  ticketUrl?: string;
  officialUrl?: string;
  sourceName?: string;
  updatedAt?: string;
}
