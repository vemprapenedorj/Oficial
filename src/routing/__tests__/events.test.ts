import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePath, buildPath } from '../routeHelpers';
import { makeEvent } from '../../events/__tests__/fixtures';

test('agenda e páginas individuais preservam URL e excluem rascunhos', () => {
  assert.equal(parsePath('/eventos/').page, 'eventos');
  assert.equal(parsePath('/eventos/evento-teste-2026/', [makeEvent()]).eventSlug, 'evento-teste-2026');
  assert.equal(parsePath('/eventos/evento-teste-2026', [makeEvent()]).page, 'evento-detalhe');
  assert.equal(parsePath('/eventos/evento-teste-2026/', [makeEvent({ published: false })]).page, '404');
  assert.equal(parsePath('/eventos/inexistente/', []).page, '404');
  assert.equal(parsePath('/eventos/evento-teste-2026/extra', [makeEvent()]).page, '404');
  assert.equal(buildPath('evento-detalhe', null, null, 'evento-teste-2026'), '/eventos/evento-teste-2026/');
});
