import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ExternalLink, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { EVENTS } from '../events/catalog';
import { EventCard } from '../events/EventCard';
import { getEventGroups, getEventYears } from '../events/eventUtils';
import { getEventsSEO } from '../events/eventSEO';
import { useEventToday } from '../events/useEventToday';
import { EVENT_CATEGORY_LABELS, type EventCategory, type EventRecord } from '../events/types';
import { REGIONAL_CALENDAR } from '../events/eventSources';

export function EventsPage({ events = EVENTS }: { events?: readonly EventRecord[] }) {
  const today = useEventToday();
  const [category, setCategory] = useState<EventCategory | ''>('');
  const [year, setYear] = useState('');
  const groups = getEventGroups(events, today, { category: category || undefined, year: year ? Number(year) : undefined });
  const total = groups.active.length + groups.unconfirmed.length + groups.past.length;
  const clear = () => { setCategory(''); setYear(''); };
  const sections = [{ title: 'Em andamento e próximos', id: 'proximos', items: groups.active }, { title: 'Programação a confirmar', id: 'a-confirmar', items: groups.unconfirmed }, { title: 'Eventos anteriores', id: 'anteriores', items: groups.past }];
  let nextRow = 0;
  const sectionRows = sections.filter(section => section.items.length).map(section => ({
    ...section,
    rows: Array.from({ length: Math.ceil(section.items.length / 2) }, (_, index) => ({
      events: section.items.slice(index * 2, index * 2 + 2),
      stripe: nextRow++ % 2,
    })),
  }));
  return <div className="bg-[#f6f8f6] min-h-screen pb-20">
    <SEO {...getEventsSEO(events)} />
    <header className="relative isolate overflow-hidden bg-penedo-forest text-white pt-32 pb-12 md:pb-16">
      <img src="/assets/imagens/eventos/agenda-penedo-hero.webp" alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center] md:object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-penedo-forest/90 via-penedo-forest/75 to-penedo-forest/35" />
      <div className="relative max-w-7xl mx-auto px-4">
        <nav aria-label="Caminho de navegação" className="text-sm text-white/75 mb-8"><Link to="/" className="hover:underline">Início</Link><span className="mx-3" aria-hidden="true">/</span><span>Eventos</span></nav>
        <p className="text-penedo-gold uppercase text-xs tracking-[0.22em] font-bold mb-4">Penedo · Mantiqueira · Entorno</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Agenda de Eventos<br /><span className="text-penedo-mint">Penedo e Região</span></h1>
        <p className="text-white/80 mt-6 max-w-2xl text-lg leading-relaxed">Encontre um motivo a mais para vir. Cultura, sabores, encontros e celebrações em Penedo e nas localidades próximas.</p>
        <div className="flex flex-wrap gap-3 mt-8">{sections.filter(section => section.items.length).map(section => <a key={section.id} href={`#${section.id}`} className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4">{section.title}</a>)}</div>
      </div>
    </header>
    <div className="max-w-7xl mx-auto px-4">
      <aside aria-label="Calendário oficial" className="my-8 md:my-10 rounded-2xl bg-white border border-penedo-forest/10 p-5 sm:p-7 flex flex-col md:flex-row gap-5 md:items-center justify-between">
        <div className="flex items-start gap-4"><CalendarDays size={28} className="shrink-0 text-penedo-forest mt-1" aria-hidden="true" />
          <div><h2 className="font-bold text-penedo-forest text-lg">O calendário completo, direto da fonte</h2><p className="text-sm text-gray-600 mt-2 max-w-2xl">Calendário regional completo. Aqui no site, selecionamos eventos de Penedo e localidades próximas.</p><a href={REGIONAL_CALENDAR.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-penedo-forest underline underline-offset-2 inline-block mt-3">Fonte: Prefeitura de Itatiaia<span className="sr-only"> — Instagram, nova aba</span></a></div>
        </div>
        <a href={REGIONAL_CALENDAR.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold text-sm text-penedo-forest rounded-xl bg-penedo-mint/50 p-4 md:max-w-xs hover:bg-penedo-mint focus-visible:outline-2 focus-visible:outline-offset-4">Consultar calendário oficial de Itatiaia e região — 2026 (PDF)<ExternalLink size={18} className="shrink-0" aria-hidden="true" /><span className="sr-only"> — abre em nova aba</span></a>
      </aside>
      <div className="flex flex-wrap items-end gap-4 border-y border-penedo-forest/15 py-6 mb-12">
        <label className="flex flex-col gap-2 text-sm text-penedo-forest font-semibold grow sm:grow-0">Categoria
          <select value={category} onChange={e => setCategory(e.target.value as EventCategory | '')} className="bg-white border border-gray-300 rounded-xl px-4 py-3 min-h-12 focus:outline-2 focus:outline-penedo-forest"><option value="">Todas as categorias</option>{Object.entries(EVENT_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-penedo-forest font-semibold grow sm:grow-0">Ano
          <select value={year} onChange={e => setYear(e.target.value)} className="bg-white border border-gray-300 rounded-xl px-4 py-3 min-h-12 focus:outline-2 focus:outline-penedo-forest"><option value="">Todos os anos</option>{getEventYears(events).map(value => <option key={value} value={value}>{value}</option>)}</select>
        </label>
        {(category || year) && <button onClick={clear} className="min-h-12 px-4 text-sm text-penedo-forest underline underline-offset-4 focus-visible:outline-2">Limpar filtros</button>}
        <p aria-live="polite" className="sm:ml-auto py-3 text-sm text-gray-600">{total} {total === 1 ? 'evento encontrado' : 'eventos encontrados'}</p>
      </div>
      {!total && <div className="bg-white rounded-3xl border border-penedo-forest/10 p-8 text-center text-gray-600">{category || year ? 'Nenhum evento encontrado para estes filtros' : 'A programação de Penedo e região será divulgada aqui. Volte em breve para conferir as novidades.'}</div>}
    </div>
    {sectionRows.map(section => <section key={section.id} id={section.id} className="scroll-mt-28" aria-labelledby={`${section.id}-title`}>
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 flex items-center gap-4"><h2 id={`${section.id}-title`} className="text-2xl md:text-3xl font-bold text-penedo-forest">{section.title}</h2><span className="rounded-full border border-penedo-forest/20 px-3 py-1 text-sm text-penedo-forest">{section.items.length}</span></div>
        {section.rows.map((row, index) => <div key={`${section.id}-${index}`} className={row.stripe === 0 ? 'bg-nature-soft' : 'bg-white'} data-event-row>
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">{row.events.map(event => <EventCard key={event.id} event={event} today={today} />)}</div>
        </div>)}
      </section>)}
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <Link to="/" className="inline-flex items-center gap-2 text-penedo-forest font-semibold hover:underline">Continue explorando Penedo <ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </div>;
}
