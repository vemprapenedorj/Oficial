/**
 * Place & TouristDestination Schema Generator for Penedo
 */
export const getPenedoDestinationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": "https://vemprapenedo.com.br/#penedo-destination",
    "name": "Penedo",
    "description": "A Finlândia Brasileira. Distrito turístico de Itatiaia, localizado na Serra da Mantiqueira, Rio de Janeiro.",
    "containedInPlace": {
      "@type": "Place",
      "name": "Itatiaia",
      "containedInPlace": {
        "@type": "Place",
        "name": "Rio de Janeiro",
        "containedInPlace": {
          "@type": "Place",
          "name": "Brasil"
        }
      }
    }
  };
};
