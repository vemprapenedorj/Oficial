import { EVENT_CATEGORY_LABELS, type EventCategory, type EventRecord } from './types';
import { getPublishedEvents } from './catalog';
import { normalizeSearchText } from '../utils/search';

export function getPenedoDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function getEventStatus(event: EventRecord, today: string): 'upcoming' | 'ongoing' | 'past' | 'unconfirmed' {
  if (!event.startDate) return 'unconfirmed';
  if (today < event.startDate) return 'upcoming';
  return today > (event.endDate || event.startDate) ? 'past' : 'ongoing';
}

export interface EventFilters { category?: EventCategory; year?: number }
const endDate = (event: EventRecord) => event.endDate || event.startDate || '';
const byTitle = (a: EventRecord, b: EventRecord) => a.title.localeCompare(b.title, 'pt-BR') || a.slug.localeCompare(b.slug);
const yearsOf = (event: EventRecord): number[] => {
  if (!event.startDate) return event.expectedMonth ? [Number(event.expectedMonth.slice(0, 4))] : event.expectedYear ? [event.expectedYear] : [];
  const start = Number(event.startDate.slice(0, 4));
  const end = Number(endDate(event).slice(0, 4));
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function getEventGroups(events: readonly EventRecord[], today: string, filters: EventFilters = {}) {
  const filtered = getPublishedEvents(events).filter(event => (!filters.category || event.category === filters.category)
    && (!filters.year || yearsOf(event).includes(filters.year)));
  return {
    active: filtered.filter(e => ['ongoing', 'upcoming'].includes(getEventStatus(e, today))).sort((a, b) =>
      Number(getEventStatus(b, today) === 'ongoing') - Number(getEventStatus(a, today) === 'ongoing')
      || a.startDate!.localeCompare(b.startDate!) || byTitle(a, b)),
    unconfirmed: filtered.filter(e => getEventStatus(e, today) === 'unconfirmed').sort((a, b) => (a.expectedMonth || (a.expectedYear ? `${a.expectedYear}-99` : '9999')).localeCompare(b.expectedMonth || (b.expectedYear ? `${b.expectedYear}-99` : '9999')) || byTitle(a, b)),
    past: filtered.filter(e => getEventStatus(e, today) === 'past').sort((a, b) => endDate(b).localeCompare(endDate(a)) || byTitle(a, b)),
  };
}

export const getFeaturedEvents = (events: readonly EventRecord[], today: string, limit = 4): EventRecord[] => getEventGroups(events, today).active.slice(0, limit);
export const getEventYears = (events: readonly EventRecord[]): number[] => [...new Set(getPublishedEvents(events).flatMap(yearsOf))].sort((a, b) => b - a);

export function searchEvents(events: readonly EventRecord[], query: string): EventRecord[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return getPublishedEvents(events).filter(e => normalizeSearchText([e.title, e.summary, ...e.description, EVENT_CATEGORY_LABELS[e.category], e.locationName, e.locality, e.municipality].filter(Boolean).join(' ')).includes(normalized));
}

export function getEventBadge(event: EventRecord, today: string): string {
  const status = getEventStatus(event, today);
  if (status === 'past') return 'Evento encerrado';
  if (status === 'ongoing') return 'Em cartaz';
  if (status === 'unconfirmed') return 'Programação a confirmar';
  const current = new Date(`${today}T12:00:00Z`);
  const day = current.getUTCDay() || 7;
  const saturday = new Date(current);
  saturday.setUTCDate(current.getUTCDate() + 6 - day);
  const sunday = new Date(saturday);
  sunday.setUTCDate(saturday.getUTCDate() + 1);
  return [saturday, sunday].some(d => d.toISOString().slice(0, 10) === event.startDate) ? 'Neste fim de semana' : 'Em breve';
}

const dateLabel = (date: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
export function formatEventDates(event: EventRecord): string {
  if (!event.startDate) {
    if (!event.expectedMonth) return event.expectedYear ? `${event.expectedYear} — data a confirmar` : 'Data a confirmar';
    const month = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${event.expectedMonth}-01T12:00:00Z`));
    return `${month.charAt(0).toUpperCase()}${month.slice(1)} — data a confirmar`;
  }
  return event.endDate && event.endDate !== event.startDate ? `${dateLabel(event.startDate)} a ${dateLabel(event.endDate)}` : dateLabel(event.startDate);
}

export function formatEventLocation(event: EventRecord): string {
  const parts = [event.locationName, event.locality, event.municipality].filter((p): p is string => !!p);
  const unique = parts.filter((p, i) => parts.findIndex(candidate => normalizeSearchText(candidate) === normalizeSearchText(p)) === i);
  if (event.state && event.municipality) unique[unique.length - 1] += ` / ${event.state}`;
  return unique.join(' — ') || 'Local a confirmar';
}
