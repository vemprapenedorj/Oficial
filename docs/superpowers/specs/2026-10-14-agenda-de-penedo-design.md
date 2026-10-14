# Agenda de Penedo — especificação

Data: 14 de outubro de 2026.
Estado: estrutura aprovada na conversa; revisão visual solicitada pelo usuário incorporada: cartões maiores, com imagens de referência de 600 × 400 px.

## Objetivo e escopo aprovado

Dar ao visitante do Vem Pra Penedo uma forma de descobrir eventos, comemorações e atrações sazonais, planejar sua visita e consultar as edições anteriores. A área reúne um destaque na página inicial, uma página acessível pelo menu e páginas individuais permanentes.

A solução acompanha a identidade visual atual e usa o processo existente de atualização dos dados e publicação do site. Não inclui painel administrativo, inscrições, venda de ingressos, integração com calendários ou publicação automática de fontes externas.

## Experiência do visitante

### Página inicial

Adicionar a seção “Acontece em Penedo” imediatamente após o carrossel Premium e antes da busca. Subtítulo: “Eventos, comemorações e experiências para aproveitar Penedo em cada época do ano.”

Exibir até três cartões de eventos com datas confirmadas: primeiro os que estão em andamento, depois os próximos. Dentro de cada grupo, ordenar pela data de início crescente, com desempate pelo título. Os próximos eventos podem estar em qualquer data futura; não limitar a uma janela arbitrária.

Cada cartão apresenta imagem, categoria, título, data ou período, local, resumo e link para os detalhes. Os cartões de eventos são maiores que os cartões padrão do site, com a imagem como principal elemento de destaque. Usar uma área de imagem na proporção 3:2, com referência de 600 × 400 px no desktop; essa medida se refere à imagem, e o conteúdo textual ocupa uma área adicional abaixo dela. A largura é responsiva, sem fixar 600 px em telas menores. Usar “Em cartaz” para eventos em andamento; “Neste fim de semana” para eventos futuros que comecem no sábado ou domingo da semana corrente; “Em breve” para os demais futuros. As datas explícitas acompanham os selos, evitando que estes sejam a única informação temporal.

O botão “Ver agenda completa” leva a `/eventos/`. Se não houver eventos elegíveis, manter uma seção compacta: “Novas experiências estão chegando. Acompanhe a agenda de Penedo.”, com o mesmo botão. Eventos passados e sem data confirmada não ocupam os três destaques.

No celular e em tablets estreitos, os cartões ficam em uma coluna e ocupam a largura disponível; a partir de 1024 px, usar no máximo duas colunas no contêiner amplo já utilizado pelo site. Manter o limite de três destaques na inicial: o terceiro, quando existir, inicia uma segunda linha com a mesma largura dos demais. A imagem mantém a proporção 3:2 em todas as telas. Usar títulos em destaque e espaço confortável para data, local e resumo abaixo da imagem. Preservar cores verdes, dourado, famílias tipográficas e cantos arredondados existentes, com foco de teclado visível e sem depender de animações para acessar o conteúdo.

Exibir imagens e cartazes integralmente dentro da área 3:2, sem distorção ou corte de textos, usando fundo neutro para preencher as sobras quando a proporção original for diferente. Não sobrepor selos, títulos ou botões ao cartaz. Preferir arquivos de 1200 × 800 px quando disponíveis para manter nitidez em telas de alta densidade; 600 × 400 px é a referência visual, não uma resolução obrigatória para o arquivo.

### Agenda completa

Criar `/eventos/`, com título “Agenda de Penedo”, introdução curta e links de navegação consistentes com as demais páginas. Incluir “Eventos” antes de “Blog” nos menus de desktop, celular e rodapé.

Usar o mesmo cartão ampliado da página inicial em todos os grupos da agenda, inclusive no histórico: imagem 3:2, até duas colunas no desktop e uma coluna em telas menores. Não reutilizar as dimensões compactas dos cartões de estabelecimentos.

A página contém três grupos, omitindo títulos vazios quando houver conteúdo nos demais:

1. “Em andamento e próximos”, com a mesma prioridade da página inicial, sem limite de três.
2. “Programação a confirmar”, para registros publicados sem datas confirmadas.
3. “Eventos anteriores”, em ordem decrescente da data de encerramento.

Filtros de categoria e ano atuam sobre os três grupos, começam em “Todas as categorias” e “Todos os anos” e podem ser limpos. Categorias iniciais: Cultura, Gastronomia, Comemorações e Atrações sazonais. As opções de ano derivam dos registros. Eventos que atravessam a virada do ano aparecem em ambos os anos; registros sem datas só aparecem em “Todos os anos”.

Sem resultados de um filtro: “Nenhum evento encontrado para estes filtros”, com ação “Limpar filtros”. Com o cadastro totalmente vazio: “A programação de Penedo será divulgada aqui. Volte em breve para conferir as novidades.”

### Página individual e histórico

Cada evento publicado tem endereço permanente `/eventos/<slug>/`. Exibir caminho de navegação Início → Eventos → título, título, categoria, imagem ou cartaz, descrição, datas, horários conhecidos, local e informações disponíveis sobre organizador e entrada. Links externos de ingressos ou informações só aparecem quando cadastrados.

Eventos encerrados mantêm descrição, imagens e endereço, recebem a indicação “Evento encerrado” e mostram um convite para consultar a programação atual. Remover a chamada ativa para compra de ingressos de eventos encerrados. Cada edição anual é um registro próprio, com ano no slug; uma nova edição não substitui a anterior.

Eventos sem data recebem “Programação a confirmar” e não exibem horários, preços ou informações presumidos. Imagens ausentes usam um tratamento gráfico neutro com ícone de calendário, sem simular um cartaz oficial. Um slug inexistente mostra a página 404 existente.

## Cadastro e regras de dados

Manter uma fonte única em `src/data/events.json`, consumida pelo frontend e pelos scripts de publicação, com um tipo específico em `src/events/types.ts`. Não adaptar eventos ao cadastro de estabelecimentos `DetailItem`: datas e arquivamento têm regras próprias.

Campos obrigatórios: identificador estável, slug único, título, resumo, descrição em parágrafos de texto, categoria e indicação de publicação. Campos opcionais: imagem local e texto alternativo, local e endereço, datas de início e fim, horários, organizador, texto sobre entrada, preço numérico confirmado, endereço de ingressos, endereço de informações oficiais e data da última atualização editorial.

Datas são armazenadas como `YYYY-MM-DD`; horários, quando conhecidos, como `HH:mm`, interpretados em `America/Sao_Paulo`. Não inferir um horário de meia-noite para a apresentação ou para dados estruturados. Para um evento de um dia, o fim pode ser omitido e assume a mesma data de início. Atrações de vários dias exigem fim explícito. Para programação a confirmar, omitir ambas as datas.

Validar slugs duplicados, categoria desconhecida, datas inválidas, fim anterior ao início, fim sem início, horários inválidos e preço negativo. Valores desconhecidos ficam ausentes: preço ausente não significa gratuito. A descrição é texto, sem HTML livre. Registros não publicados ficam fora da busca, das rotas, dos cartões, do sitemap e da pré-renderização.

O histórico é uma classificação por data, não uma cópia ou remoção do cadastro. Considerar o evento em andamento desde o início do primeiro dia até o final do último dia, no fuso de Penedo. A mudança para encerrado acontece no dia seguinte ao fim. Horários são informativos nesta versão; não encerrar um evento antes do fim do seu último dia.

A lógica recebe uma data de referência para permitir testes determinísticos. O navegador recalcula ao carregar, ao retornar para a aba e na virada do dia local. Não exigir nova publicação para atualizar a classificação de uma página aberta com JavaScript ativo.

## Integração com o site existente

- Componentes dedicados para cartão e destaque, páginas de agenda e detalhe, e funções puras de filtragem/classificação em `src/events/`. Reutilizar componentes visuais existentes quando fizer sentido, sem ampliar responsabilidades do blog.
- Adicionar as rotas e tipos em `src/types.ts`, `src/routing/routeConfig.ts`, `src/routing/routeHelpers.ts` e `src/App.tsx`. Acrescentar um campo próprio para o slug de evento à resolução de rotas, mantendo compatibilidade com chamadas existentes.
- Integrar eventos publicados à busca da página inicial por título, resumo, descrição, categoria e local. O resultado de evento abre sua página, não o modal de estabelecimento. Eventos históricos continuam pesquisáveis e recebem indicação de encerramento.
- Incluir agenda e páginas de eventos publicados na descoberta de rotas em `scripts/site-routes.js`, usada por sitemap e pré-renderização. Preservar páginas históricas no sitemap e gerar arquivos HTML para abertura direta e atualização do navegador na hospedagem atual.
- Usar títulos, descrições, imagem de compartilhamento e endereço canônico próprios, com barra final. Evitar metadados duplicados entre o controle global e a página individual.
- Adaptar `src/schema/event.ts` para só emitir informações efetivamente cadastradas: não presumir entrada gratuita, organizador Vem Pra Penedo ou endereço. Eventos com dados confirmados suficientes podem emitir Event; programação sem data não emite Event. Usar dados estruturados de navegação e coleção onde apropriado.

O HTML estático reflete a data do último build; o navegador atualiza os grupos conforme a data atual. Robôs que não executam JavaScript poderão ver a classificação do último build até a próxima publicação. Esta primeira versão não cria serviço ou agendamento de rebuild. Datas explícitas e páginas permanentes continuam disponíveis em ambos os casos.

## Conteúdo inicial e manutenção

Nenhum evento real foi fornecido nesta conversa. A implementação começa com cadastro de produção vazio e estados vazios completos. Usar registros fictícios apenas nos testes e nas verificações locais, sem incluí-los no pacote público como programação verdadeira.

Documentar o cadastro com os campos obrigatórios, exemplos claramente fictícios e orientação para adicionar uma edição anual sem sobrescrever a anterior. Datas, preços e programação reais dependem de material fornecido pelo usuário ou de fontes oficiais verificadas durante o cadastro. A entrega desta etapa prepara a área; o preenchimento da primeira programação é uma atividade editorial posterior.

## Critérios de aceitação e verificação

1. A agenda abre pelo menu desktop, menu móvel, rodapé e destaque da inicial, incluindo acesso direto e recarregamento da URL.
2. Uma coleção de teste com evento passado, atual, futuro e sem data resulta nos grupos corretos e em no máximo três destaques elegíveis.
3. Testes cobrem virada de dia no fuso de Penedo, duração de um dia, período entre anos, ordenação, filtros combinados e programação sem datas.
4. Um evento encerrado mantém a mesma URL, aparece no histórico e não oferece compra ativa de ingressos.
5. Registros não publicados ou slugs desconhecidos não geram páginas públicas; os desconhecidos retornam à experiência 404.
6. Busca, filtros, links e navegação por teclado funcionam em celular e desktop. Imagem ausente e coleção vazia não quebram o layout. Os cartões de eventos são visivelmente maiores que os de estabelecimentos, mantêm imagens 3:2 próximas de 600 × 400 px em desktop amplo e exibem no máximo duas colunas. Em celular não há rolagem horizontal, distorção de imagem ou corte de textos dos cartazes.
7. As rotas geradas, os metadados e os dados estruturados correspondem aos registros publicados, sem preços ou organizadores inventados.
8. Executar a checagem TypeScript, testes relevantes de rotas e eventos, validação dos dados e build com pré-renderização. Verificar visualmente inicial, agenda e detalhe com registros de teste isolados da produção.

## Limites da alteração

O trabalho fica restrito à área de eventos e às integrações necessárias. Há uma alteração preexistente em `public/sitemap.xml`; preservá-la e revisar qualquer diferença gerada pelo build antes de incluir o arquivo em um commit. Não publicar o site nesta etapa de especificação.
