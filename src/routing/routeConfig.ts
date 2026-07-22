import { Page } from '../types';

export type RouteKind = 'fixed' | 'business' | 'article';

export interface FixedRouteConfig {
  page: Page;
  path: string;
  label: string;
  indexable: boolean;
}

export interface CanonicalRouteDefinition {
  pattern: string;
  kind: RouteKind;
  indexable: boolean;
}

export const FIXED_ROUTES: FixedRouteConfig[] = [
  { page: 'home', path: '/', label: 'Início', indexable: true },
  { page: 'o-que-fazer', path: '/o-que-fazer', label: 'O Que Fazer', indexable: true },
  { page: 'onde-ficar', path: '/onde-ficar', label: 'Onde Ficar', indexable: true },
  { page: 'gastronomia', path: '/gastronomia', label: 'Gastronomia', indexable: true },
  { page: 'compras', path: '/compras', label: 'Compras', indexable: true },
  { page: 'blog', path: '/blog', label: 'Blog', indexable: true },
  { page: 'contato', path: '/contato', label: 'Contato', indexable: true },
  { page: 'politica-de-privacidade', path: '/politica-de-privacidade', label: 'Privacidade', indexable: true },
  { page: 'politica-de-cookies', path: '/politica-de-cookies', label: 'Cookies', indexable: true },
  { page: '404', path: '/404', label: 'Página não encontrada', indexable: false }
];

export const BUSINESS_CATEGORY_PATHS = ['o-que-fazer', 'onde-ficar', 'gastronomia', 'compras'] as const;
export const LEGACY_BUSINESS_CATEGORY_PATHS = ['restaurantes', 'pousadas', 'hoteis', 'detalhe'] as const;
export const BLOG_ARTICLE_PREFIX = '/blog/artigo';
export const LEGACY_BLOG_PREFIX = '/blog';
export const LEGACY_DETAIL_PREFIX = '/detalhe';

export const CANONICAL_ROUTES: CanonicalRouteDefinition[] = [
  ...FIXED_ROUTES.map(({ path, indexable }) => ({ pattern: path, kind: 'fixed' as const, indexable })),
  ...BUSINESS_CATEGORY_PATHS.map((category) => ({
    pattern: `/${category}/:slug`,
    kind: 'business' as const,
    indexable: true
  })),
  { pattern: `${BLOG_ARTICLE_PREFIX}/:slug`, kind: 'article', indexable: true }
];

export const getFixedRouteByPage = (page: Page): FixedRouteConfig | undefined => FIXED_ROUTES.find(
  (route) => route.page === page
);

export const getFixedRouteByPath = (path: string): FixedRouteConfig | undefined => FIXED_ROUTES.find(
  (route) => route.path === path
);
