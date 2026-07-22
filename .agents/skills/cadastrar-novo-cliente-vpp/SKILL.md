---
name: cadastrar-novo-cliente-vpp
description: Cadastra hotéis, pousadas, restaurantes, cafés, lojas, passeios, serviços e outros parceiros no site Vem Pra Penedo, seguindo a estrutura, dados, imagens, cards, páginas premium, SEO e padrões já existentes no projeto. Use quando o usuário pedir para adicionar, cadastrar, incluir ou publicar um novo cliente/parceiro no portal e fornecer seus dados.
---

# Cadastrar Cliente Vem Pra Penedo

Cadastre o parceiro diretamente no projeto informado pelo usuário. Preserve a arquitetura e os padrões vigentes do repositório; nunca invente campos, rotas, componentes ou convenções sem antes inspecionar um cadastro equivalente.

## Dados de entrada

Aceite texto livre, links, imagens/logos e informações parciais. Extraia os dados usando o modelo de [cadastro](references/cadastro.md). Pergunte somente pelos campos que impedem uma publicação correta.

Se o caminho do projeto não estiver disponível no contexto, peça-o antes de editar. Antes de qualquer alteração, localize as instruções do repositório (`AGENTS.md`, `README`, convenções) e os arquivos que abastecem os cadastros.

## Fluxo obrigatório

1. Inspecione de 2 a 3 clientes existentes na mesma categoria, incluindo um cliente comum e, se aplicável, um premium.
2. Identifique onde o projeto guarda: listagem/card, dados detalhados, rota/página, imagens, categorias, SEO e dados estruturados. Use os arquivos reais como fonte de verdade.
3. Normalize o identificador e o slug em minúsculas, sem acentos, com palavras separadas por hífen. Confirme que não há colisão.
4. Classifique o cliente na categoria já existente mais adequada. Não crie categoria nova sem solicitação explícita.
5. Cadastre todos os dados disponíveis, mantendo nomes de propriedades, formatação de telefones, links e convenções de imagem iguais aos dos exemplos equivalentes.
6. Para clientes premium, replique a estrutura do premium mais semelhante: página exclusiva, galeria, CTA, SEO/metadados e JSON-LD apenas se o projeto já os utilizar. Para não premium, mantenha o fluxo e popup/card padrões da categoria.
7. Use apenas imagens e logotipos disponibilizados pelo usuário ou que já existam no projeto. Salve-os na pasta e nomenclatura verificadas nos exemplos. Não gere nem baixe imagens sem autorização.
8. Atualize somente os arquivos necessários. Preserve mudanças preexistentes e não altere clientes não relacionados.
9. Execute as verificações disponíveis no projeto (tipagem, lint e/ou build) em proporção às alterações. Corrija erros introduzidos pelo cadastro.
10. Informe o que foi incluído, os arquivos alterados, o resultado da validação e qualquer pendência de informação, imagem ou publicação.

## Regras de qualidade

- Mantenha endereço, mapa, WhatsApp, Instagram, site, horários e categoria coerentes entre card e página detalhada.
- Prefira dados confirmados pelo usuário. Ao derivar endereço de um link de mapa, apresente-o como dado a confirmar se não houver certeza.
- Não marque um cliente como premium, recomendado/destaque ou parceiro pago sem indicação explícita do usuário ou dos dados fornecidos.
- Não invente preço, descrição institucional, horários, redes sociais, coordenadas, fotos ou avaliações. Use uma descrição curta neutra apenas se o padrão do projeto exigir conteúdo e o usuário autorizar.
- Ao receber imagens, inspecione dimensões e formato; preserve a proporção exigida pelo componente e evite textos/logos cortados.
- Se houver falta material de dados, entregue uma lista curta e objetiva dos itens restantes em vez de tentar concluir o cadastro incompleto.

## Saída esperada

Após concluir, apresente um resumo com nome, categoria, tipo de cadastro (comum ou premium), links/contatos adicionados, arquivos modificados e o status da validação. Se o usuário também pedir publicação, siga o fluxo de Git e deploy já usado pelo repositório, sem publicar por conta própria quando essa etapa não tiver sido solicitada.
