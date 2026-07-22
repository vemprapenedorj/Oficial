import { DetailItem } from '../types';

/**
 * LocalBusiness Schema Generator
 * Generates tailored LocalBusiness schemas based on the business category and tags.
 */
export const getLocalBusinessSchema = (item: DetailItem) => {
  const baseSchema: any = {
    "@context": "https://schema.org",
    "@id": `https://vemprapenedo.com.br/detalhe/${item.slug || item.id}#business`,
    "name": item.title,
    "description": item.description || item.fullInfo,
    "url": `https://vemprapenedo.com.br/detalhe/${item.slug || item.id}`,
    "image": item.image ? (item.image.startsWith('http') ? item.image : `https://vemprapenedo.com.br${item.image.startsWith('/') ? '' : '/'}${item.image}`) : "https://vemprapenedo.com.br/assets/imagens/Logo.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": item.location || "Penedo",
      "addressLocality": "Penedo, Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR",
      "postalCode": "27580-000"
    },
    "containedInPlace": {
      "@id": "https://vemprapenedo.com.br/#penedo-destination"
    }
  };

  // GeoCoordinates
  if (item.latitude && item.longitude) {
    baseSchema["geo"] = {
      "@type": "GeoCoordinates",
      "latitude": item.latitude,
      "longitude": item.longitude
    };
    baseSchema["hasMap"] = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
  }

  // Contact Info & Social networks
  if (item.whatsapp) {
    baseSchema["telephone"] = item.whatsapp;
  }

  const sameAsUrls: string[] = [];
  if (item.instagramUrl) sameAsUrls.push(item.instagramUrl);
  if (item.googleProfileUrl) sameAsUrls.push(item.googleProfileUrl);
  if (item.tripadvisorUrl) sameAsUrls.push(item.tripadvisorUrl);
  if (item.bookingUrl) sameAsUrls.push(item.bookingUrl);
  
  if (sameAsUrls.length > 0) {
    baseSchema["sameAs"] = sameAsUrls;
  }

  // Hours
  if (item.hours) {
    baseSchema["openingHours"] = item.hours;
  }

  // Strictly no mocked reviews!
  if (item.rating && item.reviewCount) {
    baseSchema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": item.rating,
      "reviewCount": item.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  // Google Business Profile Details
  if (item.priceRange) baseSchema["priceRange"] = item.priceRange;
  if (item.currenciesAccepted) baseSchema["currenciesAccepted"] = item.currenciesAccepted;
  if (item.paymentAccepted) baseSchema["paymentAccepted"] = item.paymentAccepted;

  // Category specific customizations
  const categoryLower = (item.category || '').toLowerCase();
  const titleLower = (item.title || '').toLowerCase();
  const tagsStr = (item.tags || []).join(' ').toLowerCase();
  
  if (categoryLower === 'gastronomia' || categoryLower === 'restaurantes' || categoryLower === 'carnes') {
    if (tagsStr.includes('café') || tagsStr.includes('cafe') || tagsStr.includes('gelato') || tagsStr.includes('sorvete') || tagsStr.includes('chocolate') || titleLower.includes('café') || titleLower.includes('cafe') || titleLower.includes('chocolate')) {
      baseSchema["@type"] = "CafeOrCoffeeShop";
    } else if (tagsStr.includes('padaria') || tagsStr.includes('doces') || titleLower.includes('padaria')) {
      baseSchema["@type"] = "Bakery";
    } else {
      baseSchema["@type"] = "Restaurant";
    }
    baseSchema["servesCuisine"] = item.tags && item.tags.length > 0 ? item.tags.filter(t => t !== 'gastronomia').join(', ') : "Variada";
    if (!baseSchema["priceRange"]) {
      baseSchema["priceRange"] = item.isPremium ? "$$$" : "$$";
    }
  } else if (categoryLower === 'onde-ficar' || categoryLower === 'hospedagem') {
    if (titleLower.includes('pousada') || titleLower.includes('chalé') || titleLower.includes('chale')) {
      baseSchema["@type"] = "LodgingBusiness";
    } else {
      baseSchema["@type"] = "Hotel";
    }
    
    const amenities: string[] = [];
    if (item.tags) {
      item.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes('piscina')) amenities.push('SwimmingPool');
        if (lowerTag.includes('wi-fi') || lowerTag.includes('wifi')) amenities.push('FreeWifi');
        if (lowerTag.includes('estacionamento')) amenities.push('FreeParking');
        if (lowerTag.includes('pet') || lowerTag.includes('animais')) amenities.push('PetFriendly');
      });
    }
    if (amenities.length > 0) {
      baseSchema["amenityFeature"] = amenities.map(name => ({
        "@type": "LocationFeatureSpecification",
        "name": name,
        "value": true
      }));
    }
  } else if (categoryLower === 'compras' || categoryLower === 'lojas') {
    if (titleLower.includes('shopping') || tagsStr.includes('shopping')) {
      baseSchema["@type"] = "ShoppingCenter";
    } else {
      baseSchema["@type"] = "Store";
    }
  } else if (categoryLower === 'o-que-fazer' || categoryLower === 'turismo' || categoryLower === 'aventura') {
    if (tagsStr.includes('camping') || tagsStr.includes('campground')) {
      baseSchema["@type"] = "Campground";
    } else if (tagsStr.includes('trilha') || tagsStr.includes('quadriciclo') || tagsStr.includes('aventura')) {
      baseSchema["@type"] = "SportsActivityLocation";
    } else {
      baseSchema["@type"] = "TouristAttraction";
    }
    baseSchema["touristType"] = item.tags && item.tags.length > 0 ? item.tags.join(', ') : "Lazer";
  } else {
    baseSchema["@type"] = "LocalBusiness";
  }

  return baseSchema;
};
