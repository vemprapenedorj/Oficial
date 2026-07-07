/**
 * Declare dataLayer on window interface for TypeScript support
 */
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Standard utility to push event data to Google Tag Manager dataLayer.
 * Initializes the dataLayer array if it doesn't already exist.
 *
 * @param data Object containing event name and payload parameters.
 */
export function pushToDataLayer(data: Record<string, any>): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
}
