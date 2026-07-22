import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ArrowRight, Check, MapPin, ExternalLink, Calendar, Clock, User, Droplets, Utensils, ShoppingBag } from 'lucide-react';
import SEO from './SEO';
import { generateSEO } from '../seo';
import { DETAILS_DATA } from '../data/detailsData';
import { DetailItem, Page } from '../types';

interface Roteiro1DiaArticleProps {
  onOpenDetail: (item: DetailItem) => void;
  onNavigate: (page: Page, premiumSlug?: string | null) => void;
  handleSelectArticle: (id: string | null) => void;
}

interface EstablishmentLinkProps {
  id: string;
  label: string;
  onOpenDetail: (item: DetailItem) => void;
  onOpenConfirm: (item: DetailItem) => void;
}

const getItemPath = (item: DetailItem): string => {
  for (const [category, items] of Object.entries(DETAILS_DATA)) {
    if (items.some(candidate => candidate.id === item.id)) {
      const itemSlug = item.slug || item.id;
      return item.isPremium
        ? `/${category}/${itemSlug}`
        : `/${category}#local=${encodeURIComponent(itemSlug)}`;
    }
  }
  return `/detalhe/${item.slug || item.id}`;
};

const EstablishmentLink: React.FC<EstablishmentLinkProps> = ({ id, label, onOpenDetail, onOpenConfirm }) => {
  const item = React.useMemo(() => {
    for (const items of Object.values(DETAILS_DATA)) {
      const found = items.find(c => c.id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  if (!item) {
    return <span className="font-semibold text-gray-800">{label}</span>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.isPremium) {
      onOpenConfirm(item);
    } else {
      onOpenDetail(item);
    }
  };

  return (
    <a
      href={getItemPath(item)}
      onClick={handleClick}
      className="inline-flex items-center gap-0.5 font-bold text-penedo-emerald hover:text-penedo-forest transition-colors underline decoration-dotted underline-offset-4 cursor-pointer outline-none border-none bg-transparent p-0 align-baseline"
    >
      {label}
    </a>
  );
};

interface BlockImageProps {
  id: string;
  src: string;
  alt: string;
  onOpenDetail: (item: DetailItem) => void;
  onOpenConfirm: (item: DetailItem) => void;
}

const BlockImage: React.FC<BlockImageProps> = ({ id, src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const item = React.useMemo(() => {
    for (const items of Object.values(DETAILS_DATA)) {
      const found = items.find(c => c.id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Ampliar imagem: ${alt}`}
        className="group bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 rounded-[2rem] transition-all duration-500 w-full flex flex-col cursor-zoom-in hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
      >
        <div className={`h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 relative w-full ${id === 'emporio-haru' ? 'bg-[#fff6ed]' : 'bg-gray-50'}`}>
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-center transition-transform duration-700 group-hover:scale-[1.02] ${id === 'emporio-haru' ? 'object-contain' : 'object-cover'}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/seed/${id}/800/600`;
            }}
          />
          {item?.isPremium && (
            <div className="absolute top-3 right-3 bg-penedo-gold text-penedo-forest font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-white/20">
              Premium
            </div>
          )}
        </div>
        <div className="mt-4 px-2 pb-1 text-center w-full">
          <p className="text-sm font-bold text-penedo-forest transition-colors group-hover:text-penedo-emerald">
            {item?.title || alt}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-[200] bg-black/90 p-4 md:p-10 flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar imagem ampliada"
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white text-penedo-forest flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
            >
              <X size={24} />
            </button>
            <motion.img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const BlogPostCTA = ({ label, href, onClick }: { label: string, href: string, onClick: () => void }) => (
  <Link
    to={href}
    onClick={onClick}
    className="px-6 h-[52px] w-full md:w-[250px] rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-between cursor-pointer bg-[#A7F3D0] text-[#064E3B] hover:bg-[#D1FAE5] hover:shadow-[#A7F3D0]/20 border-none outline-none"
  >
    <span className="flex-grow text-center pl-4">{label}</span>
    <ArrowRight size={16} className="shrink-0" />
  </Link>
);

export function Roteiro1DiaArticle({ onOpenDetail, onNavigate, handleSelectArticle }: Roteiro1DiaArticleProps) {
  const [confirmPremiumItem, setConfirmPremiumItem] = useState<DetailItem | null>(null);

  const blogPosts = DETAILS_DATA['blog'] || [];
  const currentIndex = blogPosts.findIndex(post => post.id === 'roteiro-1-dia-em-penedo');
  const prevPost = currentIndex !== -1 && currentIndex + 1 < blogPosts.length ? blogPosts[currentIndex + 1] : null;

  React.useEffect(() => {
    if (confirmPremiumItem) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setConfirmPremiumItem(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [confirmPremiumItem]);

  const handleOpenConfirm = (item: DetailItem) => {
    setConfirmPremiumItem(item);
  };

  const handlePrevArticle = () => {
    if (prevPost) {
      const inlineArticleIds = ['roteiro-1-dia-em-penedo', 'penedo-guia', 'cachoeiras-penedo', 'restaurantes', 'melhores-hospedagens'];
      if (inlineArticleIds.includes(prevPost.id)) {
        handleSelectArticle(prevPost.id);
      } else {
        onNavigate('blog');
      }
    } else {
      handleSelectArticle(null);
      onNavigate('blog');
    }
  };

  const handleContinueExploring = () => {
    const penedoGuiaExists = blogPosts.some(post => post.id === 'penedo-guia');
    if (penedoGuiaExists) {
      handleSelectArticle('penedo-guia');
    } else {
      onNavigate('o-que-fazer');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <SEO 
        {...generateSEO('article', {
          slug: 'roteiro-1-dia-em-penedo',
          title: 'Roteiro de 1 dia em Penedo: onde ficar, comer e passear',
          description: 'Planeje um roteiro de 1 dia em Penedo-RJ com hospedagens, restaurantes, cafés, chocolates, cachoeiras e dicas para aproveitar o fim de semana.',
          image: '/assets/imagens/blog/roteiro-1-dia-penedo/capa.jpg',
          datePublished: '2026-07-20',
          keywords: ['roteiro de 1 dia em penedo', 'o que fazer em penedo', 'onde comer em penedo', 'hospedagem em penedo', 'cafés em penedo', 'cachoeiras em penedo']
        })}
      />

      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/blog" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar para o Blog
          </Link>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Lendo: <span className="text-penedo-forest">Roteiro de 1 Dia em Penedo</span>
          </div>
        </div>
      </div>

      {/* Hero / Cover Page */}
      <header className="relative pt-24 pb-12 md:pt-36 md:pb-20 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="/assets/imagens/blog/roteiro-1-dia-penedo/capa.jpg" 
            className="w-full h-full object-cover" 
            alt="Pequena Finlândia e natureza de Penedo RJ" 
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/penedoroad/1920/1080"; }}
          />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Roteiro de 1 dia em Penedo: <span className="text-penedo-gold">onde ficar, o que fazer e onde comer</span> no fim de semana
          </h1>
          <p className="text-white/90 font-medium text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Planeje um dia perfeito na colônia finlandesa brasileira da Serra da Mantiqueira, com dicas gastronômicas, passeios naturais e compras.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-white/85 uppercase tracking-widest mt-8">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-penedo-gold" /> 20/07/2026</span>
            <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-penedo-gold" /> 8 MIN DE LEITURA</span>
            <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
            <span className="flex items-center gap-1.5"><User size={14} className="text-penedo-gold" /> PORTAL VEM PRA PENEDO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 md:py-20 bg-white">
        <article className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg md:prose-xl prose-penedo max-w-none text-gray-700 leading-relaxed space-y-6 md:space-y-8">
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Penedo, distrito de Itatiaia-RJ, é um dos destinos mais charmosos da Serra da Mantiqueira. A combinação entre natureza, tradição finlandesa, gastronomia e comércio local faz da região uma excelente escolha para um bate-volta de sábado ou domingo — ou para uma rápida hospedagem de fim de semana.
            </p>
            <p>
              Em um único dia, o ideal é equilibrar passeio pelo centro, uma experiência em meio à natureza e boas paradas para comer, tomar café e conhecer produtos locais. Confira este roteiro para aproveitar Penedo no seu ritmo.
            </p>

            {/* Section 1: Lodging */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Onde se hospedar em Penedo
            </h2>
            <p>
              Se a ideia for chegar na sexta-feira ou estender a visita até domingo, ficar hospedado em Penedo deixa o roteiro mais leve e permite aproveitar melhor a noite da região.
            </p>
            <p>
              A <EstablishmentLink id="pousada-aurora-mantiqueira" label="Pousada Aurora da Mantiqueira" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma indicação para quem busca descanso, clima de serra e proximidade com a natureza. A <EstablishmentLink id="pousada-rainha-da-mata" label="Pousada Rainha da Mata" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma alternativa para visitantes que valorizam sossego e uma experiência mais conectada à área verde de Penedo.
            </p>
            <p>
              Já a <EstablishmentLink id="pousada-villa-luna" label="Pousada Villa Luna" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> combina um ambiente acolhedor com localização prática, próxima ao centrinho e à Pequena Finlândia — uma boa escolha para quem deseja fazer parte do roteiro a pé.
            </p>

            {/* Images Block — Lodging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="pousada-aurora-mantiqueira" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/pousada-aurora-da-mantiqueira.jpg" 
                alt="Pousada Aurora da Mantiqueira em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
              <BlockImage 
                id="pousada-villa-luna" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/pousada-villa-luna.jpg" 
                alt="Pousada Villa Luna em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Hospedagens para aproveitar Penedo com conforto e tranquilidade.”
            </p>

            {/* Section 2: Morning */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Manhã: Pequena Finlândia, cafés e chocolates
            </h2>
            <p>
              Comece o dia pela Pequena Finlândia, o principal centro turístico de Penedo. O local reúne lojas, artesanato, restaurantes, chocolaterias e uma arquitetura que remete à herança dos imigrantes finlandeses que ajudaram a formar a identidade da região.
            </p>
            <p>
              Antes de seguir para os passeios, faça uma pausa para um café. O <EstablishmentLink id="kahvila-cafe" label="Kahvila Cafés Especiais" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma ótima opção para quem aprecia métodos, grãos e uma experiência mais voltada ao café de qualidade. O <EstablishmentLink id="cafe-finlandes-penedo" label="Café Finlandês" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma escolha tradicional para aproveitar o clima do centrinho, enquanto o <EstablishmentLink id="andicaro-penedo-cafes-especiais" label="Andicarô Penedo" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> complementa o roteiro para quem quer conhecer cafés especiais e produtos selecionados.
            </p>

            {/* Images Block — Cafés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="kahvila-cafe" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/kahvila-cafes-especiais.jpg" 
                alt="Café servido no Kahvila Cafés Especiais em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
              <BlockImage 
                id="andicaro-penedo-cafes-especiais" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/andicaro-penedo.jpg" 
                alt="Andicarô Penedo e cafés especiais" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Uma pausa para café faz parte da experiência em Penedo.”
            </p>

            <p>
              Aproveite também para visitar as chocolaterias. O <EstablishmentLink id="chocolate-do-papai-noel" label="Chocolate do Papai Noel" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} />, a <EstablishmentLink id="lugano-penedo" label="Lugano Penedo" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> e a <EstablishmentLink id="tonttulakki-suklaat" label="Tontulakki" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> são boas paradas para experimentar sabores, escolher presentes e levar um pouco de Penedo para casa.
            </p>

            {/* Images Block — Chocolates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="chocolate-do-papai-noel" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/chocolate-do-papai-noel.jpg" 
                alt="Chocolates do Papai Noel em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
              <BlockImage 
                id="lugano-penedo" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/lugano-penedo.jpg" 
                alt="Loja Lugano em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Chocolates artesanais e lembranças para levar da viagem.”
            </p>

            {/* Section 3: Lunch */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Almoço: sabores para diferentes estilos
            </h2>
            <p>
              Depois de passear pelo centro, escolha um restaurante e aproveite o almoço sem pressa.
            </p>
            <p>
              A <EstablishmentLink id="casa-da-picanha" label="Casa da Picanha" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma indicação para quem busca carnes e uma refeição farta. Para quem prefere a tradição dos peixes da serra, o <EstablishmentLink id="rei-das-trutas" label="Rei das Trutas" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma escolha alinhada à gastronomia clássica de Penedo. Já a <EstablishmentLink id="bazzini-pizzeria" label="Bazzini Pizzeria" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> funciona bem para quem deseja uma refeição descontraída, especialmente em casal, família ou grupo de amigos.
            </p>
            <p>
              A dica é confirmar o horário de funcionamento e, em fins de semana e feriados, reservar com antecedência sempre que possível.
            </p>

            {/* Images Block — Restaurantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="casa-da-picanha" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/casa-da-picanha.jpg" 
                alt="Prato servido na Casa da Picanha em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
              <BlockImage 
                id="rei-das-trutas" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/rei-das-trutas.jpg" 
                alt="Prato do Rei das Trutas em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Gastronomia para diferentes estilos de viagem e paladares.”
            </p>

            {/* Section 4: Nature */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Tarde: cachoeiras e natureza em Penedo
            </h2>
            <p>
              Após o almoço, aproveite o lado natural do destino. Para um roteiro de um dia, as cachoeiras próximas ao centro são as opções mais práticas.
            </p>
            <p>
              As <EstablishmentLink id="tres-cachoeiras" label="Três Cachoeiras" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> são indicadas para quem procura acesso simples e um passeio mais leve. Já a <EstablishmentLink id="cachoeira-deus" label="Cachoeira de Deus" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma das mais conhecidas da região e entrega uma experiência mais próxima da Mata Atlântica. Para visitá-la, use calçado firme, leve água e redobre a atenção em dias de chuva.
            </p>
            <p>
              Quem prefere uma vista panorâmica pode incluir o <EstablishmentLink id="pico-do-penedinho" label="Pico do Penedinho" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> no roteiro. A trilha exige disposição, mas a paisagem no alto compensa o esforço. Antes de ir, confirme os horários e condições de acesso.
            </p>

            {/* Images Block — Natureza */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="tres-cachoeiras"
                src="/assets/imagens/blog/roteiro-1-dia-penedo/tres-cachoeiras-penedo.jpg"
                alt="Três Cachoeiras em Penedo"
                onOpenDetail={onOpenDetail}
                onOpenConfirm={handleOpenConfirm}
              />
              <BlockImage 
                id="cachoeira-deus"
                src="/assets/imagens/blog/roteiro-1-dia-penedo/cachoeira-de-deus.jpg"
                alt="Cachoeira de Deus em Penedo"
                onOpenDetail={onOpenDetail}
                onOpenConfirm={handleOpenConfirm}
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Cachoeiras e paisagens naturais para completar o roteiro.”
            </p>

            {/* Section 5: Afternoon Shopping */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Final de tarde: presentes, sabores e comércio local
            </h2>
            <p>
              No retorno ao centro, reserve um momento para conhecer negócios locais e encontrar lembranças diferentes.
            </p>
            <p>
              A <EstablishmentLink id="delicias-da-carol" label="Delícias da Carol" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma parada interessante para quem deseja levar produtos artesanais e sabores especiais. No <EstablishmentLink id="emporio-haru" label="Empório Haru" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} />, é possível explorar produtos orientais e itens selecionados que ampliam a experiência gastronômica do passeio.
            </p>
            <p>
              Para presentes e decoração, a <EstablishmentLink id="arte-da-nossa-terra" label="Arte da Nossa Terra" onOpenDetail={onOpenDetail} onOpenConfirm={handleOpenConfirm} /> é uma boa escolha. A loja reúne lembrancinhas, artigos de decoração e peças de artesanato local para quem deseja levar uma recordação autêntica de Penedo.
            </p>

            {/* Images Block — Compras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-4xl mx-auto">
              <BlockImage 
                id="emporio-haru" 
                src="/assets/imagens/blog/roteiro-1-dia-penedo/emporio-haru.jpg" 
                alt="Produtos orientais no Empório Haru em Penedo" 
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
              <BlockImage 
                id="arte-da-nossa-terra"
                src="/assets/imagens/blog/roteiro-1-dia-penedo/arte-da-nossa-terra.jpg?v=2"
                alt="Artesanato, presentes e decoração da Arte da Nossa Terra em Penedo"
                onOpenDetail={onOpenDetail} 
                onOpenConfirm={handleOpenConfirm} 
              />
            </div>
            <p className="text-center text-xs text-gray-400 italic -mt-4 mb-8">
              “Produtos locais, presentes e sabores para lembrar de Penedo.”
            </p>

            {/* Section 6: Evening */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Noite: jantar e passeio iluminado pelo centrinho
            </h2>
            <p>
              À noite, Penedo ganha um clima ainda mais especial. Depois de descansar um pouco na pousada ou terminar as compras, volte ao centrinho para jantar e caminhar pela Pequena Finlândia iluminada.
            </p>
            <p>
              Você pode escolher a Casa da Picanha, o Rei das Trutas ou a Bazzini Pizzeria, conforme o estilo da refeição desejada. Para fechar o dia, um café, chocolate quente ou sobremesa nas cafeterias e chocolaterias locais é sempre uma ótima decisão.
            </p>

            {/* Section 7: Tips */}
            <hr className="my-10 border-gray-100" />
            <h2 className="text-2xl md:text-3xl font-black text-penedo-forest tracking-tight">
              Dicas para aproveitar melhor Penedo
            </h2>
            <ul className="space-y-3 list-disc list-inside pl-4">
              <li>Chegue cedo para aproveitar o centro antes do maior movimento.</li>
              <li>Em dias quentes, priorize cachoeiras; em dias frios ou chuvosos, invista nas cafeterias, gastronomia e lojas.</li>
              <li>Use tênis ou calçado confortável para trilhas e áreas naturais.</li>
              <li>Confirme horários, reservas e condições das atrações antes de sair.</li>
              <li>Se possível, fique uma noite na região para aproveitar a gastronomia noturna sem pressa.</li>
            </ul>

            {/* Section 8: CTA */}
            <hr className="my-12 border-gray-100" />
            <div className="bg-gradient-to-br from-[#064E3B] to-[#0B6B50] border border-[#0B6B50]/30 rounded-[2.5rem] p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                  Quer montar sua viagem para Penedo?
                </h3>
                <p className="text-white/80 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                  Conheça as melhores opções de hospedagem, restaurantes, cafeterias, lojas e passeios no Vem Pra Penedo.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center max-w-4xl mx-auto">
                  <BlogPostCTA label="Ver hospedagens" href="/onde-ficar" onClick={() => onNavigate('onde-ficar')} />
                  <BlogPostCTA label="Ver onde comer" href="/gastronomia" onClick={() => onNavigate('gastronomia')} />
                  <BlogPostCTA label="Ver compras em Penedo" href="/compras" onClick={() => onNavigate('compras')} />
                  <div className="sm:col-span-2 md:col-span-3 flex justify-center w-full">
                    <BlogPostCTA label="Ver passeios e roteiros" href="/o-que-fazer" onClick={() => onNavigate('o-que-fazer')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons below CTA */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-100 max-w-4xl mx-auto w-full px-4 mb-12">
              {prevPost ? (
                <Link
                  to={`/blog/artigo/${prevPost.id}`}
                  className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  <span className="flex-1 text-center pr-4">Artigo anterior</span>
                </Link>
              ) : (
                <Link
                  to="/blog"
                  className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  <span className="flex-1 text-center pr-4">Ver todos os artigos</span>
                </Link>
              )}
              
              <Link
                to="/blog/artigo/penedo-guia"
                className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
              >
                <span className="flex-grow text-center pl-4">Continue explorando Penedo</span>
                <ArrowRight size={16} className="shrink-0" />
              </Link>
            </div>

          </div>
        </article>
      </main>

      {/* Confirmation Modal for Premium Establishments */}
      <AnimatePresence>
        {confirmPremiumItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setConfirmPremiumItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setConfirmPremiumItem(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50 cursor-pointer border-none bg-transparent"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 bg-penedo-mint/40 text-penedo-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink size={28} />
              </div>

              <h3 className="text-xl md:text-2xl font-black text-penedo-forest mb-3 leading-snug">
                Você será direcionado para uma página exclusiva
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Deseja conhecer mais detalhes sobre <span className="font-bold text-gray-800">{confirmPremiumItem.title}</span>?
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => setConfirmPremiumItem(null)}
                  className="py-3 px-6 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-colors text-xs uppercase tracking-wider cursor-pointer flex-1 border-none"
                >
                  Permanecer no roteiro
                </button>
                <Link
                  to={getItemPath(confirmPremiumItem)}
                  onClick={() => {
                    setConfirmPremiumItem(null);
                  }}
                  className="py-3 px-6 bg-penedo-emerald text-white font-black rounded-2xl hover:bg-penedo-forest transition-colors text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-penedo-emerald/20 flex-1 border-none"
                >
                  Conhecer estabelecimento
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
