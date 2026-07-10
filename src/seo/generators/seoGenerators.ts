import { getHomeSEOTemplate, getCategorySEOTemplate, getBusinessSEOTemplate, getArticleSEOTemplate } from '../templates/seoTemplates';
import { DetailItem } from '../../types';

/**
 * Centrally resolves and generates complete SEO metadata objects for any page context
 */
export const generateSEO = (
  type: 'home' | 'category' | 'business' | 'article',
  data?: any
) => {
  switch (type) {
    case 'home':
      return getHomeSEOTemplate();
    case 'category':
      return getCategorySEOTemplate(data);
    case 'business':
      return getBusinessSEOTemplate(data as DetailItem);
    case 'article':
      return getArticleSEOTemplate(data);
    default:
      return getHomeSEOTemplate();
  }
};
