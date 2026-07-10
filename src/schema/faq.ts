/**
 * FAQPage Schema Generator
 * Targets FAQPage schemas dynamically
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export const getFAQSchema = (items: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};
