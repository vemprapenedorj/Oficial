import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ImagePlus,
  MapPin,
  Route,
  Sparkles,
  User,
} from 'lucide-react';
import SEO from './SEO';
import { generateSEO } from '../seo';
import { DETAILS_DATA } from '../data/detailsData';
import { DetailItem, Page } from '../types';
import { getBusinessPath } from '../routing/routeHelpers';
import { ArticlePremiumDialog } from './ArticlePremiumDialog';

interface Roteiro2DiasArticleProps {
  onOpenDetail: (item: DetailItem) => void;
  onNavigate: (page: Page, premiumSlug?: string | null) => void;
}

const findItem = (id: string): { item: DetailItem; group: string } | null => {
  for (const [group, items] of Object.entries(DETAILS_DATA)) {
    const item = items.find((candidate) => candidate.id === id);
    if (item) return { item, group };
  }
  return null;
};

const getPublicPath = (item: DetailItem, group: string): string =>
  item.isPremium ? getBusinessPath(item.slug || item.id) : `/${group}/`;

const CARD_IMAGES: Record<string, string> = {
  'pousada-villa-luna': '/assets/imagens/premium/pousada-villa-luna/galeria-1.png',
  'pequena-finlandia': '/assets/imagens/blog/roteiro-2-dias-penedo/pequena-finlandia.jpg',
  'expedicao-raizes': '/assets/imagens/premium/expedicao-raizes/galeria-1.jpg',
  'rei-das-trutas': '/assets/imagens/blog/roteiro-2-dias-penedo/rei-das-trutas.jpg',
  'borbulha-penedo': '/assets/imagens/blog/roteiro-2-dias-penedo/borbulha-penedo.png',
  'museu-finlandes': '/assets/imagens/blog/roteiro-2-dias-penedo/museu-finlandes.jpg',
  'aguia-de-penedo': '/assets/imagens/blog/roteiro-2-dias-penedo/aguia-de-penedo.png',
  'fue-gelateria': '/assets/imagens/blog/roteiro-2-dias-penedo/fue-gelateria.png',
  'sorvete-finlandes': '/assets/imagens/blog/roteiro-2-dias-penedo/sorvete-finlandes.jpg',
  'pousada-vale-das-flores': '/assets/imagens/blog/roteiro-2-dias-penedo/pousada-vale-das-flores.png',
  'casa-do-fritz': '/assets/imagens/blog/roteiro-2-dias-penedo/casa-do-fritz.jpg',
  'petit-gourmet': '/assets/imagens/blog/roteiro-2-dias-penedo/restaurante-petit-gourmet.jpg',
  'esquilo-passeios': '/assets/imagens/blog/roteiro-2-dias-penedo/esquilo-passeios.jpg',
  'tonttulakki-suklaat': '/assets/imagens/blog/roteiro-2-dias-penedo/tonttulakki-suklaat.jpg',
  'kahvila-cafe': '/assets/imagens/blog/roteiro-2-dias-penedo/kahvila-cafe.jpg',
  'cachoeira-deus': '/assets/imagens/blog/roteiro-1-dia-penedo/cachoeira-de-deus.jpg',
  'tres-cachoeiras': '/assets/imagens/blog/roteiro-1-dia-penedo/tres-cachoeiras-penedo.jpg',
};

const CARD_IMAGE_POSITIONS: Record<string, string> = {
  'pousada-villa-luna': 'center 45%',
  'expedicao-raizes': 'center 55%',
  'rei-das-trutas': 'center 42%',
  'borbulha-penedo': 'center 30%',
  'aguia-de-penedo': 'center 52%',
  'sorvete-finlandes': '55% center',
  'pousada-vale-das-flores': 'center 25%',
  'casa-do-fritz': 'center 20%',
  'petit-gourmet': 'center 35%',
  'esquilo-passeios': 'center 65%',
  'tonttulakki-suklaat': 'center 25%',
  'kahvila-cafe': 'center 18%',
};

interface EstablishmentLinkProps {
  id: string;
  label?: string;
  onOpenDetail: (item: DetailItem) => void;
  onOpenPremium: (item: DetailItem) => void;
}

function EstablishmentLink({ id, label, onOpenDetail, onOpenPremium }: EstablishmentLinkProps) {
  const result = React.useMemo(() => findItem(id), [id]);

  if (!result) return <strong>{label || id}</strong>;

  const { item, group } = result;
  return (
    <a
      href={getPublicPath(item, group)}
      onClick={(event) => {
        event.preventDefault();
        if (item.isPremium) onOpenPremium(item);
        else onOpenDetail(item);
      }}
      className="font-bold text-penedo-emerald underline decoration-dotted underline-offset-4 hover:text-penedo-forest transition-colors"
    >
      {label || item.title}
    </a>
  );
}

interface PlaceCardProps extends EstablishmentLinkProps {
  description?: string;
  key?: React.Key;
}

function PlaceCard({ id, description, onOpenDetail, onOpenPremium }: PlaceCardProps) {
  const result = React.useMemo(() => findItem(id), [id]);
  if (!result) return null;

  const { item, group } = result;
  const image = CARD_IMAGES[item.id];

  return (
    <a
      href={getPublicPath(item, group)}
      onClick={(event) => {
        event.preventDefault();
        if (item.isPremium) onOpenPremium(item);
        else onOpenDetail(item);
      }}
      className="group not-prose flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-mint"
      aria-label={`Conhecer ${item.title}`}
    >
      <div className="relative h-72 overflow-hidden bg-gray-50 sm:h-96">
        {image ? (
          <img
            src={image}
            alt={`${item.title} em Penedo, RJ`}
            loading="lazy"
            decoding="async"
            width={640}
            height={420}
            className="h-full w-full object-cover"
            style={{ objectPosition: CARD_IMAGE_POSITIONS[item.id] || 'center' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-200 bg-penedo-mint/10 px-6 text-center text-gray-400"
            aria-label={`Espaço reservado para a fotografia de ${item.title}`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-penedo-emerald shadow-sm" aria-hidden="true">
              <ImagePlus size={26} />
            </span>
            <span className="text-xs font-black uppercase tracking-[0.18em]">Imagem reservada para o artigo</span>
          </div>
        )}
        {item.isPremium && (
          <span className="absolute right-3 top-3 rounded-full bg-penedo-gold px-3 py-1 text-[9px] font-black uppercase tracking-widest text-penedo-forest shadow-md">
            Premium
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-penedo-emerald">{item.category}</p>
        <h4 className="mb-2 text-lg font-black leading-tight text-penedo-forest">{item.title}</h4>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{description || item.description}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-black uppercase tracking-wider text-penedo-emerald">
          Conhecer <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

interface CardGridProps {
  ids: string[];
  descriptions?: Record<string, string>;
  onOpenDetail: (item: DetailItem) => void;
  onOpenPremium: (item: DetailItem) => void;
}

function CardGrid({ ids, descriptions, onOpenDetail, onOpenPremium }: CardGridProps) {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {ids.map((id) => (
        <PlaceCard
          key={id}
          id={id}
          description={descriptions?.[id]}
          onOpenDetail={onOpenDetail}
          onOpenPremium={onOpenPremium}
        />
      ))}
    </div>
  );
}

const SectionTitle = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <>
    <hr className="my-10 border-gray-100" />
    <h2 id={id} className="scroll-mt-36 text-2xl font-black tracking-tight text-penedo-forest md:text-3xl">
      {children}
    </h2>
  </>
);

const PeriodTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-10 text-xl font-black tracking-tight text-penedo-forest md:text-2xl">{children}</h3>
);

export function Roteiro2DiasArticle({ onOpenDetail, onNavigate }: Roteiro2DiasArticleProps) {
  const [premiumItem, setPremiumItem] = React.useState<DetailItem | null>(null);
  const linkProps = { onOpenDetail, onOpenPremium: setPremiumItem };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <SEO
        {...generateSEO('article', {
          slug: 'roteiro-2-dias-em-penedo',
          title: 'Penedo, RJ: o roteiro perfeito de 2 dias na Pequena Finlândia brasileira',
          description: 'Planeje 2 dias em Penedo, RJ, com Pequena Finlândia, cachoeiras, museu, gastronomia, hospedagens, passeios e dicas práticas de viagem.',
          image: '/assets/imagens/blog/roteiro-2-dias-penedo/intro.jpg',
          datePublished: '2026-08-04',
          keywords: [
            'roteiro de 2 dias em Penedo',
            'Pequena Finlândia brasileira',
            'o que fazer em Penedo RJ',
            'fim de semana em Penedo',
            'cachoeiras em Penedo',
            'onde comer em Penedo',
          ],
        })}
      />

      <div className="sticky top-[72px] z-40 border-b bg-white/90 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <Link to="/blog/" className="flex items-center gap-2 font-bold text-penedo-emerald transition-all hover:gap-3">
            <ArrowLeft size={20} /> Voltar para o Blog
          </Link>
          <div className="hidden text-xs font-black uppercase tracking-widest text-gray-400 md:block">
            Lendo: <span className="text-penedo-forest">Roteiro de 2 dias em Penedo</span>
          </div>
        </div>
      </div>

      <header className="relative overflow-hidden bg-penedo-forest pb-14 pt-24 text-center text-white md:pb-20 md:pt-36">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="/assets/imagens/blog/roteiro-2-dias-penedo/intro.jpg"
            alt="Letreiro Eu Amo Penedo com a Serra da Mantiqueira ao fundo"
            width={1081}
            height={700}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-penedo-forest/30 via-penedo-forest/20 to-penedo-forest" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <span className="mb-6 inline-flex rounded-full bg-penedo-gold px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-penedo-forest shadow-lg">
            Roteiro completo
          </span>
          <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Penedo, RJ: o roteiro perfeito de 2 dias na <span className="text-penedo-gold">Pequena Finlândia brasileira</span>
          </h1>
          <p className="mx-auto mb-6 max-w-3xl text-base font-medium leading-relaxed text-white/90 md:text-xl">
            Um guia para combinar cultura, natureza, gastronomia e momentos de descanso.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-white/85">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-penedo-gold" /> 04/08/2026</span>
            <span className="h-1.5 w-1.5 rounded-full bg-penedo-gold" />
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-penedo-gold" /> 12 min de leitura</span>
            <span className="h-1.5 w-1.5 rounded-full bg-penedo-gold" />
            <span className="flex items-center gap-1.5"><User size={14} className="text-penedo-gold" /> Portal Vem Pra Penedo</span>
          </div>
        </div>
      </header>

      <main className="bg-white py-12 md:py-20">
        <article className="mx-auto max-w-4xl px-4">
          <div className="prose prose-lg prose-penedo max-w-none space-y-6 leading-relaxed text-gray-700 md:prose-xl md:space-y-8">
            <SectionTitle id="introducao">1. Introdução e contexto cultural</SectionTitle>
            <p className="text-lg font-medium leading-relaxed text-gray-600 md:text-xl">
              Penedo convida o viajante a desacelerar entre o aroma da madeira e o frescor característico da Serra da Mantiqueira. Única colônia finlandesa do Brasil, este charmoso distrito de Itatiaia, no sul do Rio de Janeiro, preserva a herança dos imigrantes que chegaram em 1929. Mais do que um destino, Penedo é uma experiência sensorial que une a arquitetura escandinava, com seus troncos aparentes, ao vigor da Mata Atlântica.
            </p>
            <p>
              Aqui, o tempo parece correr em outro ritmo. A atmosfera europeia manifesta-se no cuidado das fachadas coloridas, na tradição das trutas frescas e no toque artesanal de suas famosas chocolaterias. É o refúgio ideal para quem busca o aconchego de uma vila de montanha sem abrir mão de uma curadoria gastronômica de excelência e de vivências culturais autênticas.
            </p>

            <SectionTitle id="planejamento">2. Logística e planejamento: como chegar e quando ir</SectionTitle>
            <p>Para uma viagem sem imprevistos, o planejamento é essencial:</p>
            <ul className="space-y-3">
              <li><strong>Como chegar:</strong> o acesso principal é pela Rodovia Presidente Dutra (BR-116), utilizando a saída 311. Penedo fica a aproximadamente 170 km do Rio de Janeiro e 270 km de São Paulo.</li>
              <li><strong>Melhor época:</strong> de março a agosto, no outono e inverno, o clima frio é o protagonista, perfeito para fondues e lareiras. Entre setembro e fevereiro, na primavera e no verão, o calor convida a banhos nas águas geladas das cachoeiras.</li>
              <li><strong>Deslocamento:</strong> embora o centrinho da Pequena Finlândia possa ser explorado a pé, o terreno de Penedo é marcado por ladeiras íngremes. Se a hospedagem ficar fora do miolo central — como na região do Hotel da Cachoeira, a cerca de 2 km —, o uso de carro ou táxi é recomendável para evitar cansaço excessivo.</li>
            </ul>
            <div className="not-prose my-8 flex items-start gap-4 rounded-3xl border border-penedo-mint bg-penedo-mint/20 p-6">
              <MapPin className="mt-1 shrink-0 text-penedo-emerald" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-gray-600 md:text-base">Em fins de semana e feriados, confirme horários, condições de acesso às atrações e reservas diretamente com os estabelecimentos antes de sair.</p>
            </div>

            <SectionTitle id="dia-1">3. Dia 1 — imersão cultural e natureza</SectionTitle>
            <PeriodTitle>Manhã — Chegada e centro</PeriodTitle>
            <p>
              Chegue por volta das 9h30 para sentir o despertar da vila. Comece pela <EstablishmentLink id="pequena-finlandia" {...linkProps} />, cruzando os famosos guarda-chuvas coloridos, que rendem fotos icônicas. Às 11h, visite a <EstablishmentLink id="pequena-finlandia-shopping" label="Casa do Papai Noel" {...linkProps} />, dentro do Shopping Pequena Finlândia: uma réplica encantadora que remete à tradição da Lapônia e fascina gerações desde 1932.
            </p>
            <CardGrid ids={['pequena-finlandia']} {...linkProps} />

            <PeriodTitle>Almoço — A truta como tradição local</PeriodTitle>
            <p>
              No almoço, adote o “uniforme local”: a truta. Especialidade da região, o peixe é criado em águas frias e servido com molhos que vão do clássico molho de amêndoas ao toque de pinhão. O <EstablishmentLink id="rei-das-trutas" {...linkProps} /> e o <EstablishmentLink id="borbulha-penedo" label="Borbulha de Penedo" {...linkProps} /> são opções cadastradas no portal para conhecer essa tradição.
            </p>
            <CardGrid ids={['rei-das-trutas', 'borbulha-penedo']} {...linkProps} />

            <PeriodTitle>Tarde — Aventura de buggy e cachoeiras</PeriodTitle>
            <p>
              Contrate um passeio de buggy pelo circuito clássico. A primeira parada é a <EstablishmentLink id="cachoeira-deus" {...linkProps} />, uma das maiores da região. Aqui, o destaque é o escorrega natural, uma diversão imperdível. Atenção: o acesso envolve degraus de pedra que podem ser íngremes e escorregadios. Siga para as Três Bacias, perfeitas para uma hidromassagem natural, e finalize no <EstablishmentLink id="poco-esmeraldas" label="Poço das Esmeraldas" {...linkProps} />, cujo tom esverdeado da água é um espetáculo à parte sob a luz do sol.
            </p>
            <p>
              Entre os operadores cadastrados no portal, a <EstablishmentLink id="expedicao-raizes" {...linkProps} /> possui página Premium exclusiva e realiza experiências 4x4 em trilhas e cachoeiras. O <EstablishmentLink id="esquilo-passeios" {...linkProps} /> também informa opções de bugre, jipe e quadriciclo.
            </p>
            <CardGrid ids={['expedicao-raizes', 'cachoeira-deus']} {...linkProps} />

            <PeriodTitle>Noite — Fondue e clima serrano</PeriodTitle>
            <p>
              O ritual noturno obrigatório é a sequência de fondue. Servido em ambiente à meia-luz, o rodízio de queijos, carnes e chocolates é o ápice do romantismo serrano. Para ampliar as opções, consulte a página de <Link to="/gastronomia/">gastronomia em Penedo</Link> e confirme reservas e horários.
            </p>

            <SectionTitle id="dia-2">4. Dia 2 — história, compras e mirantes</SectionTitle>
            <PeriodTitle>Manhã — História e vista panorâmica</PeriodTitle>
            <p>
              Mergulhe na história no <EstablishmentLink id="museu-finlandes" {...linkProps} />, cujo acervo de mais de mil peças revela a trajetória da imigração. Em seguida, parta para um passeio de quadriciclo com destino à Cachoeira da Lontra — um refúgio de águas tranquilas acessível apenas por quadriciclo ou cavalo. No caminho, contemple o mirante com vista privilegiada para o <EstablishmentLink id="pico-penedinho" {...linkProps} />.
            </p>
            <p>
              A <EstablishmentLink id="aguia-de-penedo" {...linkProps} /> é a correspondência cadastrada no portal para o circuito de quadriciclo 4x4 que visita a Cachoeira da Lontra.
            </p>
            <CardGrid ids={['museu-finlandes', 'aguia-de-penedo']} {...linkProps} />

            <PeriodTitle>Almoço — Em busca da gastronomia finlandesa</PeriodTitle>
            <p>
              Embora os restaurantes 100% finlandeses tenham se tornado raros — muitos se fundiram à culinária alemã —, o espírito nórdico sobrevive em detalhes. Próximo à entrada da Pequena Finlândia, procure o tradicional <em>korvapuusti</em>, carinhosamente apelidado de “tapa na orelha”: um pão doce de canela que é ícone da confeitaria finlandesa.
            </p>

            <PeriodTitle>Tarde — Gastronomia doce e compras</PeriodTitle>
            <p>
              Dedique a tarde à <EstablishmentLink id="fue-gelateria" label="Fuê Gelateria" {...linkProps} /> e experimente sabores excepcionais e diferentes, como Matchá e Marshmallow, Cheesecake de ABÓBORA e Creme de Amaretto, com fabricação própria na Fuê Escola. Nas chocolaterias, a experiência definitiva é o chocolate quente belga, cremoso e reconfortante. Para as lembranças, não deixe de procurar as famosas barras de chocolate em formato de truta, uma homenagem lúdica ao peixe-símbolo da cidade.
            </p>
            <p>
              O <EstablishmentLink id="sorvete-finlandes" {...linkProps} /> e o <EstablishmentLink id="kahvila-cafe" label="Kahvila Café" {...linkProps} /> também são paradas cadastradas para completar a tarde doce.
            </p>
            <CardGrid ids={['fue-gelateria', 'sorvete-finlandes']} {...linkProps} />

            <PeriodTitle>Encerramento</PeriodTitle>
            <p>
              Finalize a viagem com compras de artesanato escandinavo e itens de lã ou couro, perfeitos para levar um pouco do clima de Penedo para casa. Veja também as opções reais reunidas na página de <Link to="/compras/">compras em Penedo</Link>.
            </p>

            <SectionTitle id="recomendacoes">5. Guia de recomendações</SectionTitle>
            <PeriodTitle>Hospedagem</PeriodTitle>
            <ul className="space-y-3">
              <li><strong>Hotel da Cachoeira:</strong> excelente custo-benefício para quem busca contato direto com a natureza e uma cachoeira privativa, embora tenha um estilo mais rústico.</li>
              <li><strong>Pousada Serra da Índia:</strong> focada em casais, oferece uma vista deslumbrante para as montanhas e total privacidade.</li>
              <li><EstablishmentLink id="pousada-vale-das-flores" {...linkProps} />: a cerca de 1,5 km do centro de Penedo, combina áreas verdes, piscina e sauna para quem busca descanso próximo às principais atrações.</li>
              <li><EstablishmentLink id="pousada-villa-luna" {...linkProps} />: na Avenida das Mangueiras, oferece uma atmosfera boutique, jardins, piscina e atendimento personalizado para uma estadia confortável perto do centrinho.</li>
            </ul>
            <CardGrid
              ids={['pousada-villa-luna', 'pousada-vale-das-flores']}
              descriptions={{
                'pousada-villa-luna': 'Hospedagem Premium com página exclusiva ativa, a cerca de 200 metros do centro de Penedo.',
                'pousada-vale-das-flores': 'Áreas verdes, piscina, jardim e sauna para uma estadia tranquila em Penedo.',
              }}
              {...linkProps}
            />

            <PeriodTitle>Gastronomia</PeriodTitle>
            <ul className="space-y-3">
              <li><EstablishmentLink id="rei-das-trutas" {...linkProps} />: o ponto de referência para o prato mais tradicional da cidade.</li>
              <li><EstablishmentLink id="borbulha-penedo" label="Borbulha de Penedo" {...linkProps} />: outra escolha assertiva para degustar trutas com preparo impecável.</li>
              <li><EstablishmentLink id="casa-do-fritz" {...linkProps} />: onde a tradição alemã encontra cervejas artesanais de fabricação própria.</li>
              <li><EstablishmentLink id="petit-gourmet" {...linkProps} />: a escolha certa para um jantar sofisticado e intimista.</li>
            </ul>
            <CardGrid ids={['rei-das-trutas', 'borbulha-penedo', 'casa-do-fritz', 'petit-gourmet']} {...linkProps} />

            <PeriodTitle>Lazer e passeios</PeriodTitle>
            <ul className="space-y-3">
              <li><EstablishmentLink id="pequena-finlandia" {...linkProps} /> e <EstablishmentLink id="pequena-finlandia-shopping" label="Casa do Papai Noel" {...linkProps} />: o coração cultural do distrito.</li>
              <li><strong>Passeio de buggy:</strong> recomendado para fotos nos melhores ângulos das cachoeiras. Consulte operadores reais na página de <Link to="/o-que-fazer/">passeios e atrações</Link>.</li>
              <li><strong>Parque Nacional do Itatiaia:</strong> ideal para os entusiastas de trilhas mais longas e da biodiversidade da Mata Atlântica.</li>
            </ul>
            <CardGrid ids={['expedicao-raizes', 'esquilo-passeios']} {...linkProps} />

            <PeriodTitle>Cafés, chocolaterias e sorveterias</PeriodTitle>
            <ul className="space-y-3">
              <li><EstablishmentLink id="tonttulakki-suklaat" label="Tonttulakki Suklaat" {...linkProps} />: “Suklaat” significa “chocolates” em finlandês; é uma parada para conhecer chocolates artesanais com inspiração finlandesa.</li>
              <li><EstablishmentLink id="sorvete-finlandes" {...linkProps} />: conhecido pela técnica artesanal e por sabores típicos nórdicos.</li>
              <li><EstablishmentLink id="kahvila-cafe" label="Kahvila Café" {...linkProps} />: o refúgio perfeito para um café especial e os famosos bolos da casa no fim da tarde.</li>
            </ul>
            <CardGrid ids={['tonttulakki-suklaat', 'kahvila-cafe', 'sorvete-finlandes']} {...linkProps} />

            <SectionTitle id="dicas">6. Dicas práticas de viagem</SectionTitle>
            <ul className="space-y-3">
              <li><strong>Repelente:</strong> item de primeira necessidade. Em áreas de mata e cachoeira, você será um alvo fácil sem ele.</li>
              <li><strong>Atenção nas pedras:</strong> o acesso às quedas d’água exige cuidado. As pedras são lisas, e os degraus em locais como a Cachoeira de Deus pedem calçados com boa aderência.</li>
              <li><strong>Clima:</strong> mesmo que o dia esteja ensolarado, a temperatura em Penedo cai drasticamente ao pôr do sol. Leve sempre um casaco para a noite.</li>
              <li><strong>Conectividade e pagamento:</strong> o centro aceita cartões amplamente, mas, para passeios de quadriciclo ou compras em banquinhas menores, ter dinheiro em espécie ou usar Pix pode facilitar a negociação.</li>
            </ul>

            <SectionTitle id="conclusao">7. Conclusão</SectionTitle>
            <p>
              Penedo é um destino que merece ser degustado sem pressa. Entre uma truta perfeitamente grelhada e um mergulho renovador em águas de tonalidade esmeralda, a “Pequena Finlândia” brasileira oferece um equilíbrio raro entre o conforto turístico e a rusticidade da serra. Permita-se viver momentos de tranquilidade e renovação de energias em um dos cenários mais acolhedores do Rio de Janeiro.
            </p>

            <div className="not-prose relative my-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#064E3B] to-[#0B6B50] p-8 text-center shadow-2xl md:p-12">
              <Sparkles className="mx-auto mb-4 text-penedo-gold" size={32} aria-hidden="true" />
              <h3 className="mb-4 text-2xl font-black text-white md:text-3xl">Continue planejando sua viagem</h3>
              <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                Se o tempo estiver mais curto, veja também nosso roteiro de 1 dia. Para comparar opções, explore as categorias oficiais do portal.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link to="/blog/artigo/roteiro-1-dia-em-penedo/" className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-penedo-gold px-5 py-3 text-xs font-black uppercase tracking-wider text-penedo-forest transition-transform hover:scale-[1.02]">
                  <Route size={17} /> Roteiro de 1 dia
                </Link>
                <Link to="/onde-ficar/" onClick={() => onNavigate('onde-ficar')} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-penedo-mint px-5 py-3 text-xs font-black uppercase tracking-wider text-penedo-forest transition-transform hover:scale-[1.02]">
                  Ver hospedagens <ArrowRight size={17} />
                </Link>
                <Link to="/gastronomia/" onClick={() => onNavigate('gastronomia')} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white/20">
                  Ver gastronomia <ArrowRight size={17} />
                </Link>
                <Link to="/o-que-fazer/" onClick={() => onNavigate('o-que-fazer')} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white/20">
                  Ver passeios <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="not-prose mx-auto mb-12 mt-8 flex w-full max-w-4xl flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 pt-8 sm:flex-row">
              <Link to="/blog/artigo/roteiro-1-dia-em-penedo/" className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-[#064E3B] px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0B6B50] hover:shadow-lg sm:w-[280px]">
                <ArrowLeft size={16} /> <span className="flex-1 text-center pr-4">Roteiro de 1 dia</span>
              </Link>
              <Link to="/blog/" className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-[#064E3B] px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0B6B50] hover:shadow-lg sm:w-[280px]">
                <span className="flex-1 text-center pl-4">Ver todos os artigos</span> <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </article>
      </main>

      <ArticlePremiumDialog item={premiumItem} onClose={() => setPremiumItem(null)} />
    </motion.div>
  );
}
