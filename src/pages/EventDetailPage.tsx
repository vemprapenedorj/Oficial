import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, ExternalLink, ArrowLeft, Instagram } from 'lucide-react';
import SEO from '../components/SEO';
import Page404 from '../components/Page404';
import { EVENTS } from '../events/catalog';
import { EventArtwork } from '../events/EventCard';
import { EVENT_CATEGORY_LABELS, type EventRecord } from '../events/types';
import { formatEventDates, formatEventLocation, getEventBadge, getEventStatus } from '../events/eventUtils';
import { useEventToday } from '../events/useEventToday';
import { getEventSEO } from '../events/eventSEO';
import { getCanonicalUrl } from '../seo/utils/seoUtils';

export function EventDetailPage({ events = EVENTS }: { events?: readonly EventRecord[] }) {
  const { slug } = useParams<{ slug: string }>();
  const today = useEventToday();
  const event = events.find(item => item.published && item.slug === slug);
  if (!event) return <><SEO title="Evento não encontrado | Vem Pra Penedo" canonical={getCanonicalUrl('/404/')} robots="noindex, follow" /><Page404 onNavigate={() => {}} /></>;
  const past = getEventStatus(event, today) === 'past';
  return <article className="bg-[#f6f8f6] min-h-screen pt-28 pb-20">
    <SEO {...getEventSEO(event, today)} />
    <div className="max-w-7xl mx-auto px-4">
      <nav aria-label="Caminho de navegação" className="flex flex-wrap gap-2 text-sm text-gray-600 mb-8"><Link to="/" className="hover:underline">Início</Link><span aria-hidden="true">/</span><Link to="/eventos/" className="hover:underline">Eventos</Link><span aria-hidden="true">/</span><span className="[overflow-wrap:anywhere]">{event.title}</span></nav>
      <div className="flex flex-wrap items-center gap-3 mb-5"><span className="text-xs font-bold uppercase tracking-widest text-penedo-forest">{EVENT_CATEGORY_LABELS[event.category]}</span><span className="rounded-full bg-penedo-mint px-3 py-1 text-xs font-semibold text-penedo-forest">{getEventBadge(event, today)}</span></div>
      <h1 className="text-3xl md:text-5xl font-bold text-penedo-forest max-w-4xl leading-tight tracking-tight [overflow-wrap:anywhere]">{event.title}</h1>
      <p className="mt-5 mb-9 text-lg text-gray-600 max-w-3xl leading-relaxed">{event.summary}</p>
      {event.scheduleNotice && <aside className="mb-9 max-w-4xl rounded-2xl border border-penedo-gold/60 bg-[#fff9e8] px-5 py-4 sm:px-6" aria-label="Atualização sobre a data do evento">
        <p className="flex items-center gap-2 font-bold text-penedo-forest"><CalendarDays size={20} aria-hidden="true" />Data da próxima edição ainda não definida</p>
        <p className="mt-2 text-gray-700 leading-relaxed">{event.scheduleNotice}</p>
      </aside>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <div className="rounded-3xl overflow-hidden border border-penedo-forest/10"><EventArtwork key={event.id} event={event} past={past} /></div>
        <section aria-label="Informações do evento" className="rounded-3xl bg-white border border-penedo-forest/10 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-penedo-forest mb-6">Para se programar</h2>
          <dl className="space-y-6 text-gray-700">
            <div><dt className="flex items-center gap-2 font-bold text-penedo-forest"><CalendarDays size={19} aria-hidden="true" />Data</dt><dd className="mt-2">{formatEventDates(event)}</dd></div>
            <div><dt className="flex items-center gap-2 font-bold text-penedo-forest"><MapPin size={19} aria-hidden="true" />Local</dt><dd className="mt-2 [overflow-wrap:anywhere]">{formatEventLocation(event)}{event.locationAddress && <span className="block mt-1 text-sm">{event.locationAddress}</span>}</dd></div>
            {event.startTime && <div><dt className="flex gap-2 items-center font-bold text-penedo-forest"><Clock size={19} aria-hidden="true" />Horário</dt><dd className="mt-2">{event.startTime}{event.endTime ? ` às ${event.endTime}` : ''}</dd></div>}
            {(event.entryText || event.price !== undefined) && <div><dt className="font-bold text-penedo-forest">Entrada</dt><dd className="mt-2">{event.entryText || (event.price === 0 ? 'Gratuita' : event.price!.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</dd></div>}
            {event.organizerName && <div><dt className="font-bold text-penedo-forest">Organização</dt><dd className="mt-2">{event.organizerName}</dd></div>}
            {event.instagramUrl && <div><dt className="flex gap-2 items-center font-bold text-penedo-forest"><Instagram size={19} aria-hidden="true" />Instagram oficial</dt><dd className="mt-2"><a href={event.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-penedo-forest underline underline-offset-4 hover:text-penedo-forest/80 font-semibold">@{event.instagramUrl.replace(/\/$/, '').split('/').pop()}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> — abre no Instagram em nova aba</span></a></dd></div>}
          </dl>
          {!past && event.ticketUrl && <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="inline-flex mt-7 items-center gap-2 bg-penedo-forest text-white rounded-full px-6 py-3 font-semibold">Consultar ingressos<ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> — nova aba</span></a>}
          {past && <div className="mt-7 pt-6 border-t border-gray-200"><p className="text-sm text-gray-600 mb-3">Este evento faz parte do histórico da agenda.</p><Link to="/eventos/" className="text-penedo-forest font-bold underline underline-offset-4">Confira a programação atual</Link></div>}
        </section>
      </div>
      <section className="max-w-3xl mt-12" aria-labelledby="event-about"><h2 id="event-about" className="text-2xl font-bold text-penedo-forest mb-5">Sobre o evento</h2>
        {event.description.map((paragraph, index) => <p key={index} className="text-gray-600 leading-relaxed mb-4 [overflow-wrap:anywhere]">{paragraph}</p>)}
        {event.officialUrl && <a href={event.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center text-penedo-forest underline underline-offset-4 mt-4">{event.sourceName ? `Fonte: ${event.sourceName}` : 'Informações oficiais'}<ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> — nova aba</span></a>}
        {event.updatedAt && <p className="text-xs text-gray-500 mt-3">Informações registradas em {event.updatedAt.split('-').reverse().join('/')}.</p>}
      </section>
      <Link to="/eventos/" className="inline-flex gap-2 items-center text-penedo-forest font-semibold mt-12 hover:underline"><ArrowLeft size={18} aria-hidden="true" />Voltar para a agenda</Link>
    </div>
  </article>;
}
