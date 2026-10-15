import type { EventRecord } from './types';

export function getEventImages(event: EventRecord): { src: string; alt: string }[] {
  if (event.images?.length) return event.images;
  return event.image ? [{ src: event.image, alt: event.imageAlt || event.title }] : [];
}
