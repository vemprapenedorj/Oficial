import assert from 'node:assert/strict';
import test from 'node:test';
import { validateEvents } from '../validation';
import { getEventImages } from '../eventImages';
import { makeEvent } from './fixtures';

test('galeria mantém ordem e descrições; imagem única continua compatível', () => {
  const images = [{ src: '/assets/um.webp', alt: 'Primeiro cartaz' }, { src: '/assets/dois.webp', alt: 'Segundo cartaz' }];
  assert.deepEqual(getEventImages(validateEvents([makeEvent({ images })])[0]), images);
  assert.deepEqual(getEventImages(makeEvent({ image: '/assets/um.webp', imageAlt: 'Cartaz' })), [{ src: '/assets/um.webp', alt: 'Cartaz' }]);
  assert.deepEqual(getEventImages(makeEvent()), []);
});

test('validação rejeita galerias inválidas, caminhos inseguros e imagens repetidas', () => {
  for (const images of ['invalid', [null], [{ src: '/assets/../foto.jpg', alt: 'Foto' }], [{ src: '/assets/foto.jpg', alt: '' }], [{ src: '/assets/foto.jpg', alt: 'Foto' }, { src: '/assets/foto.jpg', alt: 'Duplicada' }]]) {
    assert.throws(() => validateEvents([{ ...makeEvent(), images }]));
  }
});
