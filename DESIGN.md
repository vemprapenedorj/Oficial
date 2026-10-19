---
name: Vem Pra Penedo — Agenda
colors:
  primary: "#064e3b"
  accent: "#d4af37"
  mint: "#d1fae5"
  text: "#1f2937"
  surface: "#ffffff"
  background: "#f6f8f6"
typography:
  heading:
    fontFamily: system-ui
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
  card-title:
    fontFamily: system-ui
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  card: 24px
  control: 12px
  button: 999px
spacing:
  gap: 24px
  section: 64px
components:
  event-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    textColor: "{colors.text}"
---

# Agenda de Penedo e Região

## Overview
Extensão da identidade existente. Direção editorial clara, verde profundo e dourado; foco em data, destino e programação. DESIGN_VARIANCE 3, MOTION_INTENSITY 2, VISUAL_DENSITY 4.

## Colors
Usar os tokens existentes penedo-forest, penedo-gold, penedo-mint e penedo-graphite. O dourado é detalhe gráfico; textos pequenos usam verde escuro com contraste.

## Typography
Família sans-serif do site. Títulos de card 24 px no celular e 28 px no desktop. Textos longos quebram linha; não cortar informações essenciais.

## Layout
Contêiner de 1280 px com 16 px nas laterais; duas colunas desde 1024 px e uma abaixo. Gap de 24 px. Imagem 3:2, aproximadamente 600 × 400 px; conteúdo textual abaixo. Um card não ocupa as duas colunas. Até três destaques, com o terceiro na segunda linha.

## Elevation & Depth
Bordas leves e sombras discretas. Sem sobreposições no cartaz. Background claro, com cabeçalho usando uma cena ilustrativa de eventos inspirada em Penedo e camada verde para contraste. A imagem decorativa foi criada a pedido do usuário; não representa um evento específico. Origem e prompt em docs/eventos-imagem-topo.md.

## Shapes
Cards com 24 px de raio, campos com 12 px e botões arredondados. Ícones Lucide já instalados.

## Components
Cartaz integral com object-contain. Artes horizontais 3:2 preenchem o espaço. Eventos com mais de uma imagem usam carrossel manual com setas e indicadores; controles são irmãos do link da imagem, nunca botões dentro de links. Sem cartaz, painel neutro com ícone, categoria e identificação de programação, nunca uma imagem oficial simulada. Estado encerrado mantém legibilidade. Foco de teclado visível.

## Do's and Don'ts
Manter duas colunas e proporção 3:2. Não reproduzir a grade do YouTube. Não inventar fotos, horários, preços ou localização. Respeitar reduced-motion. Não modificar estilos globais de cards existentes.
