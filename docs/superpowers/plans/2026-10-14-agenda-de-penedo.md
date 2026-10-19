# Agenda de Penedo e Região Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar a Agenda de Penedo e Região com destaque na inicial, cards ampliados, páginas individuais e histórico permanente.

**Architecture:** Um cadastro JSON alimenta funções de datas e filtros, componentes React e descoberta das páginas estáticas. A agenda possui páginas próprias, mantendo os fluxos atuais de estabelecimentos e blog. O navegador atualiza a classificação temporal; a publicação gera HTML e sitemap para os eventos publicados, incluindo os encerrados.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS 4, Vite 6, react-helmet-async, node:test, tsx e Puppeteer já instalados. Sem novas dependências.

**Spec:** [Especificação aprovada](../specs/2026-10-14-agenda-de-penedo-design.md).

**Conteúdo inicial:** [Transcrição das imagens de outubro a dezembro de 2026](../../eventos/programacao-outubro-dezembro-2026.md). Ano inferido do calendário anterior; a transcrição foi conferida nas imagens, sem verificação independente de alterações posteriores.

## Global Constraints

- Dois cartões por linha no desktop, a partir de 1024 px; uma coluna abaixo disso. Imagem 3:2 com referência de 600 × 400 px, conteúdo textual abaixo e cartazes completos com `object-contain`. YouTube é apenas exemplo de destaque visual.
- Até três destaques na inicial: se houver terceiro, ocupa a segunda linha com a mesma largura. Não aumentar para três colunas nem adotar 16:9.
- “Acontece em Penedo e região” após o carrossel Premium e antes da busca. Copiar os textos da especificação, incluindo os estados vazios.
- Abrangência regional: página “Agenda de Eventos — Penedo e Região”, menu “Eventos” e localização real em cada registro. Não preencher município, UF ou organizador por suposição.
- Recorte editorial: Penedo e entorno, com Visconde de Mauá, Serrinha do Alambari, Resende, Capelinha e Itatiaia. Excluir Quatis e Porto Real do cadastro, destaque, agenda, busca e histórico. A prioridade é na seleção editorial, mantendo a ordenação temporal dos eventos escolhidos; não criar distâncias ou eventos de Serrinha ausentes da fonte.
- Incluir o calendário na inicial e na agenda e o crédito com link ao Instagram no bloco da agenda; manter o ano 2026 explícito. São referências externas, sem incorporação do PDF ou importação automática de eventos.
- Fuso `America/Sao_Paulo`; encerramento no dia seguinte ao último dia do evento. Horários são informativos.
- Cadastro inicia vazio na tarefa 1 e recebe a programação fornecida na tarefa 6: 24 registros selecionados conforme a transcrição editorial, excluindo Quatis e Porto Real. Dados fictícios ficam exclusivamente em testes isolados.
- URLs `/eventos/` e `/eventos/<slug>/`; edições anuais independentes; histórico conserva URL e conteúdo.
- Registros não publicados não aparecem em busca, páginas, sitemap ou destaques. Campos desconhecidos não recebem dados inventados.
- Preservar a alteração preexistente em `public/sitemap.xml`. Não fazer deploy, push ou mudanças de conteúdo comercial como parte deste plano.
- HTML estático tem classificação da data do build; atualização em tempo real depende de JavaScript. Não criar serviço de rebuild agendado.

## Review Focus

1. Aba aberta durante a meia-noite ou suspensa por dias: atualizar classificação e destaques ao retomar, sem recarregamento (tarefas 2 e 7).
2. Cartaz vertical, imagem quebrada e título longo: preservar texto e proporção, com alternativa visual acessível, sem estourar a tela (tarefas 4 e 7).
3. Evento de dezembro a janeiro: aparecer nos filtros dos dois anos, enquanto programação sem dia e com mês previsto aparece no ano correspondente; sem qualquer referência temporal, só aparece em “Todos os anos” (tarefa 2).
4. Navegação entre dois eventos: atualizar título, canonical, conteúdo e rolagem; voltar/avançar continua funcionando (tarefas 3, 5 e 7).
5. Preço desconhecido e link de compra em evento encerrado: não comunicar gratuidade nem oferecer compra ativa; JSON-LD consistente com conteúdo (tarefas 5 e 7).

## Organização e ordem

Executar em sequência: 1 → 2 → 3 → 4 → 5 → 6 → 7. Cada tarefa termina em verificação e commit com arquivos explicitamente selecionados. A implementação pode ocorrer nesta conversa; este documento não inicia sua execução.

| Arquivos | Responsabilidade | Tarefa |
|---|---|---|
| `src/data/events.json`, `src/events/types.ts`, `src/events/validation.ts`, `src/events/catalog.ts` | Cadastro, tipos, validação e leitura | 1 |
| `scripts/validate-events.ts`, `package.json`, `tsconfig.json`, `scripts/build.js` | Validar cadastro e executar testes/publicação | 1, 6, 7 |
| `src/events/eventUtils.ts`, `src/events/useEventToday.ts` | Datas, filtros, busca e atualização do dia | 2 |
| `src/types.ts`, `src/routing/routeConfig.ts`, `src/routing/routeHelpers.ts` | Resolução e construção de URLs | 3 |
| `src/events/EventCard.tsx`, `src/events/EventsHighlight.tsx`, `DESIGN.md` | Identidade e cards ampliados | 4 |
| `src/pages/EventsPage.tsx`, `src/pages/EventDetailPage.tsx`, `src/events/eventSEO.ts`, `src/schema/event.ts` | Agenda, detalhe e metadados | 5 |
| `src/events/eventSources.ts` | Referência externa do calendário e crédito da fonte | 5 |
| `src/App.tsx`, `src/pages/HomePage.tsx` | Menu, rotas React, destaque e busca | 5 |
| `scripts/site-routes.js`, `docs/eventos.md` | Rotas estáticas e instruções de cadastro | 6 |
| `src/events/__tests__/*`, `src/routing/__tests__/events.test.ts`, `tests/events.e2e.js`, `tests/helpers/events-workspace.js` | Verificações funcionais e visuais isoladas | 1–7 |

## Tarefa 1: Cadastro único, tipos e validação

**Arquivos:** criar os arquivos de cadastro da tabela, `scripts/validate-events.ts`, `src/events/__tests__/fixtures.ts` e `src/events/__tests__/validation.test.ts`; alterar `package.json` e, apenas se necessário ao import JSON, `tsconfig.json`.

**Interfaces:**

- `EventCategory = 'cultura' | 'gastronomia' | 'comemoracoes' | 'atracoes-sazonais' | 'esportes'`; `EVENT_CATEGORY_LABELS` fornece os cinco rótulos da especificação.
- `EventRecord`: `id`, `slug`, `title`, `summary`: string; `description`: string[]; `category`: EventCategory; `published`: boolean. Opcionais string: `image`, `imageAlt`, `locationName`, `locationAddress`, `locality`, `municipality`, `state`, `startDate`, `endDate`, `expectedMonth`, `startTime`, `endTime`, `organizerName`, `entryText`, `ticketUrl`, `officialUrl`, `sourceName`, `updatedAt`; `price?: number`.
- `locality` identifica bairro/distrito/localidade; `municipality` é o município efetivo; `state` é a UF com duas letras maiúsculas. `sourceName` identifica a fonte do `officialUrl`, sem substituir `organizerName`. Se houver `sourceName`, exigir `officialUrl`; registros derivados de fontes externas recebem `updatedAt` como data de conferência. Validar textos opcionais não vazios e UF quando fornecida.
- `expectedMonth?: string` usa `YYYY-MM`, apenas quando não existem `startDate`/`endDate`. Validar mês de 01 a 12 e exclusão mútua com datas completas. Preserva informação mensal sem inventar um dia. Incluir testes que aceitam `2026-12` e rejeitam `2026-13` ou mês previsto junto de início confirmado.
- `validateEvents(input: unknown): EventRecord[]` lança erro descritivo com registro/campo inválido.
- Rejeitar no validador registros cujo município normalizado seja `quatis` ou `porto real`. Não inferir município para contornar campos incompletos: a revisão editorial também confere as localidades textuais. Testar as duas exclusões com diferenças de caixa e espaços, e confirmar em teste do conteúdo inicial que nenhum registro remete a essas cidades, inclusive em `locationName` e `locality`.
- `EVENTS: readonly EventRecord[]` em `catalog.ts`, carregado do JSON validado; `getPublishedEvents(events: readonly EventRecord[] = EVENTS): EventRecord[]`.
- Fixture `makeEvent(overrides: Partial<EventRecord> = {}): EventRecord`, com evento fictício publicado, slug `evento-teste-2026`, categoria cultura e data `2026-10-14`.

- [ ] Criar testes de dados válidos e inválidos, incluindo datas de calendário reais, fim sem início, duplicidade de id/slug, horário inválido, preço negativo e protocolos inadequados em links. Exemplos de asserções:

```ts
assert.deepEqual(validateEvents([]), []);
assert.throws(() => validateEvents([makeEvent({ startDate: '2026-02-30' })]));
assert.throws(() => validateEvents([makeEvent(), makeEvent()]));
assert.equal(validateEvents([makeEvent({ price: undefined })])[0].price, undefined);
assert.throws(() => validateEvents([makeEvent({ ticketUrl: 'javascript:alert(1)' })]));
```

- [ ] Rodar `npx tsx --test src/events/__tests__/validation.test.ts` e confirmar falha pela ausência do módulo novo.
- [ ] Implementar tipos, validador, catálogo e JSON vazio. Slugs seguem letras minúsculas, números e hífens. Rejeitar campos obrigatórios vazios, horários sem data correspondente e imagem que não seja caminho local `/assets/` sem travessia de diretórios. Links externos aceitam apenas HTTP/HTTPS. Não converter ausência de preço em zero. Validar também rascunhos, mantendo o mesmo contrato editorial.
- [ ] Implementar o script de validação, incluindo existência de imagens locais, e adicionar `validate:events` = `tsx scripts/validate-events.ts`; `test:events` = `tsx --test src/events/__tests__/*.test.ts`; ampliar `test` para executar os testes existentes de rotas e os novos de eventos. Os testes de rota novos usam a glob já existente.
- [ ] Rodar o teste novamente, `npm run validate:events` e `npm run lint`; esperar sucesso com cadastro vazio. Registrar falhas preexistentes separadamente.
- [ ] Commit: `feat: criar cadastro validado de eventos`.

## Tarefa 2: Classificação por data, filtros e busca

**Arquivos:** criar `eventUtils.ts`, `useEventToday.ts` e `src/events/__tests__/eventUtils.test.ts`.

**Interfaces:** consome `EventRecord` e o catálogo da tarefa 1. Exportar:

- `getPenedoDate(now: Date): string` no formato `YYYY-MM-DD`.
- `getEventStatus(event: EventRecord, today: string): 'upcoming' | 'ongoing' | 'past' | 'unconfirmed'`.
- `EventFilters = { category?: EventCategory; year?: number }`.
- `getEventGroups(events: readonly EventRecord[], today: string, filters?: EventFilters): { active: EventRecord[]; unconfirmed: EventRecord[]; past: EventRecord[] }`.
- `getFeaturedEvents(events: readonly EventRecord[], today: string): EventRecord[]`, limitado a três.
- `getEventYears(events: readonly EventRecord[]): number[]`, anos únicos decrescentes.
- `searchEvents(events: readonly EventRecord[], query: string): EventRecord[]`, reutilizando normalização de `src/utils/search.ts`.
- `getEventBadge(event: EventRecord, today: string): string`; `formatEventDates(event: EventRecord): string`, datas pt-BR sem conversão implícita de data UTC para dia anterior.
- `formatEventLocation(event: EventRecord): string`, combina os campos de localização conhecidos sem duplicá-los, ou retorna “Local a confirmar”. Usar nos cards e detalhes. Acrescentar teste de busca por município/localidade de evento fictício fora de Penedo.
- `useEventToday(): string`, compartilhado pelos componentes que dependem da data.

- [ ] Criar testes de limites e ordenação. Semana de segunda a domingo para “Neste fim de semana”; eventos em andamento têm prioridade sobre esse selo. Desempatar ordenação por título e, se igual, slug. Busca considera título, resumo, parágrafos, categoria traduzida, local, localidade e município e exclui rascunhos.

```ts
assert.equal(getPenedoDate(new Date('2026-10-15T02:59:59Z')), '2026-10-14');
assert.equal(getEventStatus(makeEvent(), '2026-10-14'), 'ongoing');
assert.equal(getEventStatus(makeEvent(), '2026-10-15'), 'past');
const virada = makeEvent({ startDate: '2026-12-30', endDate: '2027-01-02' });
assert.deepEqual(getEventYears([virada]), [2027, 2026]);
assert.equal(getEventGroups([virada], '2026-10-14', { year: 2027 }).active.length, 1);
assert.equal(getFeaturedEvents([makeEvent({ published: false })], '2026-10-14').length, 0);
```

- [ ] Rodar `npx tsx --test src/events/__tests__/eventUtils.test.ts` e confirmar falha antes de implementar.
- [ ] Implementar funções puras sem mutar o cadastro; confirmar que eventos sem dia, mas com expectedMonth, aparecem no ano previsto; os sem qualquer data/mês continuam excluídos de filtros anuais. Incluir teste de quatro elegíveis retornando apenas três e ordenação de passados por encerramento decrescente.
- [ ] Testar programação mensal: `makeEvent({ startDate: undefined, expectedMonth: '2026-12' })` permanece `unconfirmed`, entra no filtro de 2026, não ocupa destaque e formata “Dezembro de 2026 — data a confirmar”. `getEventYears` também considera `expectedMonth`. Em fixtures fictícias de dois encontros em Penedo nos dias 03 e 17/10, usar dois registros: em 14/10 o primeiro está no histórico e o segundo nos próximos, sem simular atividade contínua.
- [ ] Implementar o hook com leitura inicial, verificação a cada 30 segundos, atualização em `focus` e `visibilitychange`, atualizando estado apenas quando o dia mudar e removendo listeners/timer no cleanup. A virada é refletida em até 30 segundos numa aba ativa e imediatamente ao retornar à aba.
- [ ] Rodar `npm run test:events` e `npm run lint`; esperar sucesso. A verificação real do hook no navegador pertence à tarefa 7.
- [ ] Commit: `feat: classificar eventos e preservar historico por data`.

## Tarefa 3: URLs estáveis de agenda e evento

**Arquivos:** alterar `src/types.ts`, `src/routing/routeConfig.ts`, `src/routing/routeHelpers.ts`; criar `src/routing/__tests__/events.test.ts`.

**Interfaces:** adicionar `eventos` e `evento-detalhe` ao tipo `Page`, `event` a `RouteKind`, `eventSlug: string | null` a `RouteResolution` e inicializar o campo em todos os retornos. `getEventPath(slug: string): string`. Estender `parsePath(rawPath: string, events: readonly EventRecord[] = EVENTS): RouteResolution` e `buildPath(page: Page, premiumSlug: string | null, blogArticle: string | null, eventSlug: string | null = null): string`. O parâmetro opcional de catálogo permite testar rotas com fixtures sem mudar a produção.

- [ ] Criar testes:

```ts
assert.equal(parsePath('/eventos/').page, 'eventos');
assert.equal(parsePath('/eventos/evento-teste-2026/', [makeEvent()]).eventSlug, 'evento-teste-2026');
assert.equal(parsePath('/eventos/evento-teste-2026/', [makeEvent({ published: false })]).page, '404');
assert.equal(parsePath('/eventos/inexistente/', []).page, '404');
assert.equal(buildPath('evento-detalhe', null, null, 'evento-teste-2026'), '/eventos/evento-teste-2026/');
```

- [ ] Rodar `npx tsx --test src/routing/__tests__/events.test.ts`; confirmar falha inicial.
- [ ] Registrar a rota fixa e o padrão `/eventos/:slug`; resolver apenas eventos publicados, independentemente de estarem encerrados. Cobrir versões com e sem barra e rejeitar segmentos extras. Manter todas as assinaturas antigas utilizáveis.
- [ ] Rodar `npm test` e `npm run lint`; esperar ausência de regressões nas rotas antigas.
- [ ] Commit: `feat: adicionar rotas permanentes da agenda`.

## Tarefa 4: Cards ampliados e destaque da inicial

**Arquivos:** criar `DESIGN.md`, `src/events/EventCard.tsx`, `src/events/EventsHighlight.tsx`, `src/events/__tests__/presentation.test.ts`.

**Interfaces:** `EventCard({ event, today }: { event: EventRecord; today: string }): React.JSX.Element`; `EventsHighlight({ events = EVENTS }: { events?: readonly EventRecord[] }): React.JSX.Element`. O destaque usa `useEventToday`, `getFeaturedEvents` e o card; o card usa o link de evento da tarefa 3. O arquivo de apresentação renderiza com `MemoryRouter` usando o padrão de teste React já adotado no projeto.

- [ ] Registrar em `DESIGN.md` os tokens existentes, escopo da agenda, referência 600 × 400, proporção 3:2, grade com duas colunas a partir de 1024 px, imagens sem corte e títulos de 24 px no celular/28 px no desktop. Não redesenhar o restante do portal.
- [ ] Criar teste de conteúdo e navegação: HTML de um card contém título, data e `/eventos/evento-teste-2026/`; destaque com coleção vazia contém “Ver agenda completa” e a mensagem exata da especificação. Não usar testes que apenas procurem nomes de classes CSS.
- [ ] Rodar `npx tsx --test src/events/__tests__/presentation.test.ts`; confirmar falha inicial.
- [ ] Implementar card independente de `InfoCard`: contêiner `max-w-7xl`, espaçamento entre cards de 24 px, grade `grid-cols-1 lg:grid-cols-2`, área `aspect-[3/2]`. Imagem com `object-contain`, carregamento preguiçoso e placeholder acessível para imagem ausente/quebrada; nenhuma informação sobreposta ao cartaz. Mesmo com um único evento, não esticar o card para duas colunas. Textos longos quebram linha, inclusive palavras/URLs compridas.
- [ ] Implementar o destaque com os textos da especificação, foco visível, link descritivo e placeholder compacto quando vazio. Não reutilizar a altura fixa dos carrosséis existentes para uma seção que pode ter duas linhas.
- [ ] Usar o título regional e `formatEventLocation` no card. O link secundário para o calendário é conectado na tarefa 5, com a mesma configuração usada na página da agenda.
- [ ] Rodar testes de apresentação e `npm run lint`; esperar sucesso. Medidas e acessibilidade visual serão verificadas no navegador na tarefa 7.
- [ ] Commit: `feat: criar cards ampliados para eventos`.

## Tarefa 5: Agenda, detalhe, menu e busca

**Arquivos:** criar `src/pages/EventsPage.tsx`, `src/pages/EventDetailPage.tsx`, `src/events/eventSEO.ts`, `src/events/eventSources.ts`, `src/events/__tests__/seo.test.ts`; alterar `src/schema/event.ts`, `src/App.tsx`, `src/pages/HomePage.tsx` e o teste de apresentação.

**Interfaces:**

- `EventsPage({ events = EVENTS }: { events?: readonly EventRecord[] }): React.JSX.Element`.
- `EventDetailPage({ events = EVENTS }: { events?: readonly EventRecord[] }): React.JSX.Element`, obtendo `slug` do React Router.
- `getEventsSEO(events: readonly EventRecord[]): React.ComponentProps<typeof SEO>` e `getEventSEO(event: EventRecord, today: string): React.ComponentProps<typeof SEO>`.
- `getEventSchema(event: EventRecord, today: string): Record<string, unknown> | null`, substituindo a interface anterior sem consumidores identificados. Retorna null sem data, local, endereço, município e UF confirmados; usa apenas valores cadastrados. Não alterar schemas de estabelecimentos.
- Em `src/events/eventSources.ts`, exportar `REGIONAL_CALENDAR = { year: 2026, url: 'https://itatiaia.rj.gov.br/wp-content/uploads/2026/01/PDF-Impressao-1-1.pdf', sourceName: 'Prefeitura de Itatiaia', sourceUrl: 'https://www.instagram.com/prefeitura.itatiaia/' } as const`. Este objeto não entra no catálogo de eventos.

- [ ] Criar testes para agenda vazia, detalhe encerrado, detalhe inexistente e metadados. Exemplo: `assert.equal(getEventSchema(makeEvent({ startDate: undefined }), '2026-10-14'), null)`. Para evento datado com local/endereço/município/UF e sem preço, confirmar `schema.offers === undefined`; para evento sem organizador, `schema.organizer === undefined`. Detalhe encerrado não contém link `ticketUrl`, mas mantém título e datas.
- [ ] Rodar `npm run test:events`; confirmar falhas dos novos comportamentos.
- [ ] Implementar agenda com os três grupos e filtros acessíveis de ano/categoria, botão limpar, estados vazios exatos e mesmo card em todos os grupos. Usar o conjunto inteiro publicado para opções de ano, sem fazer opções desaparecerem ao filtrar.
- [ ] Implementar o bloco do calendário antes dos filtros, disponível também na agenda vazia, e o link secundário na inicial. Usar os rótulos exatos da especificação, `target="_blank"`, `rel="noopener noreferrer"` e indicação de nova aba. Não usar iframe, pré-carregamento ou download automático. Testar o href exato, ano explícito e crédito com link; não depender de disponibilidade da rede para os testes.
- [ ] Exibir o esclarecimento de que o PDF é o calendário regional completo, enquanto o site seleciona Penedo e localidades próximas. Não extrair automaticamente entradas de Quatis ou Porto Real desse link.
- [ ] Implementar detalhe com imagem integral, parágrafos de texto React, datas/horários conhecidos, informações editoriais e links válidos; sem `dangerouslySetInnerHTML`. Desconhecido/rascunho exibe `Page404` e SEO noindex próprio. Encerrado preserva conteúdo e omite compra ativa. Páginas emitem SEO uma única vez, usando canonical e breadcrumbs existentes.
- [ ] Implementar JSON-LD somente com dados confirmados; datas sem hora continuam datas sem hora. Ofertas exigem preço numérico e link de ingresso, ficam ausentes em eventos encerrados; preço zero confirmado pode representar gratuidade. Não inferir status de cancelamento a partir do encerramento. A agenda emite CollectionPage com links de eventos publicados, e todas as páginas válidas têm breadcrumb.
- [ ] Usar `municipality` e `state` em `addressLocality` e `addressRegion`; omitir código postal não cadastrado. Testar fixture regional fictícia com município diferente de Itatiaia e conferir que não recebe Penedo/Itatiaia por padrão. Mostrar “Fonte: <sourceName>” com `officialUrl` quando ambos existirem; a Prefeitura não é creditada automaticamente em eventos de outras fontes. Revisar título, descrição e compartilhamento para a abrangência regional.
- [ ] Registrar carregamento tardio das páginas e rotas React em `App.tsx`, links “Eventos” antes de “Blog” nos dois menus e rodapé. Incluir `eventSlug` nas dependências dos efeitos de rolagem e acompanhamento de navegação para mudança entre eventos. Usar o slug de evento onde os acompanhamentos já recebem slug; preservar consentimento existente.
- [ ] Inserir destaque na posição aprovada em `HomePage.tsx`. Busca de eventos em grupo próprio, com a grade ampliada, abaixo dos resultados de estabelecimentos; somar ambos para contagem e estado sem resultados. Eventos históricos exibem selo; cada resultado abre a página em vez do modal. Testar busca sem acentos e por local, incluindo um rascunho que não pode aparecer.
- [ ] Rodar `npm test` e `npm run lint`; esperar sucesso. Testes reais de filtros, navegação e mudança de metadados pertencem à tarefa 7.
- [ ] Commit: `feat: integrar agenda e paginas de eventos ao portal`.

## Tarefa 6: Publicação estática e instruções editoriais

**Arquivos:** alterar `scripts/site-routes.js`, `scripts/build.js`; criar `src/events/__tests__/siteRoutes.test.ts` e `docs/eventos.md`.

**Interfaces:** em `site-routes.js`, adicionar `loadEvents()` interno lendo JSON e aceitar catálogo opcional em `discoverSiteRoutes(events = loadEvents())` e `discoverPrerenderRoutes(events = loadEvents())`, preservando chamadas sem argumentos existentes. A função mantém descoberta atual de estabelecimentos/artigos e acrescenta `/eventos/` e eventos publicados.

- [ ] Criar testes com fixtures: ambos os descobridores incluem evento passado publicado; nenhum inclui rascunho. Asserções `assert.ok(discoverSiteRoutes([makeEvent()]).includes('/eventos/evento-teste-2026/'))` e `assert.ok(discoverPrerenderRoutes([]).includes('/eventos/'))`.
- [ ] Rodar `npx tsx --test src/events/__tests__/siteRoutes.test.ts`; confirmar falha inicial.
- [ ] Implementar descoberta e configurações de sitemap: agenda `daily/0.8`, detalhes `weekly/0.7`. Executar `npm run validate:events` no início de `scripts/build.js`, antes de gerar arquivos. Reutilizar a pré-renderização existente e as regras genéricas de hospedagem, sem introduzir fallback SPA.
- [ ] Documentar cadastro, categorias, duas datas para atrações sazonais, edição anual com slug novo, limites do HTML estático e imagens locais preferencialmente 1200 × 800. Incluir exemplo fictício claramente identificado apenas na documentação, não no JSON público.
- [ ] Documentar localidade, município, UF, fonte e data da conferência. Incluir os links do calendário e do Instagram, a identificação da edição 2026 e a necessidade de verificar cada evento antes de cadastrá-lo. Não declarar que o PDF completo já foi conferido; o conteúdo completo do PDF não foi lido, mas as imagens de outubro a dezembro fornecidas pelo usuário foram transcritas e são a base do cadastro inicial.
- [ ] Preencher `src/data/events.json` a partir da transcrição, após os testes com fixtures: cinco registros de outubro, seis de novembro e 13 de dezembro, total 24. Separar datas não consecutivas; manter intervalos consecutivos, a Temporada da Truta de 02/10 a 01/11 e dois registros com `expectedMonth` sem datas completas. Criar slugs distintos por data e local. Preservar grafias incertas identificadas na transcrição até conferência editorial, sem corrigir nomes silenciosamente.
- [ ] Cada registro recebe resumo/descrição factual, `officialUrl` do PDF, `sourceName: 'Prefeitura de Itatiaia — calendário regional'` e `updatedAt: '2026-10-14'` como data de transcrição. Descrever “Programação divulgada no calendário regional; consulte a fonte para atualizações”. Não adicionar preços, horários, ingressos, imagens ou organizador sem informação. Para a Temporada da Truta, usar `locationName` com a abrangência textual completa e omitir município/UF únicos. Registros ficam publicados com essa atribuição explícita; nada é publicado na hospedagem nesta tarefa.
- [ ] Acrescentar `src/events/__tests__/initialContent.test.ts` com contagem 24, dois registros mensais, datas válidas, slugs únicos, todos com fonte, intervalo correto da Truta e ausência de eventos de Quatis/Porto Real. Executar `npm run validate:events` e `npm test`. A contagem fixa valida esta importação; atualizar o teste quando novas entradas editoriais forem acrescentadas, sem limitar a capacidade do cadastro a 24.
- [ ] Rodar testes de rotas estáticas e `npm run validate:events`. A prova do HTML de um evento ocorre em ambiente isolado na tarefa 7.
- [ ] Commit: `feat: gerar paginas estaticas e sitemap de eventos`.

## Tarefa 7: Verificação integrada e visual

**Arquivos:** criar `tests/events.e2e.js`, `tests/helpers/events-workspace.js`; alterar `package.json` com `test:events:e2e` = `node --test tests/events.e2e.js`.

**Interfaces:** `createEventsWorkspace(): Promise<{ root: string; dispose(): Promise<void> }>` em arquivo de testes. Cria pasta com `mkdtemp` no diretório temporário, copia `src`, `public`, `scripts`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`; conecta `node_modules` com junction no Windows e symlink em outros sistemas. Usa um cadastro fictício somente nessa cópia. A limpeza verifica o caminho absoluto sob a pasta temporária criada e remove a junction separadamente, sem seguir seu destino. Se a ligação não for permitida, reportar limitação sem alterar o cadastro do projeto real.

- [ ] Criar fixtures na cópia isolada: evento atual, quatro futuros, passado, sem data, rascunho, virada de ano, cartaz vertical local, imagem deliberadamente quebrada e título longo. Gerar um cartaz de teste simples, identificado como fictício; a imagem quebrada é usada apenas na fase de navegador e removida antes do build validado.
- [ ] Inicializar Vite e Puppeteer seguindo o padrão de `tests/routing-history.e2e.js`, com porta disponível, acesso local e cleanup em `finally`. Congelar o relógio do navegador por `evaluateOnNewDocument` sem adicionar flags de teste ao código de produção. Verificar primeiro que os novos testes falham se o comportamento correspondente estiver ausente; corrigir a implementação na tarefa responsável.
- [ ] Testar home → agenda → detalhe, links do rodapé/menu móvel, voltar/avançar e troca entre dois eventos. Verificar uma única canonical, título atualizado, conteúdo correto e rolagem ao topo. Testar busca por termo sem acento, filtros combinados, limpar, rascunho/slug inválido e ausência de compra para encerrados.
- [ ] Testar um evento fictício fora de Penedo: localização correta no card/detalhe, busca por município e metadados sem endereço fixo de Itatiaia. Na coleção vazia, confirmar que calendário e crédito continuam visíveis, com os links exatos; confirmar ausência de iframe/download automático do PDF.
- [ ] Testar relógio de `2026-10-15T02:59:59Z` para `2026-10-15T03:00:01Z`: evento de 14/10 passa de atual a histórico após atualização da aba e some do destaque. Confirmar também atualização em aba ativa dentro do intervalo de 30 segundos. Não esperar uma meia-noite real.
- [ ] Medir cards em 1440 px e 1920 px: duas colunas, terceiro card na linha seguinte, imagens entre 580–620 px de largura e razão largura/altura 1.5 com tolerância 0.02. Em 390 px e 768 px: uma coluna, largura sem ultrapassar área útil. Verificar `scrollWidth <= clientWidth`, cartaz integral, placeholder de erro e foco por teclado. Capturar e inspecionar screenshots da inicial, agenda e detalhe; salvar em `artifacts/agenda/` sem dados privados.
- [ ] Executar `npm run build` na cópia isolada com eventos válidos. Confirmar `dist/eventos/index.html`, `dist/eventos/<slug>/index.html`, evento passado no sitemap e ausência de rascunho. Conferir títulos, canonical e JSON-LD no HTML gerado, não apenas no DOM em desenvolvimento. Remover a cópia ao terminar. Não afirmar teste de resposta HTTP Apache com base no servidor Vite; validar regras existentes por inspeção/testes, registrar que a resposta HTTP depende do ambiente de hospedagem.
- [ ] No projeto real, registrar o diff inicial do sitemap em arquivo de apoio fora do Git e preservar seu conteúdo antes do build. Rodar `npm run lint`, `npm test`, `npm run validate:db`, `npm run validate:events`, `npm run test:routing:e2e`, `npm run test:events:e2e` e `npm run build`, com a programação inicial cadastrada e sem fixtures no cadastro público. Se o build regenerar o sitemap de trabalho, restaurar exatamente o conteúdo anterior desse arquivo após conferir a saída em `dist`; não usar checkout para apagar alterações do usuário.
- [ ] Esperar comandos concluídos com sucesso e nenhum teste relevante ignorado. Se Chromium não estiver disponível, registrar que a validação visual/E2E permanece pendente, sem apresentar o skip como aprovação. Revisar diff final e seleção de arquivos antes do commit `test: validar agenda responsiva e historico de eventos`.

## Entrega e revisão do plano

Entregar a área funcionando localmente, relatório curto das verificações e capturas do layout. Informar que o catálogo inicial usa as imagens fornecidas, com identificação da fonte, datas previstas, dois itens sem dia definido e ausência de horários/preços/cartazes individuais não informados. Publicação em hospedagem é etapa posterior.

Recomendação de execução: **nesta conversa, pelo agente principal**, pois as sete tarefas compartilham contratos de dados, datas e rotas e têm uma ordem clara. A alternativa é implementação por subagentes com revisão independente por tarefa, com maior custo de contexto. A revisão do plano e a escolha do usuário precedem a implementação, conforme a skill de planejamento.

Autorrevisão concluída: requisitos da especificação distribuídos nas sete tarefas; dois cards por linha e proporção 3:2 consistentes; contratos de tipos e rotas compatíveis entre tarefas; cinco riscos de revisão cobertos; testes fictícios separados do cadastro público; nenhum código do site alterado nesta etapa de planejamento.
