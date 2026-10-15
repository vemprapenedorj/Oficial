import React, { useState } from 'react';
import { ArrowUpRight, CalendarDays, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENT_CATEGORY_LABELS, type EventRecord } from './types';
import { formatEventDates, formatEventLocation, getEventBadge } from './eventUtils';
import { getEventImages } from './eventImages';
import { getEventPath } from '../routing/routeHelpers';

export function EventArtwork({ event, href }: { event: EventRecord; href?: string; key?: string }) {
  const images = getEventImages(event);
  const [index, setIndex] = useState(0);
  const activeIndex = images.length ? index % images.length : 0;
  const current = images[activeIndex];
  const changeImage = (step: number) => setIndex((activeIndex + step + images.length) % images.length);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const date = event.startDate || (event.expectedMonth ? `${event.expectedMonth}-01` : undefined);
  const month = date ? new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)) : 'Em breve';
  const artwork = <>
    {current && failedImage !== current.src ?
      <img src={current.src} alt={current.alt} width={600} height={400} loading="lazy" decoding="async" onError={() => setFailedImage(current.src)} className="h-full w-full object-contain" /> :
      <div className="h-full flex flex-col justify-between p-6 sm:p-9 text-penedo-forest" role="img" aria-label={`Programação de ${month}, sem cartaz disponível`}>
        <div className="flex items-center justify-between gap-4 border-b border-penedo-forest/15 pb-4"><span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">{EVENT_CATEGORY_LABELS[event.category]}</span><CalendarDays size={24} strokeWidth={1.5} aria-hidden="true" /></div>
        <div className="flex items-end justify-between gap-4"><div><span className="block text-[clamp(3rem,7vw,6rem)] font-bold tracking-tighter leading-none">{event.startDate ? event.startDate.slice(8) : 'Em breve'}</span><span className="block mt-2 text-lg sm:text-2xl capitalize">{month}{date && <span className="text-penedo-forest/60"> / {date.slice(0, 4)}</span>}</span></div><span className="h-12 w-1.5 rounded-full bg-penedo-gold" aria-hidden="true" /></div>
        <span className="text-xs uppercase tracking-widest text-penedo-forest/65">Agenda · Vem Pra Penedo</span>
      </div>}
  </>;
  return <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#eef3ef]" data-event-artwork role={images.length > 1 ? 'region' : undefined} aria-roledescription={images.length > 1 ? 'carrossel' : undefined} aria-label={images.length > 1 ? 'Imagens de ' + event.title : undefined}>
    {href ? <Link to={href} aria-label={'Ver evento: ' + event.title} className="block h-full focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-penedo-forest">{artwork}</Link> : artwork}
    {images.length > 1 && <>
      <button type="button" onClick={() => changeImage(-1)} aria-label="Imagem anterior" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 text-penedo-forest shadow-md w-11 h-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"><ChevronLeft size={24} aria-hidden="true" /></button>
      <button type="button" onClick={() => changeImage(1)} aria-label="Próxima imagem" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 text-penedo-forest shadow-md w-11 h-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2"><ChevronRight size={24} aria-hidden="true" /></button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex max-w-[80%] overflow-x-auto rounded-full bg-white/95 px-2 shadow-sm" aria-label="Selecionar imagem">
        {images.map((image, position) => <button type="button" key={image.src} onClick={() => setIndex(position)} aria-label={'Ver imagem ' + (position + 1)} aria-pressed={position === activeIndex} className="min-w-9 h-9 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-3px] rounded-full"><span className={'h-2 w-2 rounded-full ' + (position === activeIndex ? 'bg-penedo-forest' : 'bg-gray-400')} /></button>)}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">Imagem {activeIndex + 1} de {images.length}</span>
    </>}
  </div>;
}

export function EventCard({ event, today }: { event: EventRecord; today: string; key?: string }) {
  return <article className="min-w-0 overflow-hidden rounded-3xl border border-penedo-forest/10 bg-white shadow-sm" data-event-card>
    <EventArtwork key={event.id} event={event} href={getEventPath(event.slug)} />
    <div className="p-6 sm:p-8 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap gap-2 items-center mb-4"><span className="rounded-full bg-penedo-mint/70 px-3 py-1 text-xs font-semibold text-penedo-forest">{getEventBadge(event, today)}</span><span className="text-xs text-gray-600">{EVENT_CATEGORY_LABELS[event.category]}</span></div>
      <h3 className="text-2xl lg:text-[28px] font-bold leading-tight text-penedo-forest mb-4"><Link to={getEventPath(event.slug)} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">{event.title}</Link></h3>
      <p className="flex gap-2 text-sm font-semibold text-penedo-forest"><CalendarDays size={18} className="shrink-0 mt-0.5" aria-hidden="true" /><span>{formatEventDates(event)}</span></p>
      <p className="flex gap-2 text-sm text-gray-600 mt-2"><MapPin size={18} className="shrink-0 mt-0.5" aria-hidden="true" /><span>{formatEventLocation(event)}</span></p>
      <p className="mt-4 text-gray-600 leading-relaxed">{event.summary}</p>
      <Link to={getEventPath(event.slug)} className="inline-flex items-center gap-2 mt-6 font-bold text-penedo-forest underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">Ver programação <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> de {event.title}</span></Link>
    </div>
  </article>;
}
