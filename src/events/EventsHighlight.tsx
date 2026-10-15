import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENTS } from './catalog';
import type { EventRecord } from './types';
import { getFeaturedEvents } from './eventUtils';
import { useEventToday } from './useEventToday';
import { EventCard } from './EventCard';
import { REGIONAL_CALENDAR } from './eventSources';

export function EventsHighlight({ events = EVENTS }: { events?: readonly EventRecord[] }) {
  const today = useEventToday();
  const featured = getFeaturedEvents(events, today);
  return <section className="bg-[#f6f8f6] py-14 md:py-20" aria-labelledby="events-highlight-title" data-events-highlight>
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-penedo-forest/70 mb-3">Programe sua visita</p><h2 id="events-highlight-title" className="text-3xl md:text-4xl font-bold text-penedo-forest">Acontece em Penedo e região</h2><p className="mt-4 text-gray-600 leading-relaxed">Eventos, comemorações e experiências para aproveitar Penedo e a região em cada época do ano.</p></div>
        <Link to="/eventos/" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-penedo-forest px-6 py-3 text-white font-semibold hover:bg-penedo-forest/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-penedo-forest">Ver agenda completa <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      {featured.length ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{featured.map(event => <EventCard key={event.id} event={event} today={today} />)}</div> : <p className="rounded-2xl border border-penedo-forest/10 bg-white p-8 text-gray-600">Novas experiências estão chegando. Acompanhe a agenda de Penedo e região.</p>}
      <a href={REGIONAL_CALENDAR.url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center text-sm text-penedo-forest underline underline-offset-4 mt-7 focus-visible:outline-2 focus-visible:outline-offset-4">Calendário regional 2026 (PDF) <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> — abre em nova aba</span></a>
    </div>
  </section>;
}
