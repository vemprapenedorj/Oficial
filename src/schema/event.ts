import type { EventRecord } from '../events/types';
import { getEventStatus } from '../events/eventUtils';
import { getCanonicalUrl } from '../seo/utils/seoUtils';
import { getEventImages } from '../events/eventImages';

export function getEventSchema(event: EventRecord, today: string): Record<string, unknown> | null {
  if (!event.startDate || !event.locationName || !event.locationAddress || !event.municipality || !event.state) return null;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org', '@type': 'Event', name: event.title,
    url: getCanonicalUrl(`/eventos/${event.slug}/`), startDate: event.startDate,
    endDate: event.endDate || event.startDate, description: event.summary,
    location: { '@type': 'Place', name: event.locationName, address: {
      '@type': 'PostalAddress', streetAddress: event.locationAddress,
      addressLocality: event.municipality, addressRegion: event.state, addressCountry: 'BR',
    } },
  };
  const images = getEventImages(event);
  if (images.length) schema.image = images.map(image => getCanonicalUrl(image.src));
  if (event.organizerName) schema.organizer = { '@type': 'Organization', name: event.organizerName };
  if (event.price !== undefined && event.ticketUrl && getEventStatus(event, today) !== 'past') {
    schema.offers = { '@type': 'Offer', price: event.price, priceCurrency: 'BRL', url: event.ticketUrl };
  }
  return schema;
}
