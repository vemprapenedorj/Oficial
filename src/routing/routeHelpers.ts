import { DETAILS_DATA } from '../data/detailsData';
import { DetailItem, Page } from '../types';
import {
  BLOG_ARTICLE_PREFIX,
  BUSINESS_CATEGORY_PATHS,
  getFixedRouteByPage,
  getFixedRouteByPath,
  LEGACY_BLOG_PREFIX,
  LEGACY_BUSINESS_CATEGORY_PATHS,
  LEGACY_DETAIL_PREFIX
} from './routeConfig';

export interface RouteResolution {
  page: Page;
  premiumSlug: string | null;
  blogArticle: string | null;
}

const emptyRoute = (page: Page): RouteResolution => ({ page, premiumSlug: null, blogArticle: null });
const removeTrailingSlash = (path: string): string => path === '/' ? path : path.replace(/\/$/, '');

export const getPremiumBusinesses = (): DetailItem[] => Object.values(DETAILS_DATA).flat().filter((item) => item.isPremium);
export const getBlogArticles = (): DetailItem[] => DETAILS_DATA.blog || [];
export const premiumBusinessExists = (slug: string): boolean => getPremiumBusinesses().some(
  (item) => item.slug === slug || item.id === slug
);

export const getBusinessPath = (slug: string): string => {
  for (const [category, items] of Object.entries(DETAILS_DATA)) {
    const item = items.find((candidate) => candidate.slug === slug || candidate.id === slug);
    if (item && category !== 'blog') return `/${category}/${item.slug || item.id}`;
  }
  return `${LEGACY_DETAIL_PREFIX}/${slug}`;
};

export const getBlogArticlePath = (slug: string): string => `${BLOG_ARTICLE_PREFIX}/${slug}`;

export const parsePath = (rawPath: string): RouteResolution => {
  const path = removeTrailingSlash(rawPath || '/');
  if (path === '/') return emptyRoute('home');

  if (path.startsWith(`${LEGACY_DETAIL_PREFIX}/`)) {
    const slug = path.slice(LEGACY_DETAIL_PREFIX.length + 1);
    return premiumBusinessExists(slug)
      ? { page: 'premium-detail', premiumSlug: slug, blogArticle: null }
      : emptyRoute('404');
  }

  if (path.startsWith(`${BLOG_ARTICLE_PREFIX}/`)) {
    return { page: 'blog', premiumSlug: null, blogArticle: path.slice(BLOG_ARTICLE_PREFIX.length + 1) };
  }

  if (path.startsWith(`${LEGACY_BLOG_PREFIX}/`)) {
    return { page: 'blog', premiumSlug: null, blogArticle: path.slice(LEGACY_BLOG_PREFIX.length + 1) };
  }

  const fixedRoute = getFixedRouteByPath(path);
  if (fixedRoute) return emptyRoute(fixedRoute.page);

  const parts = path.split('/').filter(Boolean);
  if (parts.length === 2) {
    const [category, slug] = parts;
    const knownCategories: readonly string[] = [...BUSINESS_CATEGORY_PATHS, ...LEGACY_BUSINESS_CATEGORY_PATHS];
    if (knownCategories.includes(category)) {
      return premiumBusinessExists(slug)
        ? { page: 'premium-detail', premiumSlug: slug, blogArticle: null }
        : emptyRoute('404');
    }
  }

  return emptyRoute('404');
};

export const buildPath = (page: Page, premiumSlug: string | null, blogArticle: string | null): string => {
  if (page === 'premium-detail' && premiumSlug) return getBusinessPath(premiumSlug);
  if (page === 'blog' && blogArticle) return getBlogArticlePath(blogArticle);
  return getFixedRouteByPage(page)?.path || '/404';
};
