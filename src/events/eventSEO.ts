import type React from 'react';
import type SEO from '../components/SEO';
import type { EventRecord } from './types';
import { getPublishedEvents } from './catalog';
import { getCanonicalUrl } from '../seo/utils/seoUtils';
import { getBreadcrumbSchema } from '../schema/breadcrumb';
import { getEventSchema } from '../schema/event';
import { getEventImages } from './eventImages';

const breadcrumbs = [{ name: 'Início', item: getCanonicalUrl('/') }, { name: 'Eventos', item: getCanonicalUrl('/eventos/') }];

export function getEventsSEO(events: readonly EventRecord[]): React.ComponentProps<typeof SEO> {
  return {
    title: 'Agenda de Eventos — Penedo e Região | Vem Pra Penedo',
    description: 'Veja eventos, comemorações e atrações sazonais de Penedo, Mauá, Resende e entorno. Consulte a programação, as datas e o histórico de eventos.',
    canonical: getCanonicalUrl('/eventos/'),
    schema: [getBreadcrumbSchema(breadcrumbs), {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Agenda de Eventos — Penedo e Região', url: getCanonicalUrl('/eventos/'),
      mainEntity: { '@type': 'ItemList', itemListElement: getPublishedEvents(events).map((event, i) => ({ '@type': 'ListItem', position: i + 1, name: event.title, url: getCanonicalUrl(`/eventos/${event.slug}/`) })) },
    }],
  };
}

export function getEventSEO(event: EventRecord, today: string): React.ComponentProps<typeof SEO> {
  const canonical = getCanonicalUrl(`/eventos/${event.slug}/`);
  const schema = getEventSchema(event, today);
  const cover = getEventImages(event)[0];
  return {
    title: `${event.title} | Agenda Penedo e Região`, description: event.summary, canonical,
    ...(cover ? { image: getCanonicalUrl(cover.src) } : {}),
    schema: [getBreadcrumbSchema([...breadcrumbs, { name: event.title, item: canonical }]), ...(schema ? [schema] : [])],
  };
}
