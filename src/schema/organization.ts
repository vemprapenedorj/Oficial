/**
 * Organization Schema Generator
 * Targets Organization metadata for Vem Pra Penedo portal
 */
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vemprapenedo.com.br/#organization",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com.br",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://vemprapenedo.com.br/#logo",
      "url": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
      "caption": "Vem Pra Penedo Logo"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
      "caption": "Vem Pra Penedo Logo"
    },
    "description": "O portal oficial de turismo de Penedo RJ. Encontre os melhores hotéis, pousadas, restaurantes, passeios, eventos e atrações na Finlândia Brasileira.",
    "email": "contato@vemprapenedo.com.br",
    "telephone": "+55-24-99208-7767",
    "foundingDate": "2023-05-15",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Penedo, Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR",
      "postalCode": "27580-000"
    },
    "areaServed": [
      { "@type": "City", "name": "Penedo" },
      { "@type": "City", "name": "Itatiaia" },
      { "@type": "State", "name": "Rio de Janeiro" }
    ],
    "knowsAbout": [
      "Turismo em Penedo",
      "Hotéis em Penedo",
      "Pousadas em Penedo",
      "Restaurantes em Penedo",
      "O que fazer em Penedo",
      "Cachoeiras de Penedo",
      "Pequena Finlândia",
      "Casa do Papai Noel",
      "Parque Nacional do Itatiaia",
      "Ecoturismo",
      "Turismo de aventura",
      "Turismo gastronômico"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-24-99208-7767",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/vemprapenedo/",
      "https://www.tiktok.com/@vemprapenedo",
      "https://www.facebook.com/vemprapenedo"
    ]
  };
};

export const getPortalLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    "@id": "https://vemprapenedo.com.br/#portalbusiness",
    "name": "Vem Pra Penedo",
    "url": "https://vemprapenedo.com.br",
    "logo": {
      "@type": "ImageObject",
      "@id": "https://vemprapenedo.com.br/#logo",
      "url": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
      "caption": "Vem Pra Penedo Logo"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
      "caption": "Vem Pra Penedo Logo"
    },
    "description": "O portal oficial de turismo de Penedo RJ. Informações sobre hotéis, pousadas, restaurantes, passeios e eventos na Serra da Mantiqueira.",
    "telephone": "+55-24-99208-7767",
    "email": "contato@vemprapenedo.com.br",
    "areaServed": [
      { "@type": "City", "name": "Penedo" },
      { "@type": "City", "name": "Itatiaia" },
      { "@type": "State", "name": "Rio de Janeiro" }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Mangueiras, Centro",
      "addressLocality": "Penedo, Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR",
      "postalCode": "27580-000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-22.4344",
      "longitude": "-44.5298"
    },
    "sameAs": [
      "https://www.instagram.com/vemprapenedo/",
      "https://www.tiktok.com/@vemprapenedo",
      "https://www.facebook.com/vemprapenedo"
    ]
  };
};

export const getLogoSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": "https://vemprapenedo.com.br/#logo",
    "contentUrl": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
    "url": "https://vemprapenedo.com.br/assets/imagens/logo-google.png",
    "width": 512,
    "height": 512,
    "caption": "Vem Pra Penedo"
  };
};
