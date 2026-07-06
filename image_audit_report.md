# Image Audit Report

This report outlines the results of the project image audit.

## Summary
- **Total files in public/assets/imagens/**: 150
- **Used files**: 114
- **Unused/Orphaned files**: 36
- **Duplicate groups**: 2

## Unused/Orphaned Files
| File Path | Size (KB) |
| --- | --- |
| `/assets/imagens/blog/cachoeiras-penedo/Introdução.jpg` | 580.62 |
| `/assets/imagens/blog/melhores-hospedagens/.gitkeep` | 0.00 |
| `/assets/imagens/blog/melhores-hospedagens/hotel-britania1.jpg` | 194.17 |
| `/assets/imagens/blog/melhores-hospedagens/hotel-britania2.jpg` | 306.33 |
| `/assets/imagens/blog/melhores-hospedagens/hotel-britania3.jpg` | 126.29 |
| `/assets/imagens/blog/melhores-hospedagens/intro2.jpg` | 141.48 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-do-sol1.jpg` | 226.31 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-do-sol2.jpg` | 104.37 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-do-sol3.jpg` | 69.29 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-lago1.jpg` | 196.07 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-lago2.jpeg` | 108.17 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-lago3.jpg` | 304.42 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna1.jpg` | 202.09 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna2.jpg` | 281.44 |
| `/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna3.jpg` | 130.76 |
| `/assets/imagens/blog/melhores-hospedagens/santafe-penedo1.jpg` | 155.55 |
| `/assets/imagens/blog/melhores-hospedagens/santafe-penedo2.jpg` | 336.38 |
| `/assets/imagens/blog/melhores-hospedagens/santafe-penedo3.jpg` | 130.53 |
| `/assets/imagens/blog/melhores-restaurantes/.keep` | 0.07 |
| `/assets/imagens/blog/melhores-restaurantes/botegare1.jpg` | 740.34 |
| `/assets/imagens/blog/melhores-restaurantes/botegare2.jpg` | 376.21 |
| `/assets/imagens/blog/melhores-restaurantes/botegare3.jpg` | 214.32 |
| `/assets/imagens/blog/melhores-restaurantes/conclusao.jpg` | 752.28 |
| `/assets/imagens/blog/melhores-restaurantes/enoteca1.jpg` | 169.64 |
| `/assets/imagens/blog/melhores-restaurantes/enoteca2.jpg` | 150.79 |
| `/assets/imagens/blog/melhores-restaurantes/enoteca3.jpg` | 215.90 |
| `/assets/imagens/blog/melhores-restaurantes/intro-2.jpg` | 523.69 |
| `/assets/imagens/blog/melhores-restaurantes/jardim1.jpg` | 354.57 |
| `/assets/imagens/blog/melhores-restaurantes/jardim2.jpg` | 127.69 |
| `/assets/imagens/blog/melhores-restaurantes/jardim3.jpg` | 276.08 |
| `/assets/imagens/blog/melhores-restaurantes/jazzvillage1.jpg` | 66.80 |
| `/assets/imagens/blog/melhores-restaurantes/jazzvillage2.jpg` | 179.94 |
| `/assets/imagens/blog/melhores-restaurantes/jazzvillage3.jpg` | 857.39 |
| `/assets/imagens/blog/melhores-restaurantes/trutas1.jpg` | 280.25 |
| `/assets/imagens/blog/melhores-restaurantes/trutas2.jpg` | 302.38 |
| `/assets/imagens/blog/melhores-restaurantes/trutas3.jpg` | 268.58 |

## Duplicate Files
### Group 1 (Hash: `d874406a`)
- `/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg` (Size: 580.62 KB) **[REFERENCED]**
- `/assets/imagens/blog/cachoeiras-penedo/Introdução.jpg` (Size: 580.62 KB) 

### Group 2 (Hash: `bc9c41f0`)
- `/assets/imagens/blog/cachoeiras-penedo/poco-das-esmeraldas.jpg` (Size: 216.04 KB) **[REFERENCED]**
- `/assets/imagens/logos/logo-poco-das-esmeraldas.jpg` (Size: 216.04 KB) **[REFERENCED]**

## All File References in Code
| Reference Path | Sources |
| --- | --- |
| `/assets/imagens/Logo.jpg` | src/App.tsx |
| `/assets/imagens/blog/cachoeiras-penedo/Cachoeira-de-Deus.jpg` | src/App.tsx |
| `/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg` | src/App.tsx |
| `/assets/imagens/blog/cachoeiras-penedo/poco-das-esmeraldas.jpg` | src/App.tsx |
| `/assets/imagens/blog/cachoeiras-penedo/poco-do-ceu.jpg` | src/App.tsx |
| `/assets/imagens/blog/cachoeiras-penedo/tres-cachoeiras.jpg` | src/App.tsx |
| `/assets/imagens/blog/melhores-hospedagens/intro.jpg` | src/App.tsx |
| `/assets/imagens/blog/melhores-restaurantes/intro.jpg` | src/App.tsx |
| `/assets/imagens/blog/penedo-guia/capa.jpg` | src/App.tsx |
| `/assets/imagens/blog/penedo-guia/guia-penedo-1.png` | src/App.tsx |
| `/assets/imagens/blog/penedo-guia/guia-penedo-2.png` | src/App.tsx |
| `/assets/imagens/blog/penedo-guia/guia-penedo-3.png` | src/App.tsx |
| `/assets/imagens/blog/penedo_blog_header.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-` | src/App.tsx |
| `/assets/imagens/logos/logo-aglio-e-olio.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-aguia-de-penedo.png` | src/App.tsx |
| `/assets/imagens/logos/logo-armazem-da-vila.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-arte-da-nossa-terra.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-artevelas.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-astral-exotheryca.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-bazzini-pizzeria.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-borbulha-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-botegare.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-braseiro-gaucho.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-cachoeira-deus.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-cafe-finlandes-penedo.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-casa-da-picanha.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-casa-do-fritz.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-clube-finlandia.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-delicias-da-carol.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-enoteca-serrana.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-estancia-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-expedicao-raizes.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-fue-gelateria.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-geek-penedo.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-hotel-bertell.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-britannia.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-casa-encantada.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-daniela.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-do-sino.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-girassol.png` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-rio-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-terras-finlandia.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-hotel-titanic.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-jardim-secreto.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-jazz-village.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-kahvila-cafe.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-kaiten-sushi.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-lelu-museu.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-loazo-resto.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-lolita-penedo.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-lugano-penedo.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-maria-cuisine.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-meu-sonho.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-museu-finlandes.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pequena-finlandia-shopping.jpg` | src/locais.json |
| `/assets/imagens/logos/logo-pequena-finlandia.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-petit-gourmet.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pizza-da-villa.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-poco-das-esmeraldas.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-aurora-mantiqueira.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-pousada-chez-nous.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-do-sol.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-lago.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-pousada-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-rainha-mata.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-pousada-reserva-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-santa-fe.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-terraco.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-pousada-villa-luna.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-querencia.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-raio-de-luz-decoracoes.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-rei-das-trutas.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-reserva-da-mata.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-restaurante-finlandes.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-rota-dos-passeios.png` | src/App.tsx |
| `/assets/imagens/logos/logo-santa-claus-burger.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-shopping-azul.jpg` | src/locais.json |
| `/assets/imagens/logos/logo-shopping-do-esquilo.jpg` | src/locais.json |
| `/assets/imagens/logos/logo-shopping-roda-dagua.jpg` | src/locais.json |
| `/assets/imagens/logos/logo-shopping-vale-duendes.jpg` | src/locais.json |
| `/assets/imagens/logos/logo-tonttulakki-suklaat.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-tres-cachoeiras.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-trilhando-penedo.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-truta-viva.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-vanilla-patisserie.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-vert-hotel.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-via-lactea-balas.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/logos/logo-vila-francesa-hotel.jpg` | src/App.tsx |
| `/assets/imagens/logos/logo-zero-a-zero.jpg` | src/App.tsx |
| `/assets/imagens/penedo_sightseeing.jpg` | src/App.tsx |
| `/assets/imagens/premium/` | src/App.tsx |
| `/assets/imagens/premium/casa-da-picanha/galeria-1.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/casa-da-picanha/galeria-2.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/casa-da-picanha/galeria-3.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/casa-da-picanha/galeria-4.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/casa-da-picanha/galeria-5.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/casa-da-picanha/galeria-6.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-1.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-2.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-3.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-4.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-5.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/expedicao-raizes/galeria-6.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-1.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-2.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-3.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-4.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-5.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-6.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-1.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-2.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-3.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-4.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-5.jpg` | src/App.tsx, src/locais.json |
| `/assets/imagens/premium/pousada-rainha-da-mata/galeria-6.jpg` | src/App.tsx, src/locais.json |
