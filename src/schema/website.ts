/**
 * WebSite Schema Generator
 * Targets WebSite metadata with SearchAction for Vem Pra Penedo portal
 */
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://vemprapenedo.com.br/#website",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com.br",
    "description": "Guia completo de Penedo RJ - Pousadas, Restaurantes e Passeios",
    "publisher": {
      "@id": "https://vemprapenedo.com.br/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vemprapenedo.com.br/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};
