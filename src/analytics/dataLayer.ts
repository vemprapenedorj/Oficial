declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const pushToDataLayer = (eventData: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  }
};
