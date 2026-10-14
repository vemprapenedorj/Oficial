import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEvents } from '../validation';
import { makeEvent } from './fixtures';

test('aceita catálogo vazio, preço desconhecido e programação mensal', () => {
  assert.deepEqual(validateEvents([]), []);
  assert.equal(validateEvents([makeEvent()])[0].price, undefined);
  assert.equal(validateEvents([makeEvent({ startDate: undefined, expectedMonth: '2026-12' })])[0].expectedMonth, '2026-12');
});

test('rejeita dados inválidos, duplicados e municípios fora do recorte', () => {
  for (const overrides of [
    { startDate: '2026-02-30' }, { startDate: '2026-10-14', endDate: '2026-10-13' },
    { startDate: undefined, endDate: '2026-10-14' }, { startTime: '25:00' },
    { startDate: undefined, startTime: '18:00' }, { expectedMonth: '2026-12' },
    { startDate: undefined, expectedMonth: '2026-13' }, { price: -1 },
    { ticketUrl: 'javascript:alert(1)' }, { image: '/assets/../secret.png' },
    { title: '' }, { state: 'Rio de Janeiro' }, { sourceName: 'Fonte sem URL' },
    { municipality: ' QUATIS ' }, { municipality: 'Porto  Real' },
  ]) assert.throws(() => validateEvents([makeEvent(overrides)]), JSON.stringify(overrides));
  assert.throws(() => validateEvents([makeEvent(), makeEvent()]));
  assert.throws(() => validateEvents({}));
});
