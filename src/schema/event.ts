/**
 * Event Schema Generator
 * Targets Event schema metadata dynamically
 */
export interface EventData {
  id: string;
  name: string;
  startDate: string; // ISO format: YYYY-MM-DDTHH:mm
  endDate?: string;
  locationName: string;
  locationAddress: string;
  image: string;
  description: string;
  price?: number;
  organizerName?: string;
}

export const getEventSchema = (event: EventData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "startDate": event.startDate,
    "endDate": event.endDate || event.startDate,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.locationName,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.locationAddress,
        "addressLocality": "Itatiaia",
        "addressRegion": "RJ",
        "addressCountry": "BR",
        "postalCode": "27580-000"
      }
    },
    "image": event.image.startsWith('http') ? event.image : `https://vemprapenedo.com.br${event.image}`,
    "description": event.description,
    "offers": {
      "@type": "Offer",
      "price": event.price || 0,
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "url": "https://vemprapenedo.com.br"
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizerName || "Vem Pra Penedo",
      "url": "https://vemprapenedo.com.br"
    }
  };
};
