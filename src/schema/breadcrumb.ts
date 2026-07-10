/**
 * BreadcrumbList Schema Generator
 * Targets BreadcrumbList hierarchy metadata dynamically based on current page
 */
export interface BreadcrumbItem {
  name: string;
  item: string;
}

export const getBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
};
