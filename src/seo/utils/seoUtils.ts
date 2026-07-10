import { BASE_URL, DEFAULT_SEO } from '../constants/seoDefaults';

/**
 * Normalizes paths to ensure friendly, lowercase, hyphen-separated URLs.
 */
export const cleanPath = (path: string): string => {
  if (!path) return '/';
  let cleaned = path
    .toLowerCase()
    .replace(/\/+/g, '/') // remove duplicate slashes
    .replace(/\/$/, '');  // remove trailing slash

  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  return cleaned;
};

/**
 * Returns the full canonical URL.
 */
export const getCanonicalUrl = (path: string): string => {
  return `${BASE_URL}${cleanPath(path)}`;
};

/**
 * Generates an automatic SEO description if one is missing.
 */
export const generateFallbackDescription = (name: string, category: string, location?: string): string => {
  const cleanCategory = category || 'estabelecimento';
  const cleanLocation = location || 'Penedo RJ';
  return `Descubra mais sobre ${name}, um excelente ${cleanCategory.toLowerCase()} localizado em ${cleanLocation}. Encontre fotos, telefone, horário de funcionamento e avaliações no portal Vem Pra Penedo.`;
};

/**
 * Generates dynamic SEO keywords.
 */
export const generateKeywords = (name: string, category: string, location?: string, extraTags?: string[]): string => {
  const cleanLocation = location || 'Penedo RJ';
  const baseKeywords = [
    name.toLowerCase(),
    category.toLowerCase(),
    `${category.toLowerCase()} em penedo`,
    `${category.toLowerCase()} em penedo rj`,
    'penedo rj',
    'turismo penedo',
    'viagem penedo',
    cleanLocation.toLowerCase()
  ];

  if (extraTags) {
    extraTags.forEach(tag => {
      if (tag) baseKeywords.push(tag.toLowerCase());
    });
  }

  // Remove duplicates and join by comma
  return Array.from(new Set(baseKeywords)).join(', ');
};

import { DetailItem } from '../../types';

/**
 * Dynamic Subcategory classifier helper for breadcrumbs and lists.
 */
export function getSubcategoryInfo(item: DetailItem): { subName: string; subSlug: string } {
  const catLower = (item.category || '').toLowerCase();
  const titleLower = (item.title || '').toLowerCase();
  const tagsStr = (item.tags || []).join(' ').toLowerCase();

  let subName = '';
  let subSlug = '';

  if (catLower === 'hospedagem' || catLower === 'onde-ficar') {
    if (titleLower.includes('pousada')) {
      subName = 'Pousadas';
      subSlug = 'pousadas';
    } else if (titleLower.includes('hotel')) {
      subName = 'Hotéis';
      subSlug = 'hoteis';
    } else {
      subName = 'Chalés';
      subSlug = 'chales';
    }
  } else if (catLower === 'gastronomia' || catLower === 'restaurantes' || catLower === 'carnes') {
    if (titleLower.includes('café') || titleLower.includes('cafe') || tagsStr.includes('café') || tagsStr.includes('cafe') || tagsStr.includes('gelateria') || tagsStr.includes('sorvete') || titleLower.includes('patisserie')) {
      subName = 'Cafés';
      subSlug = 'cafes';
    } else if (titleLower.includes('chocolate') || tagsStr.includes('chocolate') || titleLower.includes('lugano') || titleLower.includes('tonttulakki')) {
      subName = 'Chocolaterias';
      subSlug = 'chocolaterias';
    } else {
      subName = 'Restaurantes';
      subSlug = 'restaurantes';
    }
  } else if (catLower === 'compras' || catLower === 'lojas') {
    if (titleLower.includes('shopping') || tagsStr.includes('shopping')) {
      subName = 'Shoppings';
      subSlug = 'shoppings';
    } else {
      subName = 'Lojas';
      subSlug = 'lojas';
    }
  } else {
    // Default or 'o-que-fazer'
    if (tagsStr.includes('cachoeira') || titleLower.includes('cachoeira')) {
      subName = 'Cachoeiras';
      subSlug = 'cachoeiras';
    } else if (tagsStr.includes('passeio') || tagsStr.includes('aventura') || tagsStr.includes('quadriciclo') || tagsStr.includes('trilha') || titleLower.includes('expedição') || titleLower.includes('expedicao')) {
      subName = 'Passeios';
      subSlug = 'passeios';
    } else {
      subName = 'Atrações';
      subSlug = 'atracoes';
    }
  }

  return { subName, subSlug };
}
