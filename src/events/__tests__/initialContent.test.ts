import assert from 'node:assert/strict';
import test from 'node:test';
import { EVENTS } from '../catalog';

test('seleção inicial tem 16 eventos, fonte e nenhum município excluído', () => {
  assert.equal(EVENTS.length, 16);
  assert.equal(EVENTS.filter(e => e.expectedMonth && !e.startDate).length, 0);
  assert.equal(new Set(EVENTS.map(e => e.slug)).size, 16);
  assert.equal(EVENTS.some(e => e.slug === 'temporada-de-natal-resende-12-2026'), false);
  assert.equal(EVENTS.some(e => e.slug === 'natal-itinerante-penedo-12-2026'), false);
  for (const event of EVENTS) {
    assert.ok(event.officialUrl && event.sourceName && event.published);
    assert.doesNotMatch([event.municipality, event.locality, event.locationName].join(' '), /Quatis|Porto Real/i);
    assert.equal(event.price, undefined);
    assert.equal(event.organizerName, undefined);
  }
  const truta = EVENTS.find(e => e.title.includes('Truta'))!;
  assert.equal(truta.startDate, '2026-10-02');
  assert.equal(truta.endDate, '2026-11-01');
  const bbq = EVENTS.find(e => e.slug === 'penedo-bbq-festival-2027')!;
  assert.equal(bbq.startDate, '2027-09-04');
  assert.equal(bbq.images?.length, 8);
  assert.equal(bbq.images?.filter(image => image.caption === 'Foto da edição de 2026').length, 7);
  const motos = EVENTS.find(e => e.slug === 'encontro-internacional-de-motociclistas-penedo-2027')!;
  assert.equal(motos.expectedYear, 2027);
  assert.equal(motos.startDate, undefined);
  assert.equal(motos.images?.length, 7);
  assert.ok(motos.images?.every(image => image.caption === 'Foto de edição anterior'));
});
