# Manutenção da agenda

Atualização editorial de 19/10/2026: cadastrado o Encontro Internacional de Motociclistas de Penedo para 2027 com **data a confirmar**, conforme comunicado enviado pela organização. As propostas de julho e agosto não são datas oficiais. Sete fotos de edições anteriores aparecem identificadas no carrossel. O catálogo local passa a ter 16 eventos.

Atualização editorial de 19/10/2026: cadastrado o Penedo BBQ Festival de 04/09/2027, com arte da atração anunciada Munhoz & Mariano e sete fotos identificadas como registros da edição de 2026. O catálogo local passa a ter 15 eventos.

Atualização editorial de 16/10/2026: removido o Festival de Dança de Resende (12 e 13/12) da agenda pública, a pedido do usuário. O catálogo passa a ter 16 registros. A transcrição do calendário original permanece como referência histórica.

Baile Finlandês e Feira da Roça de Mauá são cadastrados em registros separados para cada edição de 2026. O texto de apresentação é reaproveitado entre as edições; a data do site vem de `startDate`, e cada cartaz tem a data correspondente. Não reaproveitar horários ou atrações de uma edição sem confirmação específica.

Atualização editorial de 15/10/2026: atualizado o evento Natal Luz em Penedo 2026 (20/11/2026 a 31/01/2027) com texto detalhado e carrossel de 5 fotos em proporção 3:2 (1200 × 800 px) na Colônia Finlandesa.

Atualização editorial de 15/10/2026: atualizadas as informações da Feira do Produtor Kirpputori (produtos regionais, bazar, 10h às 16h, todo segundo sábado, entrada franca e pet friendly).

Atualização editorial de 15/10/2026: atualizadas as informações do Baile Finlandês (dança folclórica PKY, polca e mazurka desde 1943, pista aberta, bar, estacionamento).

Atualização editorial de 15/10/2026: atualizadas as informações e atrações da Feira da Roça em Visconde de Mauá (comidas típicas, artesanato local, show de prêmios e shows ao vivo).

Atualização editorial de 15/10/2026: removido também o Desafio SEMEL Sem Limites (06/12), a pedido do usuário. O catálogo passa a ter 17 registros.

Atualização editorial de 15/10/2026: removidas a pedido do usuário as apresentações de Teatro (05–06/12) e Música (09–10/12) da Escola das Artes. O catálogo passa a ter 18 registros.

Critério editorial: priorizar programação voltada aos turistas. Em 15/10/2026, o Fórum Alimenta (10 e 11/11) foi removido a pedido do usuário por ser voltado ao público empresarial. O catálogo passa a ter 20 registros.

Atualização editorial de 15/10/2026: removidas, a pedido do usuário, as três edições da Feira da Roça de Capelinha (04/10, 01/11 e 06/12). A seleção ativa passa de 24 para 21 registros; as edições de Visconde de Mauá permanecem. A transcrição original continua preservada como referência histórica.

A agenda usa `src/data/events.json`. Cada registro possui id e slug únicos, título, resumo, descrição em parágrafos, categoria e published. Use published false para rascunhos. Preserve os slugs já publicados, inclusive após o evento.

Informe datas como YYYY-MM-DD. endDate é inclusiva: o evento continua ativo durante todo o último dia no fuso America/Sao_Paulo. Para programação sem dia definido, use expectedMonth YYYY-MM; se apenas o ano estiver confirmado, use expectedYear YYYY. Omita startDate/endDate nos dois casos. O histórico é calculado automaticamente, sem apagar registros. `scheduleNotice` permite destacar uma atualização importante sobre a data na página de detalhe.

O recorte editorial inclui Penedo, Visconde de Mauá, Serrinha, Capelinha, Resende e Itatiaia. Não cadastrar Quatis ou Porto Real. Cadastre somente programação respaldada por fonte; não inferir gratuidade, horários, endereços ou organizadores.

Cartazes e fotos dos eventos ficam na pasta exclusiva `public/assets/imagens/eventos/`. É possível criar subpastas por ano e evento. Após adicionar o arquivo, associe-o ao registro em `src/data/events.json`, por exemplo com `image: "/assets/imagens/eventos/nome-do-arquivo.webp"` e `imageAlt` descritivo; os arquivos não são exibidos automaticamente. O espaço é 3:2 e preserva o cartaz inteiro, inclusive cartazes verticais. Sem imagem, aparece uma composição de calendário. A grade tem no máximo dois cards por linha e uma coluna abaixo de 1024px.

Campos opcionais: locationName, locationAddress, locality, municipality, state, startTime, endTime, organizerName, entryText, price, ticketUrl, officialUrl, sourceName, updatedAt. Preço zero significa gratuidade confirmada; ausência significa desconhecido. O schema Event exige data e endereço completos, sem completar dados ausentes.

Os 24 registros iniciais foram transcritos das imagens de outubro a dezembro fornecidas pelo usuário, selecionados conforme docs/eventos/programacao-outubro-dezembro-2026.md. O ano 2026 decorre do calendário informado; não houve confirmação independente de alterações posteriores. O link externo aponta para o calendário regional completo.

Antes de publicar: npm run validate:events, npm run lint, npm test, npm run test:events:e2e e npm run build. O build inclui eventos publicados na pré-renderização e no sitemap, mantendo o histórico. Não publicar somente o fallback SPA.

Para uma nova edição anual, crie outro registro e outro slug; mantenha a edição anterior. As categorias são cultura, gastronomia, comemoracoes, atracoes-sazonais e esportes. Prefira cartazes com 1200 × 800 px; o espaço de exibição mede aproximadamente 600 × 400 px no computador.

Fontes da seleção de 2026:
- Calendário completo: https://itatiaia.rj.gov.br/wp-content/uploads/2026/01/PDF-Impressao-1-1.pdf
- Divulgação: https://www.instagram.com/prefeitura.itatiaia/

O navegador atualiza os status pelo dia de São Paulo. O HTML estático reflete a data do último build; execute outro build para atualizar o conteúdo inicial servido a leitores sem JavaScript e aos robôs. A validação local não substitui a conferência das respostas HTTP no servidor da hospedagem.

Exemplo fictício, somente para documentação:
```json
{"id":"exemplo-2027","slug":"evento-exemplo-2027","title":"Evento de exemplo","summary":"Exemplo de cadastro, não publicar.","description":["Substituir por informações verificadas."],"category":"cultura","published":false,"expectedMonth":"2027-05","locality":"Penedo"}
```

## Várias imagens no mesmo evento

Para ativar o carrossel, cadastre `images` no evento. A ordem da lista define a ordem de exibição; a primeira imagem é a capa usada nos metadados. Exemplo de estrutura (substitua os nomes por arquivos existentes):

```json
"images": [
  { "src": "/assets/imagens/eventos/evento-capa.webp", "alt": "Cartaz do evento" },
  { "src": "/assets/imagens/eventos/evento-programacao.webp", "alt": "Programação do evento", "caption": "Foto da edição anterior" }
]
```

Uma lista com duas ou mais imagens ativa setas e indicadores clicáveis na inicial, na agenda e no detalhe. Não há troca automática. Com uma imagem, os controles ficam ocultos. A imagem inteira é preservada; para preencher o espaço, prefira proporção 3:2. O campo legado `image` continua funcionando quando `images` não tem itens. Colocar arquivos na pasta não basta: associe-os ao evento nesta lista.

`caption` é opcional e aparece sobre a foto, permitindo distinguir registros de edições anteriores de cartazes atuais.
