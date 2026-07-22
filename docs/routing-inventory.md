# Inventário de roteamento

Este documento registra o comportamento protegido antes da futura migração para React Router.

## Rotas canônicas

- Páginas: `/`, `/o-que-fazer`, `/onde-ficar`, `/gastronomia`, `/compras`, `/blog`, `/contato`, `/politica-de-privacidade` e `/politica-de-cookies`.
- Empresas premium: `/:categoria/:slug`, usando as categorias `o-que-fazer`, `onde-ficar`, `gastronomia` e `compras`.
- Artigos: `/blog/artigo/:slug`.
- A página `/404` existe, mas não é indexável.
- A URL canônica não usa barra final; a entrada com barra final permanece aceita.

## Rotas antigas e redirects

| Entrada | Comportamento atual | Destino futuro recomendado |
| --- | --- | --- |
| `/detalhe/:slug` | Abre empresa premium existente | URL canônica da categoria |
| `/blog/:slug` | Abre artigo pelo formato antigo | `/blog/artigo/:slug` |
| `/restaurantes/:slug` | Alias de empresa premium | URL canônica da empresa |
| `/pousadas/:slug` | Alias de empresa premium | URL canônica da empresa |
| `/hoteis/:slug` | Alias de empresa premium | URL canônica da empresa |
| `/contatos` | Redirect no navegador | `/contato` |

## Lacunas conhecidas

- Artigo inexistente agora responde com a página 404 e metadados `noindex`.
- `/premium-detail` sem slug agora é tratado como 404; somente URLs públicas com categoria e slug são válidas.
- Os redirects canônicos conhecidos estão configurados no `.htaccess` da Hostinger; o fallback JavaScript permanece útil apenas em desenvolvimento local.
- O teste de histórico usa navegador real e deve ser executado separadamente com `npm run test:routing:e2e`. Ele é marcado como ignorado, sem mascarar outros erros, quando o Chromium do Puppeteer não consegue iniciar no ambiente.

## Comandos

- `npm test`: testes rápidos de inventário, páginas, artigos, empresas, slugs, barra final e compatibilidade.
- `npm run test:routing:e2e`: teste do histórico voltar/avançar em Chromium.
- `npm run test:routing`: executa as duas etapas.
