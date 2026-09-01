import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Camera, Clock, MapPin, User, X } from 'lucide-react';
import SEO from './SEO';
import { DETAILS_DATA } from '../data/detailsData';
import { generateSEO } from '../seo';

const ARTICLE_ID = 'melhores-pizzarias-de-penedo';
const ARTICLE_IMAGES_PATH = '/assets/imagens/blog/melhores-pizzarias';
const ARTICLE_IMAGE = `${ARTICLE_IMAGES_PATH}/intro.jpg`;
const ARTICLE_INTRO_IMAGE = `${ARTICLE_IMAGES_PATH}/intro-2.jpg`;
const ARTICLE_FOOTER_IMAGE = `${ARTICLE_IMAGES_PATH}/intro-3.png`;
const PIZZA_DA_VILLA_IMAGES = [
  `${ARTICLE_IMAGES_PATH}/pizza-da-villa-1.png`,
  `${ARTICLE_IMAGES_PATH}/pizza-da-villa-2.jpg`,
  `${ARTICLE_IMAGES_PATH}/pizza-da-villa-3.jpg`,
] as const;

interface SelectedImage {
  src: string;
  alt: string;
}

interface PhotoSlotProps {
  alt: string;
  src?: string;
  className?: string;
  onOpen: (image: SelectedImage) => void;
}

const PhotoSlot = ({ alt, src, className = '', onOpen }: PhotoSlotProps) => {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(src) && !hasError;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#F3F4F1] shadow-md ${className}`}>
      {showImage ? (
        <button
          type="button"
          className="group h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold focus-visible:ring-inset"
          onClick={() => onOpen({ src: src!, alt })}
          aria-label={`Ampliar foto: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            width={1080}
            height={1350}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            onError={() => setHasError(true)}
          />
        </button>
      ) : (
        <div className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-penedo-emerald/20 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-penedo-emerald shadow-sm">
            <Camera size={24} aria-hidden="true" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">Espaço para foto</span>
        </div>
      )}
    </div>
  );
};

interface Pizzeria {
  id: string;
  name: string;
  tagline: string;
  instagram?: string;
  intro: string;
  environment: string;
  menu: string;
  href?: string;
  images?: readonly [string, string, string];
  imageAlts?: readonly [string, string, string];
}

const pizzerias: Pizzeria[] = [
  {
    id: 'bazzini-pizzeria',
    name: 'Bazzini Pizzeria',
    instagram: 'https://www.instagram.com/bazzinipizzeria/',
    tagline: 'Tradição italiana e diversão para a família no coração de Penedo',
    intro: 'A Bazzini Pizzeria é um dos grandes destaques do polo gastronômico de Penedo. Localizada na Avenida das Mangueiras, 1849, próxima à Pequena Finlândia, a casa aparece com nota 4,8 de 5 e entre os restaurantes mais bem avaliados de Penedo no Tripadvisor.',
    environment: 'Com uma decoração rústica, familiar e extremamente acolhedora, o restaurante oferece mesas tanto em seu salão interno quanto em uma charmosa área ao ar livre, perfeita para desfrutar do clima da serra. O grande diferencial para quem viaja em família é o espaço kids dedicado, muito elogiado nas avaliações por entreter as crianças com segurança.',
    menu: 'Feitas de forma artesanal, as pizzas brilham pela massa leve e crocante, combinada com recheios fartos e ingredientes de altíssima qualidade. Os sabores salgados mais recomendados são a clássica Margherita e a de Presunto de Parma. Para a sobremesa, a pizza doce de chocolate com morango é uma verdadeira tentação que faz sucesso absoluto.',
    images: [
      `${ARTICLE_IMAGES_PATH}/bazzini-1.png`,
      `${ARTICLE_IMAGES_PATH}/bazzini-2.png`,
      `${ARTICLE_IMAGES_PATH}/bazzini-3.png`,
    ],
    imageAlts: [
      'Foto da Bazzini Pizzeria em Penedo',
      'Ambiente da Bazzini Pizzeria em Penedo',
      'Pizza servida na Bazzini Pizzeria em Penedo',
    ],
  },
  {
    id: 'deck-pizzaria',
    name: 'Deck Pizzaria e Choperia',
    instagram: 'https://www.instagram.com/deckpizzariaechoperia/',
    tagline: 'Sabor gourmet e uma vista privilegiada na varanda mais charmosa do centro',
    intro: 'A Deck Pizzaria e Choperia é uma verdadeira instituição gastronômica de Penedo. Localizada na Rua das Velas, 34, conta com nota 4,4 no Tripadvisor e 4,6 no Google e é frequentemente apontada pelos visitantes como uma parada obrigatória na cidade.',
    environment: 'Bem no centrinho turístico, a pizzaria fica no segundo andar de um prédio charmoso com arquitetura finlandesa e iluminado por luzes natalinas. O ponto alto é a sua varanda arejada, voltada para o movimento do centro de Penedo.',
    menu: 'Assadas no forno a lenha, apresentam uma massa napolitana muito fina e crocante. O cardápio se destaca pelas criações gourmet e combinações exclusivas de sabores refinados, como brie com damasco, gorgonzola com maçã verde — com geleia de damasco — e a surpreendente Serra e Mar, que leva truta defumada regional e camarão. Para acompanhar, o chopp gelado e os vinhos da casa completam a experiência.',
    images: [
      `${ARTICLE_IMAGES_PATH}/deck-pizzaria-1.png`,
      `${ARTICLE_IMAGES_PATH}/deck-pizzaria-2.png`,
      `${ARTICLE_IMAGES_PATH}/deck-pizzaria-3.png`,
    ],
    imageAlts: [
      'Foto da Deck Pizzaria e Choperia em Penedo',
      'Ambiente da Deck Pizzaria e Choperia em Penedo',
      'Pizza servida na Deck Pizzaria e Choperia em Penedo',
    ],
  },
  {
    id: 'pizza-da-villa',
    name: 'Pizza da Villa',
    instagram: 'https://www.instagram.com/pizzadavillapenedo/',
    tagline: 'Quase duas décadas de história, tradição familiar e ambiente pet-friendly',
    intro: 'Com 19 anos de atuação em Penedo, a Pizza da Villa mantém viva uma tradição familiar de origem italiana que atravessa mais de 150 anos. Na consulta feita em agosto de 2026, a pizzaria tinha nota 4,5 no Tripadvisor.',
    environment: 'O espaço é amplo, rústico e muito acolhedor, contando com um lindo jardim externo e estacionamento privado gratuito. Outro grande diferencial é que o local é totalmente pet-friendly, recebendo os animais de estimação com muito carinho na área da varanda.',
    menu: 'As pizzas possuem massa fininha, bordas crocantes e são assadas lentamente no forno a lenha. Entre os sabores mencionados pelos visitantes estão a Villa Rezende — mussarela de búfala, presunto de parma e rúcula — e a Villa Capelinha, de quatro queijos.',
    images: PIZZA_DA_VILLA_IMAGES,
    imageAlts: [
      'Pizza artesanal da Pizza da Villa',
      'Seleção de vinhos da Pizza da Villa',
      'Pizza Villa Martinelli servida na Pizza da Villa',
    ],
  },
  {
    id: 'oh-baba',
    name: 'Oh Baba Pizza e Esfiha',
    instagram: 'https://www.instagram.com/oh_babapenedo/',
    tagline: 'Cozinha aberta, massa vegana e esfihas generosamente recheadas',
    intro: 'Situada na Avenida das Mangueiras, 1658, no Shopping Rio das Pedras e em frente à icônica Casa do Papai Noel, a Oh Baba é uma pizzaria dinâmica e divertida, muito elogiada pelo custo-benefício e acolhimento.',
    environment: 'A pizzaria adota uma proposta de cozinha aberta, em estilo vitrine. Através do vidro, os clientes e as crianças podem acompanhar ao vivo a abertura das massas e a montagem dos recheios frescos. O espaço do shopping ainda oferece mesas ao ar livre, onde é possível pedir um chopp gelado e curtir música ao vivo.',
    menu: 'Além de oferecer massa vegana sob demanda e trabalhar com ingredientes frescos, a casa serve pizzas de diferentes sabores, incluindo camarão com catupiry. Um dos grandes destaques são as esfihas grandes e generosamente recheadas, disponíveis em sabores salgados e doces, como chocolate com morango ou M&M’s.',
    images: [
      `${ARTICLE_IMAGES_PATH}/oh_babapenedo-1.png`,
      `${ARTICLE_IMAGES_PATH}/oh_babapenedo-2.jpg`,
      `${ARTICLE_IMAGES_PATH}/oh_babapenedo-3.jpg`,
    ],
    imageAlts: [
      'Foto da Oh Baba Pizza e Esfiha em Penedo',
      'Esfiha servida na Oh Baba Pizza e Esfiha em Penedo',
      'Pizza servida na Oh Baba Pizza e Esfiha em Penedo',
    ],
  },
  {
    id: 'forno-e-lenha',
    name: 'Pizzaria Forno e Lenha',
    instagram: 'https://www.instagram.com/pizzariafornoelenha/',
    tagline: 'Acolhimento familiar e pizzas preparadas no forno a lenha',
    intro: 'Para quem quer comer bem em um ambiente simples, familiar e com preço amigável, a Pizzaria Forno e Lenha é uma opção tradicional. Localizada na Avenida Brasil, 333, loja 2, tinha nota 4,5 no Google na consulta feita em agosto de 2026. Antes de visitar, consulte os canais oficiais da pizzaria para confirmar o horário de funcionamento.',
    environment: 'É uma casa familiar, com instalações despretensiosas, aconchegantes e rústicas. O atendimento dos funcionários e garçons é frequentemente descrito como prestativo, ágil e simpático.',
    menu: 'As pizzas assadas no forno a lenha são o principal destaque. Avaliações anteriores destacam o rodízio, a massa de espessura média, com estilo caseiro, e sabores tradicionais, como margherita e alho. Como modalidades de serviço e horários podem mudar, confirme diretamente com a casa se o rodízio estará disponível no dia da visita. O serviço de entrega continua sendo outra opção para quem está em hotéis e pousadas da região.',
    images: [
      `${ARTICLE_IMAGES_PATH}/forno-e-lenha-1.jpg`,
      `${ARTICLE_IMAGES_PATH}/forno-e-lenha-2.jpg`,
      `${ARTICLE_IMAGES_PATH}/forno-e-lenha-3.png`,
    ],
    imageAlts: [
      'Foto da Pizzaria Forno e Lenha em Penedo',
      'Ambiente da Pizzaria Forno e Lenha em Penedo',
      'Pizza servida na Pizzaria Forno e Lenha em Penedo',
    ],
  },
];

export function PizzariasArticle() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const blogPosts = useMemo(() => {
    const parseDate = (date: string) => {
      const [day, month, year] = date.split('/').map(Number);
      return new Date(year, month - 1, day).getTime();
    };

    return [...(DETAILS_DATA.blog || [])].sort((a, b) => parseDate(b.date || '') - parseDate(a.date || ''));
  }, []);

  const currentIndex = blogPosts.findIndex((post) => post.id === ARTICLE_ID);
  const previousPost = currentIndex >= 0 && currentIndex + 1 < blogPosts.length ? blogPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

  useEffect(() => {
    if (!selectedImage) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown, true);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocused?.focus();
    };
  }, [selectedImage]);

  return (
    <motion.div initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <SEO
        {...generateSEO('article', {
          slug: ARTICLE_ID,
          title: 'As 5 Melhores Pizzarias de Penedo RJ',
          description: 'Conheça cinco pizzarias de Penedo RJ para saborear pizzas artesanais, rodízios, opções gourmet, ambientes acolhedores e programas em família.',
          image: ARTICLE_IMAGE,
          datePublished: '2026-08-27',
          keywords: ['pizzarias em Penedo', 'melhores pizzarias de Penedo', 'pizza em Penedo RJ', 'onde comer em Penedo'],
        })}
      />

      <div className="sticky top-20 z-40 border-b bg-white/90 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <Link to="/blog/" className="flex items-center gap-2 rounded-md font-bold text-penedo-emerald transition-[gap,color] hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-penedo-emerald focus-visible:ring-offset-4 motion-reduce:transition-none">
            <ArrowLeft size={20} aria-hidden="true" /> Voltar para o Blog
          </Link>
          <div className="hidden text-xs font-black uppercase tracking-widest text-gray-400 md:block">
            Lendo: <span className="text-penedo-forest">Melhores pizzarias de Penedo</span>
          </div>
        </div>
      </div>

      <header className="relative overflow-hidden bg-penedo-forest pb-10 pt-20 text-center text-white md:pb-24 md:pt-40">
        <div className="absolute inset-0 opacity-25">
          <img src={ARTICLE_IMAGE} alt="" width={1080} height={1350} fetchPriority="high" aria-hidden="true" className="h-full w-full object-cover object-[center_65%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-penedo-forest/40 via-penedo-forest/30 to-penedo-forest" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block rounded-full bg-penedo-gold px-4 py-1.5 text-xs font-black uppercase tracking-[0.3em] text-penedo-forest shadow-xl"
          >
            Gastronomia & Experiência
          </motion.div>
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-pretty text-4xl font-black leading-[1.08] tracking-tighter text-white md:text-7xl"
          >
            O guia definitivo da pizza na serra: <span className="italic text-penedo-gold">as 5 melhores pizzarias de Penedo</span>
          </motion.h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-white/85">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-penedo-gold" aria-hidden="true" /> 27/08/2026</span>
            <span className="h-1.5 w-1.5 rounded-full bg-penedo-gold" aria-hidden="true" />
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-penedo-gold" aria-hidden="true" /> 9 min de leitura</span>
            <span className="h-1.5 w-1.5 rounded-full bg-penedo-gold" aria-hidden="true" />
            <span className="flex items-center gap-1.5"><User size={14} className="text-penedo-gold" aria-hidden="true" /> Portal Vem Pra Penedo</span>
          </div>
        </div>
      </header>

      <main id="conteudo-principal">
        <section className="bg-[#FAFAFA] py-10 md:py-24">
          <div className="mx-auto max-w-4xl px-4">
            <div className="prose prose-xl prose-penedo mb-12 max-w-none text-left text-gray-600 md:mb-16">
              <p className="lead mb-6 text-2xl font-medium text-gray-800">
                Se existe um destino no estado do Rio de Janeiro que combina o charme do frio serrano com uma gastronomia especial, esse lugar é <strong>Penedo</strong>, no município de Itatiaia.
              </p>
              <p className="text-lg leading-relaxed">
                Localizado aos pés da deslumbrante Serra da Mantiqueira, este distrito — famoso pela única colônia finlandesa do Brasil — é um convite irrecusável para relaxar, curtir a natureza e, claro, comer extremamente bem.
              </p>
              <p className="text-lg leading-relaxed">
                Embora as trutas frescas e os tradicionais rodízios de fondue dominem a fama local, as pizzarias de Penedo também conquistaram espaço no roteiro gastronômico. Com propostas que incluem massas artesanais e pizzas assadas em fornos a lenha, as casas da região são uma alternativa convidativa para as noites frias da serra.
              </p>
              <p className="text-lg leading-relaxed">
                Para ajudar você a planejar sua próxima viagem gastronômica, selecionamos cinco pizzarias de Penedo amplamente recomendadas pelos visitantes. Veja onde encontrar a sua redonda perfeita!
              </p>
            </div>

            <figure className="mb-16">
              <PhotoSlot src={ARTICLE_INTRO_IMAGE} alt="Monumento Eu Amo Penedo com a Serra da Mantiqueira ao fundo" className="h-72 md:h-96" onOpen={setSelectedImage} />
              <figcaption className="mt-3 text-center text-xs italic text-gray-500">Monumento Eu Amo Penedo, com a Serra da Mantiqueira ao fundo.</figcaption>
            </figure>

            <div className="space-y-16">
              {pizzerias.map((pizzeria, index) => (
                <article key={pizzeria.id} className="rounded-[3rem] border border-black/5 bg-white p-7 text-left shadow-xl md:p-12">
                  <div className="mb-7">
                    <span className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-penedo-gold">#{index + 1}</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-black text-penedo-forest md:text-4xl">🍕 {pizzeria.name}</h2>
                      {pizzeria.instagram && (
                        <a
                          href={pizzeria.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          aria-label={`Instagram oficial de ${pizzeria.name}`}
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                      {pizzeria.href && (
                        <Link to={pizzeria.href} className="rounded-full border border-penedo-emerald/15 bg-penedo-mint/40 px-3 py-1 text-xs font-bold text-penedo-forest transition-colors hover:bg-penedo-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-penedo-emerald focus-visible:ring-offset-2">
                          Ver no guia
                        </Link>
                      )}
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-penedo-emerald">{pizzeria.tagline}</p>
                  </div>

                  <div className="mb-8 space-y-5 text-lg leading-relaxed text-gray-600">
                    <p>{pizzeria.intro}</p>
                    <p><strong className="text-penedo-forest">O ambiente:</strong> {pizzeria.environment}</p>
                    <p><strong className="text-penedo-forest">As pizzas:</strong> {pizzeria.menu}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PhotoSlot src={pizzeria.images?.[0]} alt={pizzeria.imageAlts?.[0] || `Foto principal da ${pizzeria.name}`} className="h-64 md:col-span-2 md:h-80" onOpen={setSelectedImage} />
                    <div className="grid h-64 grid-cols-2 gap-4 md:h-80 md:grid-cols-1">
                      <PhotoSlot src={pizzeria.images?.[1]} alt={pizzeria.imageAlts?.[1] || `Ambiente da ${pizzeria.name}`} onOpen={setSelectedImage} />
                      <PhotoSlot src={pizzeria.images?.[2]} alt={pizzeria.imageAlts?.[2] || `Pizza da ${pizzeria.name}`} onOpen={setSelectedImage} />
                    </div>
                  </div>
                  {pizzeria.images && <p className="mt-4 text-center text-xs italic text-gray-500">Fotos do acervo de {pizzeria.name}.</p>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-12 text-center">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-penedo-gold">Vale conhecer</span>
              <h2 className="mt-3 text-3xl font-black tracking-tighter text-penedo-forest md:text-5xl">Menções honrosas</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">Outras opções para quem busca rodízio, delivery ou quer descobrir novos sabores em Penedo.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-[2rem] border border-penedo-emerald/10 bg-[#FAFAFA] p-8">
                <h3 className="mb-3 text-2xl font-black text-penedo-forest">Rei da Villa</h3>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-penedo-emerald">Pizzaria e hamburgueria</p>
                <p className="leading-relaxed text-gray-600">Com reputação de 4,7 de 5 estrelas no Google e mais de 600 avaliações, fica na Avenida das Mangueiras, 1579, em frente à Pousada do Lago. A casa combina pizzas assadas no forno a lenha com hambúrgueres artesanais e é muito elogiada pelo serviço de entrega rápido e quente, além do atendimento atencioso no local.</p>
              </article>
              <article className="rounded-[2rem] border border-penedo-emerald/10 bg-[#FAFAFA] p-8">
                <h3 className="mb-3 text-2xl font-black text-penedo-forest">Farm Pizzaria</h3>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-penedo-emerald">Rodízio e ambiente rústico</p>
                <p className="leading-relaxed text-gray-600">Com avaliação de 4,1 estrelas no Google e mais de 700 opiniões na consulta feita em agosto de 2026, fica na Avenida das Mangueiras, 2510. A Farm Pizzaria aposta em rodízio variado, preço atrativo e um ambiente rústico, intimista e com iluminação mais baixa. Conta com espaço kids; a pizza doce de abacaxi com beijinho e o sorvete de tangerina são boas sugestões para a sobremesa.</p>
              </article>
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">Notas e quantidades de avaliações consultadas em agosto de 2026; esses números podem mudar nas plataformas.</p>
          </div>
        </section>

        <section className="bg-penedo-mint/30 py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="rounded-[3rem] border border-penedo-emerald/10 bg-white p-8 shadow-xl md:p-12">
              <div className="mb-5 flex items-center gap-3 text-penedo-forest">
                <MapPin className="text-penedo-gold" size={28} aria-hidden="true" />
                <h2 className="text-3xl font-black tracking-tighter">Dica para a sua viagem</h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-gray-600">
                <p>Como as principais atrações do centro de Penedo ficam relativamente próximas, é possível fazer boa parte do roteiro a pé. Ainda assim, algumas ruas apresentam inclinações, por isso vale utilizar calçados confortáveis. Uma excelente programação é passear pela Pequena Finlândia no fim da tarde, tirar fotos na charmosa Rua dos Guarda-Chuvas, comprar chocolates artesanais e depois fechar a noite em uma dessas pizzarias.</p>
                <p>Lembre-se de que nos finais de semana e feriados prolongados a cidade fica bastante cheia. Por isso, chegar cedo, preferencialmente entre 18h e 19h, ou fazer uma reserva por telefone ou WhatsApp ajuda a evitar longas filas de espera.</p>
                <p className="font-bold text-penedo-forest">Aproveite o friozinho da serra, peça um bom vinho nacional ou cerveja artesanal da região e saboreie o melhor da pizza em Penedo! 🍕🍷</p>
              </div>
            </div>

            <figure className="mt-12">
              <PhotoSlot src={ARTICLE_FOOTER_IMAGE} alt="Vista aérea noturna do centro turístico de Penedo" className="h-80 md:h-[32rem]" onOpen={setSelectedImage} />
              <figcaption className="mt-3 text-center text-xs italic text-gray-500">Vista aérea noturna do centro turístico de Penedo. Foto: Look Drone.</figcaption>
            </figure>
          </div>
        </section>

        <div className="mx-auto mb-12 mt-8 flex w-full max-w-4xl flex-col items-center justify-between gap-4 border-t border-gray-100 px-4 pt-8 sm:flex-row">
          {previousPost ? (
            <Link to={`/blog/artigo/${previousPost.slug || previousPost.id}/`} className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-penedo-forest px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-penedo-emerald focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:w-[280px]">
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="flex-1 text-center pr-4">Artigo anterior</span>
            </Link>
          ) : (
            <Link to="/blog/" className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-penedo-forest px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-penedo-emerald focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:w-[280px]">
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="flex-1 text-center pr-4">Ver todos os artigos</span>
            </Link>
          )}
          <Link to={nextPost ? `/blog/artigo/${nextPost.slug || nextPost.id}/` : '/blog/artigo/penedo-guia/'} className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-penedo-forest px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-penedo-emerald focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:w-[280px]">
            <span className="flex-grow text-center pl-4">Continue explorando Penedo</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <section className="relative overflow-hidden border-y border-penedo-emerald/15 bg-[#DCEADF] py-24 text-penedo-forest md:py-32">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={ARTICLE_FOOTER_IMAGE}
              alt=""
              width={1080}
              height={1350}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center opacity-35"
            />
            <div className="absolute inset-0 bg-[#DCEADF]/85" />
          </div>
          <span className="absolute bottom-3 right-4 z-10 text-[10px] font-semibold uppercase tracking-wider text-penedo-forest/65">Foto: Look Drone</span>
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-pretty text-4xl font-black leading-tight md:text-5xl">Quer descobrir mais sabores de Penedo?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl font-medium text-penedo-forest/75">Explore o guia gastronômico do portal e encontre outras opções para a sua viagem.</p>
            <Link to="/gastronomia/" className="inline-flex items-center gap-2 rounded-2xl bg-penedo-forest px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-[transform,background-color] hover:scale-105 hover:bg-penedo-emerald focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold focus-visible:ring-offset-4 focus-visible:ring-offset-[#DCEADF] motion-reduce:transform-none motion-reduce:transition-none">
              Ver guia gastronômico <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {selectedImage && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="imagem-ampliada-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain bg-black/95 p-4 backdrop-blur-sm"
          >
            <h2 id="imagem-ampliada-titulo" className="sr-only">Imagem ampliada</h2>
            <button type="button" tabIndex={-1} className="absolute inset-0 cursor-default" onClick={() => setSelectedImage(null)} aria-label="Fechar imagem ampliada" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelectedImage(null)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSelectedImage(null);
              }}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black hover:text-gray-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-penedo-gold md:right-8 md:top-8"
              aria-label="Fechar imagem ampliada"
            >
              <X size={32} aria-hidden="true" />
            </button>
            <motion.img
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1080}
              height={1350}
              className="pointer-events-none relative z-10 max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
      )}
    </motion.div>
  );
}
