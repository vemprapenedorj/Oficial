import React from 'react';
import SEO from '../components/SEO';
import { getBreadcrumbSchema } from '../schema';
import { Link } from 'react-router-dom';

type LegalPageKind = 'privacidade' | 'cookies';

interface LegalPageProps {
  kind: LegalPageKind;
  onGoBack: () => void;
}

const SITE_URL = 'https://vemprapenedo.com.br';
const UPDATED_AT = '15 de julho de 2026';

const pageContent = {
  privacidade: {
    title: 'Política de Privacidade',
    description: 'Saiba como o portal Vem Pra Penedo trata dados pessoais, contatos, métricas de navegação e direitos dos titulares.',
    path: '/politica-de-privacidade',
    sections: [
      ['Quem somos', 'O Vem Pra Penedo é um portal de informações turísticas e comerciais sobre Penedo-RJ. Esta política explica como tratamos dados pessoais durante a utilização do site.'],
      ['Dados que podemos tratar', 'Podemos receber dados fornecidos voluntariamente em contatos, como nome, e-mail, telefone e conteúdo da mensagem. Também podemos tratar dados técnicos de navegação, como páginas acessadas, dispositivo, navegador, origem da visita e interações, conforme suas escolhas de consentimento.'],
      ['Finalidades', 'Utilizamos os dados para responder solicitações, manter a segurança e o funcionamento do portal, compreender o desempenho do conteúdo, melhorar a experiência e medir interações com estabelecimentos divulgados.'],
      ['Compartilhamento', 'Links para WhatsApp, Instagram, Google Maps, Booking, TripAdvisor e outros serviços direcionam para plataformas independentes, que aplicam suas próprias políticas. Dados de métricas podem ser processados por fornecedores de tecnologia somente conforme a configuração de consentimento.'],
      ['Base legal e retenção', 'O tratamento pode ocorrer com base no consentimento, na execução de procedimentos solicitados pelo titular e em interesses legítimos compatíveis com a operação e segurança do portal. Os dados são mantidos somente pelo período necessário para cada finalidade ou obrigação aplicável.'],
      ['Seus direitos', 'Você pode solicitar confirmação do tratamento, acesso, correção, eliminação quando aplicável, informação sobre compartilhamento e revogação do consentimento. Também pode alterar sua decisão sobre cookies limpando os dados do site no navegador e escolhendo novamente.'],
      ['Contato', 'Para solicitações relacionadas à privacidade, escreva para contato@vemprapenedo.com.br.'],
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    description: 'Entenda quais tecnologias o Vem Pra Penedo utiliza e como aceitar ou recusar cookies de medição.',
    path: '/politica-de-cookies',
    sections: [
      ['O que são cookies', 'Cookies e tecnologias semelhantes são pequenos registros usados pelo navegador para manter preferências, proteger funcionalidades e, quando autorizado, medir a utilização do site.'],
      ['Cookies necessários', 'O portal registra sua escolha de consentimento no armazenamento local do navegador. Essa informação é necessária para respeitar a decisão de aceitar ou recusar tecnologias opcionais.'],
      ['Medição e Analytics', 'O Google Tag Manager organiza as tags de medição. O Google Analytics 4 somente deve receber autorização de armazenamento analítico após o aceite. Na recusa, os sinais de consentimento permanecem negados.'],
      ['Serviços externos', 'Conteúdos incorporados e links de terceiros, como Instagram, Google Maps e plataformas de reserva, podem aplicar tecnologias próprias quando você interage com esses serviços.'],
      ['Como alterar sua escolha', 'Você pode excluir os dados deste site nas configurações do navegador para que o painel de consentimento seja exibido novamente. Também pode bloquear ou apagar cookies diretamente pelo navegador.'],
      ['Atualizações', 'Esta política pode ser atualizada para refletir mudanças técnicas, regulatórias ou operacionais. A data da versão vigente aparece nesta página.'],
    ],
  },
} as const;

export function LegalPage({ kind, onGoBack }: LegalPageProps) {
  const content = pageContent[kind];
  const canonical = `${SITE_URL}${content.path}`;

  return (
    <>
      <SEO
        title={`${content.title} | Vem Pra Penedo`}
        description={content.description}
        canonical={canonical}
        schema={getBreadcrumbSchema([
          { name: 'Início', item: `${SITE_URL}/` },
          { name: content.title, item: canonical },
        ])}
      />
      <section className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/" className="mb-8 inline-block text-penedo-emerald font-semibold hover:underline">
            ← Voltar ao início
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-penedo-forest mb-4">{content.title}</h1>
          <p className="text-sm text-gray-500 mb-10">Última atualização: {UPDATED_AT}</p>
          <div className="space-y-9 text-gray-700 leading-relaxed">
            {content.sections.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="text-2xl font-bold text-penedo-graphite mb-3">{heading}</h2>
                <p>{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
