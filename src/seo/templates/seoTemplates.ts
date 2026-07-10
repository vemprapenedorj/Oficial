import { DEFAULT_SEO, CATEGORY_METADATA, FAQ_DATA } from '../constants/seoDefaults';
import { getCanonicalUrl, generateFallbackDescription, generateKeywords, getSubcategoryInfo } from '../utils/seoUtils';
import { 
  getOrganizationSchema, 
  getWebSiteSchema, 
  getBreadcrumbSchema, 
  getLocalBusinessSchema, 
  getArticleSchema,
  getPortalLocalBusinessSchema,
  getFAQSchema,
  getCollectionPageSchema,
  getPenedoDestinationSchema,
  getLogoSchema
} from '../../schema';
import { DetailItem } from '../../types';
import { DETAILS_DATA } from '../../data/detailsData';

export const getHomeSEOTemplate = () => {
  return {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    canonical: getCanonicalUrl('/'),
    image: DEFAULT_SEO.image,
    type: 'website',
    keywords: DEFAULT_SEO.keywords,
    robots: DEFAULT_SEO.robots,
    schema: [
      getOrganizationSchema(),
      getPortalLocalBusinessSchema(),
      getWebSiteSchema(),
      getPenedoDestinationSchema(),
      getLogoSchema(),
      getBreadcrumbSchema([{ name: 'Início', item: getCanonicalUrl('/') }])
    ]
  };
};

export const getCategorySEOTemplate = (category: string) => {
  const meta = CATEGORY_METADATA[category] || {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} em Penedo RJ | Vem Pra Penedo`,
    description: `Descubra as melhores opções de ${category} em Penedo RJ.`
  };
  
  const schemas: any[] = [
    getBreadcrumbSchema([
      { name: 'Início', item: getCanonicalUrl('/') },
      { name: meta.title.split(' | ')[0], item: getCanonicalUrl(`/${category}`) }
    ])
  ];

  // Dynamic FAQpage JSON-LD schema
  const faq = FAQ_DATA[category];
  if (faq) {
    schemas.push(getFAQSchema(faq));
  }

  // ItemList CollectionPage JSON-LD schema for lists
  const listItems = DETAILS_DATA[category];
  if (listItems && ['onde-ficar', 'gastronomia', 'compras', 'o-que-fazer'].includes(category)) {
    let catName = 'Atrações';
    if (category === 'onde-ficar') catName = 'Hospedagem';
    else if (category === 'gastronomia') catName = 'Gastronomia';
    else if (category === 'compras') catName = 'Compras';
    schemas.push(getCollectionPageSchema(catName, category, listItems));
  }

  return {
    title: meta.title,
    description: meta.description,
    canonical: getCanonicalUrl(`/${category}`),
    image: DEFAULT_SEO.image,
    type: 'website',
    keywords: generateKeywords(category, 'categoria', 'Penedo RJ'),
    robots: DEFAULT_SEO.robots,
    schema: schemas
  };
};

export const getBusinessSEOTemplate = (item: DetailItem) => {
  const itemCategory = item.category?.toLowerCase() || '';
  const categoryCleanPath = (itemCategory === 'hospedagem' || itemCategory === 'onde-ficar')
    ? 'onde-ficar'
    : (itemCategory === 'gastronomia' || itemCategory === 'carnes' || itemCategory === 'restaurantes')
      ? 'gastronomia'
      : (itemCategory === 'compras' || itemCategory === 'lojas')
        ? 'compras'
        : 'o-que-fazer';

  const categoryLabel = (itemCategory === 'hospedagem' || itemCategory === 'onde-ficar')
    ? 'Onde Ficar'
    : (itemCategory === 'gastronomia' || itemCategory === 'carnes' || itemCategory === 'restaurantes')
      ? 'Gastronomia'
      : (itemCategory === 'compras' || itemCategory === 'lojas')
        ? 'Compras'
        : 'O Que Fazer';

  const name = item.title;
  const rawImage = item.image || '/assets/imagens/Logo.jpg';
  const image = rawImage.startsWith('http') ? rawImage : getCanonicalUrl(rawImage);
  
  const catLower = (item.category || '').toLowerCase();
  let prefix = 'Local';
  if (catLower === 'hospedagem' || catLower === 'onde-ficar') {
    prefix = name.toLowerCase().includes('pousada') ? 'Pousada em Penedo RJ' : 'Hotel em Penedo RJ';
  } else if (catLower === 'gastronomia' || catLower === 'restaurantes' || catLower === 'carnes') {
    prefix = 'Restaurante em Penedo RJ';
  } else if (catLower === 'compras' || catLower === 'lojas') {
    prefix = 'Compras em Penedo RJ';
  } else {
    prefix = 'Atração em Penedo RJ';
  }
  
  const title = `${prefix} | ${name} | Vem Pra Penedo`;
  const description = item.description || generateFallbackDescription(name, item.category || 'Local', item.location);
  const keywords = generateKeywords(name, item.category || 'Local', item.location, item.tags);

  const { subName, subSlug } = getSubcategoryInfo(item);
  const businessSchema = getLocalBusinessSchema(item);
  const penedoPlaceSchema = getPenedoDestinationSchema();

  const detailSchemas = [
    businessSchema,
    penedoPlaceSchema,
    getBreadcrumbSchema([
      { name: 'Início', item: getCanonicalUrl('/') },
      { name: categoryLabel, item: getCanonicalUrl(`/${categoryCleanPath}`) },
      { name: subName, item: getCanonicalUrl(`/${categoryCleanPath}#${subSlug}`) },
      { name: name, item: getCanonicalUrl(`/${categoryCleanPath}/${item.slug || item.id}`) }
    ])
  ];

  return {
    title,
    description,
    canonical: getCanonicalUrl(`/${categoryCleanPath}/${item.slug || item.id}`),
    image,
    type: 'website',
    keywords,
    robots: DEFAULT_SEO.robots,
    schema: detailSchemas
  };
};

export const getArticleSEOTemplate = (article: { slug: string; title: string; description: string; image: string; datePublished: string; keywords?: string[] }) => {
  const rawImage = article.image || '/assets/imagens/blog/penedo_blog_header.jpg';
  const image = rawImage.startsWith('http') ? rawImage : getCanonicalUrl(rawImage);
  const keywordsStr = article.keywords ? article.keywords.join(', ') : 'blog penedo, turismo penedo';

  return {
    title: `${article.title} - Vem Pra Penedo`,
    description: article.description,
    canonical: getCanonicalUrl(`/blog/artigo/${article.slug}`),
    image,
    type: 'article',
    keywords: keywordsStr,
    robots: DEFAULT_SEO.robots,
    schema: [
      getArticleSchema(article),
      getBreadcrumbSchema([
        { name: 'Início', item: getCanonicalUrl('/') },
        { name: 'Blog', item: getCanonicalUrl('/blog') },
        { name: article.title, item: getCanonicalUrl(`/blog/artigo/${article.slug}`) }
      ])
    ]
  };
};
