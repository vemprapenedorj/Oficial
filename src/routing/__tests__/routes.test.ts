import assert from 'node:assert/strict';
import test from 'node:test';
import { DETAILS_DATA } from '../../data/detailsData';
import { CANONICAL_ROUTES, KNOWN_ROUTING_GAPS, LEGACY_ROUTES } from '../routeInventory';
import { buildPath, getBlogArticles, getBusinessPath, getPremiumBusinesses, parsePath } from '../routeHelpers';
import { checkRedirects } from '../legacyRedirects';
import fs from 'node:fs';
import path from 'node:path';

const fixedCases = [
  ['/', 'home'],
  ['/o-que-fazer', 'o-que-fazer'],
  ['/onde-ficar', 'onde-ficar'],
  ['/gastronomia', 'gastronomia'],
  ['/compras', 'compras'],
  ['/blog', 'blog'],
  ['/contato', 'contato'],
  ['/politica-de-privacidade', 'politica-de-privacidade'],
  ['/politica-de-cookies', 'politica-de-cookies'],
  ['/404', '404']
] as const;

test('todas as páginas fixas conhecidas resolvem para a página esperada', () => {
  fixedCases.forEach(([path, page]) => assert.equal(parsePath(path).page, page, path));
});

test('barra final preserva a resolução das páginas fixas', () => {
  fixedCases.filter(([path]) => path !== '/').forEach(([path, page]) => {
    assert.equal(parsePath(`${path}/`).page, page, `${path}/`);
  });
});

test('todo artigo cadastrado possui rota canônica reconhecida', () => {
  const articles = getBlogArticles();
  assert.ok(articles.length > 0);
  articles.forEach((article) => {
    const slug = article.slug || article.id;
    const route = parsePath(`/blog/artigo/${slug}`);
    assert.equal(route.page, 'blog');
    assert.equal(route.blogArticle, slug);
    assert.equal(buildPath(route.page, null, route.blogArticle), `/blog/artigo/${slug}`);
  });
});

test('toda empresa premium possui uma rota canônica correspondente à categoria de dados', () => {
  const premiumBusinesses = getPremiumBusinesses();
  assert.ok(premiumBusinesses.length > 0);

  Object.entries(DETAILS_DATA).forEach(([category, items]) => {
    if (category === 'blog') return;
    items.filter((item) => item.isPremium).forEach((item) => {
      const slug = item.slug || item.id;
      const canonical = `/${category}/${slug}`;
      const route = parsePath(canonical);
      assert.equal(route.page, 'premium-detail', canonical);
      assert.equal(route.premiumSlug, slug, canonical);
      assert.equal(buildPath(route.page, route.premiumSlug, null), canonical);
    });
  });
});

test('empresa inexistente resolve para 404 nas rotas canônica e antiga', () => {
  assert.equal(parsePath('/gastronomia/empresa-inexistente').page, '404');
  assert.equal(parsePath('/detalhe/empresa-inexistente').page, '404');
});

test('artigo inexistente não pertence à fonte canônica de artigos', () => {
  assert.equal(
    getBlogArticles().some((article) => (article.slug || article.id) === 'artigo-inexistente'),
    false
  );
});

test('barra final funciona para empresas premium e artigos', () => {
  const business = getPremiumBusinesses()[0];
  const businessSlug = business.slug || business.id;
  const businessPath = buildPath('premium-detail', businessSlug, null);
  assert.equal(parsePath(`${businessPath}/`).premiumSlug, businessSlug);

  const article = getBlogArticles()[0];
  const articleSlug = article.slug || article.id;
  assert.equal(parsePath(`/blog/artigo/${articleSlug}/`).blogArticle, articleSlug);
});

test('rota antiga /detalhe continua compatível somente para empresa existente', () => {
  const business = getPremiumBusinesses()[0];
  const slug = business.slug || business.id;
  assert.equal(parsePath(`/detalhe/${slug}`).premiumSlug, slug);
  assert.equal(buildPath('premium-detail', slug, null).startsWith('/detalhe/'), false);
});

test('redirects atuais e conflitos conhecidos permanecem inventariados', () => {
  assert.equal(checkRedirects('/contatos'), '/contato');
  assert.equal(checkRedirects('/contatos/'), '/contato');
  assert.equal(checkRedirects('/old-about'), null);
  assert.equal(parsePath('/premium-detail').page, '404');
});

test('inventário não repete padrões canônicos', () => {
  const patterns = CANONICAL_ROUTES.map((route) => route.pattern);
  assert.equal(new Set(patterns).size, patterns.length);
});

test('cada empresa premium possui redirect HTTP da rota antiga no .htaccess', () => {
  const htaccess = fs.readFileSync(path.resolve('public/.htaccess'), 'utf8');
  getPremiumBusinesses().forEach((business) => {
    const slug = business.slug || business.id;
    assert.match(htaccess, new RegExp(`\\^detalhe/${slug.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}`));
    assert.ok(htaccess.includes(getBusinessPath(slug)), slug);
  });
});
