import assert from 'node:assert/strict';
import test from 'node:test';
import { getEventSchema } from '../../schema/event';
import { getEventSEO, getEventsSEO } from '../eventSEO';
import { makeEvent } from './fixtures';

test('schema não inventa datas, preço, organizador ou endereço de Itatiaia', () => {
  assert.equal(getEventSchema(makeEvent({ startDate: undefined }), '2026-10-14'), null);
  assert.equal(getEventSchema(makeEvent(), '2026-10-14'), null);
  const event = makeEvent({ locationName: 'Local de teste', locationAddress: 'Rua de teste', municipality: 'Resende', state: 'RJ' });
  const schema = getEventSchema(event, '2026-10-14')!;
  assert.equal(schema.offers, undefined);
  assert.equal(schema.organizer, undefined);
  assert.equal((schema.location as any).address.addressLocality, 'Resende');
  assert.equal((schema.location as any).address.postalCode, undefined);
  assert.equal(getEventSchema({ ...event, price: 0, ticketUrl: 'https://example.com' }, '2026-10-15')!.offers, undefined);
});

test('SEO contém região, endereço próprio e apenas eventos publicados', () => {
  assert.match(getEventsSEO([]).title!, /Penedo e Região/);
  assert.equal(getEventSEO(makeEvent(), '2026-10-14').canonical, 'https://vemprapenedo.com.br/eventos/evento-teste-2026/');
  assert.ok(!JSON.stringify(getEventsSEO([makeEvent({ published: false })]).schema).includes('evento-teste-2026'));
});
