export { CANONICAL_ROUTES } from './routeConfig';
export type { CanonicalRouteDefinition, RouteKind } from './routeConfig';
export { LEGACY_ROUTES } from './legacyRedirects';
export type { LegacyRouteDefinition } from './legacyRedirects';

export const KNOWN_ROUTING_GAPS = [
  'Novas empresas Premium precisam acrescentar uma regra /detalhe/:slug no .htaccess enquanto a compatibilidade antiga existir.'
] as const;
