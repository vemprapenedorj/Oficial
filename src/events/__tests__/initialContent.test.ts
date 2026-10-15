import assert from 'node:assert/strict';
import test from 'node:test';
import { EVENTS } from '../catalog';

test('seleção inicial tem 17 eventos, dois mensais, fonte e nenhum município excluído', () => {
  assert.equal(EVENTS.length, 17);
  assert.equal(EVENTS.filter(e => e.expectedMonth && !e.startDate).length, 2);
  assert.equal(new Set(EVENTS.map(e => e.slug)).size, 17);
  for (const event of EVENTS) {
    assert.ok(event.officialUrl && event.sourceName && event.published);
    assert.doesNotMatch([event.municipality, event.locality, event.locationName].join(' '), /Quatis|Porto Real/i);
    assert.equal(event.price, undefined);
    assert.equal(event.organizerName, undefined);
  }
  const truta = EVENTS.find(e => e.title.includes('Truta'))!;
  assert.equal(truta.startDate, '2026-10-02');
  assert.equal(truta.endDate, '2026-11-01');
});
