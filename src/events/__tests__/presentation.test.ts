import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { EventCard } from '../EventCard';
import { EventsHighlight } from '../EventsHighlight';
import { EventsPage } from '../../pages/EventsPage';
import { EventDetailPage } from '../../pages/EventDetailPage';
import { REGIONAL_CALENDAR } from '../eventSources';
import { makeEvent } from './fixtures';

const render = (element: React.ReactElement, route = '/') => renderToStaticMarkup(
  React.createElement(HelmetProvider, null, React.createElement(MemoryRouter, { initialEntries: [route] }, element)));

test('card mostra data, localização e link permanente', () => {
  const html = render(React.createElement(EventCard, { event: makeEvent(), today: '2026-10-14' }));
  assert.match(html, /Encontro de teste/);
  assert.match(html, /14 de outubro de 2026/);
  assert.match(html, /href="\/eventos\/evento-teste-2026\/"/);
  assert.match(html, /Penedo/);
});

test('arte de evento encerrado aparece em cinza sem alterar a edição futura', () => {
  const event = makeEvent({ image: '/assets/imagens/eventos/edicao.webp', startDate: '2026-10-03' });
  const past = render(React.createElement(EventCard, { event, today: '2026-10-16' }));
  const upcoming = render(React.createElement(EventCard, { event, today: '2026-10-01' }));
  assert.match(past, /grayscale contrast-90/);
  assert.doesNotMatch(upcoming, /grayscale contrast-90/);
});

test('agenda e destaque vazios preservam calendário e crédito', () => {
  const home = render(React.createElement(EventsHighlight, { events: [] }));
  assert.match(home, /Ver agenda completa/);
  assert.match(home, /Novas experiências estão chegando/);
  const html = render(React.createElement(EventsPage, { events: [] }));
  assert.match(html, /Agenda de Eventos/);
  assert.match(html, /A programação de Penedo e região será divulgada aqui/);
  assert.ok(html.includes(REGIONAL_CALENDAR.url));
  assert.ok(html.includes(REGIONAL_CALENDAR.sourceUrl));
  assert.doesNotMatch(html, /<iframe/);
});

test('detalhe histórico remove compra e desconhecido mostra 404', () => {
  const event = makeEvent({ startDate: '2020-01-01', ticketUrl: 'https://example.com/ingressos' });
  const element = (events: typeof event[]) => React.createElement(Routes, null,
    React.createElement(Route, { path: '/eventos/:slug', element: React.createElement(EventDetailPage, { events }) }));
  const html = render(element([event]), '/eventos/evento-teste-2026/');
  assert.match(html, /Evento encerrado/);
  assert.ok(!html.includes(event.ticketUrl!));
  assert.match(html, /Encontro de teste/);
  const missing = render(element([]), '/eventos/inexistente/');
  assert.match(missing, /404/);
});

test('detalhe de edição sem data destaca aviso da organização', () => {
  const event = makeEvent({ startDate: undefined, expectedYear: 2027, scheduleNotice: 'As datas propostas para 2027 ainda não foram confirmadas.' });
  const html = render(React.createElement(Routes, null,
    React.createElement(Route, { path: '/eventos/:slug', element: React.createElement(EventDetailPage, { events: [event] }) })), '/eventos/evento-teste-2026/');
  assert.match(html, /Data da próxima edição ainda não definida/);
  assert.match(html, /As datas propostas para 2027 ainda não foram confirmadas/);
  assert.match(html, /2027 — data a confirmar/);
});
