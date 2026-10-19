import assert from 'node:assert/strict';
import test from 'node:test';
import { getPenedoDate, getEventStatus, getEventGroups, getFeaturedEvents, getEventYears, searchEvents, formatEventDates, formatEventLocation, getEventBadge } from '../eventUtils';
import { makeEvent } from './fixtures';

test('classifica pelo dia de São Paulo, incluindo último dia completo', () => {
  assert.equal(getPenedoDate(new Date('2026-10-15T02:59:59Z')), '2026-10-14');
  assert.equal(getPenedoDate(new Date('2026-10-15T03:00:00Z')), '2026-10-15');
  assert.equal(getEventStatus(makeEvent(), '2026-10-14'), 'ongoing');
  assert.equal(getEventStatus(makeEvent(), '2026-10-15'), 'past');
  assert.equal(getEventStatus(makeEvent(), '2026-10-13'), 'upcoming');
});

test('filtros consideram virada do ano e mês previsto sem inventar dias', () => {
  const virada = makeEvent({ startDate: '2026-12-30', endDate: '2027-01-02' });
  const monthly = makeEvent({ id: 'natal', startDate: undefined, expectedMonth: '2026-12' });
  const yearly = makeEvent({ id: 'motos', startDate: undefined, expectedYear: 2027 });
  assert.deepEqual(getEventYears([virada]), [2027, 2026]);
  assert.equal(getEventGroups([virada], '2026-10-14', { year: 2027 }).active.length, 1);
  assert.equal(getEventGroups([monthly], '2026-10-14', { year: 2026 }).unconfirmed.length, 1);
  assert.equal(getEventGroups([yearly], '2026-10-14', { year: 2027 }).unconfirmed.length, 1);
  assert.equal(getEventGroups([makeEvent({ startDate: undefined })], '2026-10-14', { year: 2026 }).unconfirmed.length, 0);
  assert.equal(formatEventDates(monthly), 'Dezembro de 2026 — data a confirmar');
  assert.equal(formatEventDates(yearly), '2027 — data a confirmar');
  assert.equal(getFeaturedEvents([monthly], '2026-10-14').length, 0);
});

test('destaques priorizam em andamento, limitam quatro e nunca mutam a coleção', () => {
  const events = [17, 18, 19, 14, 3, 22].map(day => makeEvent({ id: String(day), slug: `teste-${day}`, startDate: `2026-10-${String(day).padStart(2, '0')}` }));
  const before = JSON.stringify(events);
  assert.deepEqual(getFeaturedEvents(events, '2026-10-14').map(e => e.id), ['14', '17', '18', '19']);
  assert.equal(JSON.stringify(events), before);
  assert.equal(getEventGroups(events, '2026-10-14').past[0].id, '3');
  assert.equal(getFeaturedEvents([makeEvent({ published: false })], '2026-10-14').length, 0);
  assert.equal(getEventBadge(events[0], '2026-10-14'), 'Neste fim de semana');
});

test('busca sem acentos inclui localidades, exclui rascunhos e filtra categorias', () => {
  const event = makeEvent({ locality: 'Visconde de Mauá', municipality: 'Resende' });
  assert.equal(searchEvents([event], 'maua').length, 1);
  assert.equal(searchEvents([event], 'resende').length, 1);
  assert.equal(searchEvents([{ ...event, published: false }], 'resende').length, 0);
  assert.equal(getEventGroups([event], '2026-10-14', { category: 'esportes' }).active.length, 0);
  assert.equal(formatEventLocation(makeEvent({ locationName: 'Penedo' })), 'Penedo');
  assert.equal(formatEventLocation(makeEvent({ locality: undefined })), 'Local a confirmar');
  assert.match(formatEventDates(makeEvent()), /14 de outubro de 2026/);
});
