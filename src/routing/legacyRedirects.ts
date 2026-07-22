export interface LegacyRouteDefinition {
  pattern: string;
  behavior: 'redirect' | 'compatibility';
  target?: string;
  notes: string;
}

export const LEGACY_ROUTES: LegacyRouteDefinition[] = [
  { pattern: '/detalhe/:slug', behavior: 'compatibility', notes: 'Aceita empresas premium existentes; deve redirecionar para a categoria canônica.' },
  { pattern: '/blog/:slug', behavior: 'compatibility', notes: 'Formato antigo; deve redirecionar para /blog/artigo/:slug.' },
  { pattern: '/restaurantes/:slug', behavior: 'compatibility', notes: 'Alias antigo aceito pelo parser atual.' },
  { pattern: '/pousadas/:slug', behavior: 'compatibility', notes: 'Alias antigo aceito pelo parser atual.' },
  { pattern: '/hoteis/:slug', behavior: 'compatibility', notes: 'Alias antigo aceito pelo parser atual.' },
  { pattern: '/contatos', behavior: 'redirect', target: '/contato', notes: 'Redirect existente com destino canônico válido.' }
];

export const checkRedirects = (path: string): string | null => {
  if (!path) return null;
  const cleanPath = path.toLowerCase().replace(/\/$/, '');
  const redirect = LEGACY_ROUTES.find(
    (route) => route.behavior === 'redirect' && route.pattern.toLowerCase() === cleanPath
  );
  return redirect?.target || null;
};
