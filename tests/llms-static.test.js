import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const expectedLinks = [
  'https://vemprapenedo.com.br/',
  'https://vemprapenedo.com.br/o-que-fazer/',
  'https://vemprapenedo.com.br/onde-ficar/',
  'https://vemprapenedo.com.br/gastronomia/',
  'https://vemprapenedo.com.br/blog/',
  'https://vemprapenedo.com.br/divulgue-seu-negocio',
];

test('publica o arquivo llms.txt como recurso estatico', async () => {
  const content = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');

  assert.match(content, /^# Vem Pra Penedo\r?\n/);
  assert.match(content, /Penedo-RJ não deve ser confundido com o município de Penedo/);

  for (const link of expectedLinks) {
    assert.ok(content.includes(link), `Link ausente: ${link}`);
  }
});

test('declara UTF-8 no Content-Type de llms.txt', async () => {
  const htaccess = await readFile(new URL('../public/.htaccess', import.meta.url), 'utf8');

  assert.match(htaccess, /<Files "llms\.txt">[\s\S]*Header set Content-Type "text\/plain; charset=UTF-8"[\s\S]*<\/Files>/);
});
