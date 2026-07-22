# Publicação na Hostinger

## Antes de publicar

O domínio oficial indexável deve usar estas variáveis durante o build:

```text
SITE_URL=https://vemprapenedo.com.br
VITE_SITE_URL=https://vemprapenedo.com.br
ALLOW_INDEXING=true
```

Se o ambiente de build da Hostinger não conseguir iniciar o Chromium, defina
também `SKIP_PRERENDER=true`. Sem essa variável, o build tenta pré-renderizar
as páginas e, se o Chromium estiver indisponível, publica a versão SPA
funcional como alternativa.

No subdomínio `homologacao.vemprapenedo.com.br`, mantenha
`ALLOW_INDEXING=false`. As demais URLs podem continuar apontando para o domínio
oficial nos metadados canônicos.

## Deploy automático pelo GitHub

A integração da Hostinger do domínio oficial deve acompanhar a branch `main`, executar
`npm ci` e depois `npm run build`, publicando a pasta `dist/`.

A implantação de testes deve publicar em
`homologacao.vemprapenedo.com.br`, com `ALLOW_INDEXING=false`. Na Hostinger,
associe essa implantação à raiz de documentos do subdomínio, e não ao
`public_html` do domínio oficial.

No GitHub Desktop, revise os arquivos, crie um commit e use **Push origin**.
A publicação será iniciada pela Hostinger após o push.

## Arquivos publicados

Somente o conteúdo da pasta `dist/` deve ser enviado para a pasta pública do domínio, normalmente `public_html/`. Não envie `src/`, `node_modules/`, testes ou arquivos de configuração do projeto.

O upload deve incluir arquivos ocultos. Confirme especialmente a presença de:

- `dist/.htaccess`;
- `dist/index.html`;
- `dist/robots.txt`;
- `dist/sitemap.xml`;
- `dist/site.webmanifest`;
- `dist/assets/`.

## Verificação após o deploy

1. Abrir a home e uma página de cada categoria.
2. Atualizar diretamente uma URL interna no navegador.
3. Confirmar uma página Premium e um artigo.
4. Confirmar que uma URL inexistente mostra a página 404.
5. Verificar `/robots.txt` e `/sitemap.xml`.
6. Testar os redirects antigos com uma ferramenta de status HTTP.

Redirects esperados:

```text
/contatos -> /contato
/blog/penedo-guia -> /blog/artigo/penedo-guia
/detalhe/casa-da-picanha -> /gastronomia/casa-da-picanha
```

Os redirects devem responder com status HTTP 301.
