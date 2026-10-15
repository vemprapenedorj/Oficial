import assert from 'node:assert/strict';
import test from 'node:test';
import { discoverSiteRoutes, discoverPrerenderRoutes } from '../../../scripts/site-routes.js';
import { makeEvent } from './fixtures';

test('publicação estática inclui agenda e histórico e omite rascunhos', () => {
  assert.ok(discoverSiteRoutes([makeEvent({ startDate: '2020-01-01' })]).includes('/eventos/evento-teste-2026/'));
  assert.ok(discoverPrerenderRoutes([]).includes('/eventos/'));
  assert.ok(!discoverSiteRoutes([makeEvent({ published: false })]).includes('/eventos/evento-teste-2026/'));
});
