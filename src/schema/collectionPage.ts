import { DetailItem } from '../types';

/**
 * CollectionPage Schema Generator
 * Generates ItemList structured data for directory listings (Hotels, Restaurants, Sights)
 */
export const getCollectionPageSchema = (
  categoryName: string,
  categorySlug: string,
  items: DetailItem[]
) => {
  const baseUrl = 'https://vemprapenedo.com.br';
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/${categorySlug}#collection`,
    "name": `${categoryName} em Penedo RJ | Guia Oficial`,
    "url": `${baseUrl}/${categorySlug}`,
    "description": `Explore todos os estabelecimentos da categoria ${categoryName} listados no guia oficial de turismo do portal Vem Pra Penedo.`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.map((item, index) => {
        const itemPath = categorySlug === 'onde-ficar' 
          ? `onde-ficar/${item.slug || item.id}` 
          : categorySlug === 'gastronomia' 
            ? `gastronomia/${item.slug || item.id}` 
            : `o-que-fazer/${item.slug || item.id}`;
            
        return {
          "@type": "ListItem",
          "position": index + 1,
          "url": `${baseUrl}/${itemPath}`,
          "name": item.title
        };
      })
    }
  };
};
