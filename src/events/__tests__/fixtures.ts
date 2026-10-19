import type { EventRecord } from '../types';

export const makeEvent = (overrides: Partial<EventRecord> = {}): EventRecord => ({
  id: 'evento-teste-2026', slug: 'evento-teste-2026', title: 'Encontro de teste',
  summary: 'Programação fictícia para teste.', description: ['Conteúdo apenas para testes.'],
  category: 'cultura', published: true, startDate: '2026-10-14', locality: 'Penedo',
  ...overrides,
});
