# Contrato de mensuração — GTM e GA4

O frontend é a fonte única para mudanças de rota da SPA e envia o evento
`page_view` por `pushPageView`. No container `GTM-TTVH4RFS`:

- mantenha apenas uma tag GA4 para o evento `page_view`;
- desative o rastreamento adicional de mudanças no histórico;
- não crie um segundo gatilho de History Change para visualizações de página;
- use `page_path`, `page_title` e `page_location` enviados pela aplicação;
- configure o ID de medição `G-5Z02CCVEL0` somente no GTM;
- publique tags de Analytics apenas quando `analytics_storage` estiver concedido;
- teste aceite e recusa no Preview do GTM e no DebugView do GA4.

Eventos de conversão e interação usam nomes e parâmetros em `snake_case`.
O frontend não envia mais a estrutura legada `custom_event`, `eventAction`,
`eventCategory` e `eventLabel`.
