import { useMemo } from 'react';
import { generateSEO } from '../generators/seoGenerators';

/**
 * React hook to dynamically resolve SEO metadata configurations with caching
 */
export const useDynamicSEO = (
  type: 'home' | 'category' | 'business' | 'article',
  data?: any
) => {
  return useMemo(() => generateSEO(type, data), [type, data]);
};
