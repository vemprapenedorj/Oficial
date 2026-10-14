import { EVENT_CATEGORY_LABELS, type EventRecord } from './types';
import { normalizeSearchText } from '../utils/search';

const validDate = (value: unknown): value is string => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;

export function validateEvents(input: unknown): EventRecord[] {
  if (!Array.isArray(input)) throw new Error('O cadastro de eventos deve ser uma lista.');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  return input.map((raw, index) => {
    const fail = (field: string): never => { throw new Error(`Evento ${index + 1} (${raw?.id || 'sem id'}): ${field} inválido.`); };
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail('registro');
    for (const key of ['id', 'slug', 'title', 'summary']) {
      if (typeof raw[key] !== 'string' || !raw[key].trim()) fail(key);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug) || slugs.has(raw.slug)) fail('slug duplicado ou formato');
    if (ids.has(raw.id)) fail('id duplicado');
    ids.add(raw.id); slugs.add(raw.slug);
    if (!Object.hasOwn(EVENT_CATEGORY_LABELS, raw.category)) fail('category');
    if (typeof raw.published !== 'boolean') fail('published');
    if (!Array.isArray(raw.description) || !raw.description.length || raw.description.some((p: unknown) => typeof p !== 'string' || !p.trim())) fail('description');
    for (const key of ['image', 'imageAlt', 'locationName', 'locationAddress', 'locality', 'municipality', 'state', 'organizerName', 'entryText', 'sourceName']) {
      if (raw[key] !== undefined && (typeof raw[key] !== 'string' || !raw[key].trim())) fail(key);
    }
    for (const key of ['startDate', 'endDate', 'updatedAt']) if (raw[key] !== undefined && !validDate(raw[key])) fail(key);
    if (raw.endDate && (!raw.startDate || raw.endDate < raw.startDate)) fail('endDate');
    if (raw.expectedMonth !== undefined && (!/^\d{4}-(0[1-9]|1[0-2])$/.test(raw.expectedMonth) || raw.startDate || raw.endDate)) fail('expectedMonth');
    for (const key of ['startTime', 'endTime']) {
      if (raw[key] !== undefined && (typeof raw[key] !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(raw[key]) || !raw.startDate)) fail(key);
    }
    if (raw.state !== undefined && !/^[A-Z]{2}$/.test(raw.state)) fail('state');
    const municipality = normalizeSearchText(raw.municipality || '').replace(/\s+/g, ' ');
    if (['quatis', 'porto real'].includes(municipality)) fail('município fora do recorte');
    if (raw.price !== undefined && (typeof raw.price !== 'number' || !Number.isFinite(raw.price) || raw.price < 0)) fail('price');
    for (const key of ['ticketUrl', 'officialUrl']) {
      if (raw[key] === undefined) continue;
      try { if (typeof raw[key] !== 'string' || !['http:', 'https:'].includes(new URL(raw[key]).protocol)) fail(key); }
      catch { fail(key); }
    }
    if (raw.sourceName && !raw.officialUrl) fail('officialUrl da fonte');
    if (raw.image && (!raw.image.startsWith('/assets/') || /\.\.|[\\?#%]/.test(raw.image))) fail('image');
    return raw as EventRecord;
  });
}
