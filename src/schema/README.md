# Documentação Interna: Arquitetura de Schemas (Dados Estruturados)

Esta pasta contém a arquitetura modular e escalável para geração de dados estruturados (JSON-LD) no portal Vem Pra Penedo.

## Estrutura de Arquivos

- `organization.ts`: Dados estruturados da organização (Vem Pra Penedo).
- `website.ts`: Dados estruturados do site com suporte para caixa de busca (`SearchAction`).
- `breadcrumb.ts`: Geração de caminho de navegação (`BreadcrumbList`).
- `localBusiness.ts`: Geração dinâmica para estabelecimentos (filtrando e customizando para `Restaurant`, `Hotel` e `TouristAttraction`).
- `event.ts`: Estrutura pronta para eventos futuros.
- `article.ts`: Dados estruturados para artigos de blog (`BlogPosting`).
- `faq.ts`: Estrutura pronta para FAQPage.
- `index.ts`: Ponto de entrada que exporta todos os esquemas.

---

## Como Adicionar Novos Schemas

Para criar um novo tipo de schema (por exemplo, `Review` ou `FAQPage` específico):
1. Crie um arquivo em `src/schema/novoSchema.ts`.
2. Implemente a função de mapeamento retornando o objeto JSON-LD.
3. Exporte-o no arquivo `src/schema/index.ts`.
4. Importe e utilize no componente `SEO` correspondente.

---

## Como Cadastrar Novas Categorias

No arquivo `localBusiness.ts`, os estabelecimentos são refinados de acordo com a categoria. Para adicionar novas categorias (como `Cervejarias`, `Chocolateiras`, `Museus`):
1. Abra `src/schema/localBusiness.ts`.
2. Encontre a seção de customizações específicas de categoria (`category specific customizations`).
3. Adicione uma nova verificação condicional:
   ```typescript
   else if (categoryLower === 'cervejas' || categoryLower === 'cervejaria') {
     baseSchema["@type"] = "Brewery";
     baseSchema["priceRange"] = "$$";
   }
   ```
4. Exporte e compile o projeto. O sitemap e os dados estruturados de SEO serão atualizados automaticamente.

---

## Integração com o Componente SEO

Os Schemas são injetados diretamente no `<head>` usando a biblioteca `react-helmet-async` por meio do componente unificado `SEO`. Exemplo de uso:

```tsx
import SEO from './components/SEO';
import { getOrganizationSchema, getWebSiteSchema, getBreadcrumbSchema } from './schema';

// Dentro do seu componente React:
<SEO
  title="Título da Página"
  description="Descrição"
  canonical="https://vemprapenedo.com.br/caminho"
  schema={[
    getOrganizationSchema(),
    getWebSiteSchema(),
    getBreadcrumbSchema([
      { name: 'Início', item: 'https://vemprapenedo.com.br/' },
      { name: 'Página Atual', item: 'https://vemprapenedo.com.br/caminho' }
    ])
  ]}
/>
```
