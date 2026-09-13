# Padronização de descrições e selos dos cards

## Objetivo

Uniformizar a apresentação resumida dos estabelecimentos sem alterar dados, rotas ou o conteúdo completo exibido nas páginas e modais.

## Escopo

- Limitar descrições dos cards a três linhas, com altura visual uniforme e alinhamento pelo topo.
- Reservar espaço consistente para avaliação e descrição.
- Exibir o selo dourado somente quando `isPremium === true`, sempre com o texto `RECOMENDADO`.
- Preservar as tags de categoria, imagens, logos, textos, avaliações, links e comportamento dos cards.
- Aplicar a regra aos cards da Home, categorias, carrosséis e demais cartões de estabelecimentos reutilizados no site.
- Corrigir o enquadramento da logo da Pousada Villa Luna sem alterar o arquivo original.
- Reorganizar os modais para apresentar endereço, horário, Tripadvisor e descrição nessa ordem.
- Priorizar os links originais de Maps e preencher somente endereços e avaliações confirmados pelas fontes associadas.

## Verificação

- Comparar capturas antes/depois em desktop e mobile.
- Conferir clamp, alinhamento, sobreposição, altura e rolagem horizontal nas principais rotas.
- Conferir modais com e sem horário, nota e Tripadvisor em desktop e mobile.
- Executar checagem de tipos, testes e build.
- Não realizar commit, push ou deploy.
