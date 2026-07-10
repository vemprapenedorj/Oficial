import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ArrowRight, Camera } from 'lucide-react';
import SEO from './SEO';
import { generateSEO } from '../seo';

interface RestaurantesArticleProps {
  handleSelectArticle: (id: string | null) => void;
}

const BlogPostCTA = ({ label, onClick, primary = true }: { label: string, onClick: () => void, primary?: boolean }) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
      primary 
        ? 'bg-penedo-emerald text-white hover:bg-penedo-forest shadow-penedo-emerald/20' 
        : 'bg-white text-penedo-forest border-2 border-penedo-forest/10 hover:border-penedo-forest hover:bg-gray-50'
    }`}
  >
    {label} <ArrowRight size={18} />
  </button>
);

const ImageWithFallback = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className, 
  onClick 
}: { 
  src: string; 
  fallbackSrc: string; 
  alt: string; 
  className?: string; 
  onClick?: () => void;
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        } else if (currentSrc !== 'https://picsum.photos/seed/restaurant-fallback/800/600') {
          setCurrentSrc('https://picsum.photos/seed/restaurant-fallback/800/600');
        }
      }}
    />
  );
};

export function RestaurantesArticle({ handleSelectArticle }: RestaurantesArticleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const restaurants = [
    {
      id: 'jardim-secreto',
      name: 'Jardim Secreto',
      icon: '🍽️',
      tagline: 'Sofisticação em Meio à Natureza',
      instagram: 'https://www.instagram.com/restaurante_jardimsecreto/',
      description: 'Entre os destaques gastronômicos da cidade, o Jardim Secreto se destaca pela combinação harmoniosa entre ambiente, atendimento e gastronomia. Instalado em meio a um belo jardim, o restaurante proporciona uma atmosfera intimista e acolhedora, ideal para casais e para quem busca uma experiência diferenciada.',
      details: 'O cuidado com os detalhes é perceptível desde a recepção até a apresentação dos pratos. O cardápio reúne influências da culinária italiana, brasileira e internacional, oferecendo opções elaboradas que valorizam ingredientes de qualidade e técnicas refinadas. Pratos à base de carnes nobres, peixes e sobremesas artesanais demonstram o compromisso da casa com a excelência gastronômica.',
      images: [
        { src: '/assets/imagens/blog/melhores-restaurantes/jardim1.jpg', fallback: '/assets/imagens/gastronomia/jardim-secreto.jpg' },
        { src: '/assets/imagens/blog/melhores-restaurantes/jardim2.jpg', fallback: 'https://picsum.photos/seed/jardim2/600/400' },
        { src: '/assets/imagens/blog/melhores-restaurantes/jardim3.jpg', fallback: 'https://picsum.photos/seed/jardim3/600/400' }
      ]
    },
    {
      id: 'enoteca-serrana',
      name: 'Enoteca Serrana',
      icon: '🍷',
      tagline: 'Gastronomia e Cultura do Vinho',
      instagram: 'https://www.instagram.com/enotecaserrana/',
      description: 'A Enoteca Serrana representa uma combinação bem-sucedida entre restaurante e adega especializada. O ambiente acolhedor, allied a uma ampla seleção de vinhos nacionais e importados, faz do local uma referência para apreciadores da boa mesa.',
      details: 'Seu grande diferencial está na harmonização entre pratos e rótulos cuidadosamente selecionados. A culinária contemporânea ganha destaque em receitas que valorizam sabores equilibrados e apresentações elegantes. A experiência oferecida vai além da refeição, proporcionando uma verdadeira imersão no universo da enogastronomia, sempre acompanhada por um atendimento cordial e especializado.',
      images: [
        { src: '/assets/imagens/blog/melhores-restaurantes/enoteca1.jpg', fallback: '/assets/imagens/gastronomia/enoteca-serrana.jpg' },
        { src: '/assets/imagens/blog/melhores-restaurantes/enoteca2.jpg', fallback: 'https://picsum.photos/seed/enoteca2/600/400' },
        { src: '/assets/imagens/blog/melhores-restaurantes/enoteca3.jpg', fallback: 'https://picsum.photos/seed/enoteca3/600/400' }
      ]
    },
    {
      id: 'rei-das-trutas',
      name: 'Rei das Trutas',
      icon: '🐟',
      tagline: 'Tradição que Conquista Gerações',
      instagram: 'https://www.instagram.com/reidastrutas/',
      description: 'Entre os restaurantes mais tradicionais de Penedo, o Rei das Trutas mantém sua relevância graças à qualidade constante de seus pratos e à valorização de um dos ingredientes mais emblemáticos da região: a truta.',
      details: 'Com diversas opções de preparo e molhos finos, o restaurante oferece uma experiência autêntica para quem deseja conhecer um dos sabores mais característicos da Serra da Mantiqueira. O ambiente simples e acolhedor reforça a proposta de uma gastronomia focada na qualidade dos ingredientes e no sabor característico local.',
      images: [
        { src: '/assets/imagens/blog/melhores-restaurantes/trutas1.jpg', fallback: '/assets/imagens/gastronomia/rei-das-trutas.jpg' },
        { src: '/assets/imagens/blog/melhores-restaurantes/trutas2.jpg', fallback: 'https://picsum.photos/seed/trutas2/600/400' },
        { src: '/assets/imagens/blog/melhores-restaurantes/trutas3.jpg', fallback: 'https://picsum.photos/seed/trutas3/600/400' }
      ]
    },
    {
      id: 'botegare',
      name: 'Botegare',
      icon: '🍽️',
      tagline: 'Contemporaneidade e Elegância',
      instagram: 'https://www.instagram.com/botegarepenedo/',
      description: 'O Botegare combina gastronomia contemporânea, conforto e uma excelente seleção de vinhos. Distribuído em diferentes ambientes, incluindo um agradável jardim, o restaurante proporciona uma experiência sofisticada sem perder o clima acolhedor característico de Penedo.',
      details: 'Seu cardápio reúne pratos cuidadosamente elaborados, que valorizam ingredientes selecionados e técnicas clássicas da culinária internacional. A harmonização com vinhos complementa a experiência e torna o local uma excelente escolha para celebrações e ocasiões especiais.',
      images: [
        { src: '/assets/imagens/blog/melhores-restaurantes/botegare1.jpg', fallback: '/assets/imagens/gastronomia/botegare-penedo.jpg' },
        { src: '/assets/imagens/blog/melhores-restaurantes/botegare2.jpg', fallback: 'https://picsum.photos/seed/botegare2/600/400' },
        { src: '/assets/imagens/blog/melhores-restaurantes/botegare3.jpg', fallback: 'https://picsum.photos/seed/botegare3/600/400' }
      ]
    },
    {
      id: 'jazz-village',
      name: 'Jazz Village',
      icon: '🎷',
      tagline: 'Uma Viagem Pela Culinária Sueca',
      instagram: 'https://www.instagram.com/jazzvillagepenedo/',
      description: 'Localizado em um ambiente charmoso e cercado pela atmosfera europeia que caracteriza Penedo, o Jazz Village oferece uma proposta diferenciada ao apresentar sabores inspirados na culinária sueca.',
      details: 'O restaurante permite que os visitantes conheçam receitas típicas dos países nórdicos, proporcionando uma experiência gastronomica única na região. Pratos à base de peixes selecionados, preparações tradicionais e sobremesas inspiradas na cultura escandinava criam uma identidade própria que atrai turistas em busca de novas descobertas culinárias.',
      images: [
        { src: '/assets/imagens/blog/melhores-restaurantes/jazzvillage1.jpg', fallback: '/assets/imagens/gastronomia/jazz-village.jpg' },
        { src: '/assets/imagens/blog/melhores-restaurantes/jazzvillage2.jpg', fallback: 'https://picsum.photos/seed/jazzvillage2/600/400' },
        { src: '/assets/imagens/blog/melhores-restaurantes/jazzvillage3.jpg', fallback: 'https://picsum.photos/seed/jazzvillage3/600/400' }
      ]
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <SEO 
        {...generateSEO('article', {
          slug: 'restaurantes',
          title: 'Gastronomia em Penedo',
          description: 'Descubra os melhores restaurantes de Penedo. Massas, trutas, fondues e pratos que vão deixar sua viagem ainda mais deliciosa.',
          image: '/assets/imagens/blog/melhores-restaurantes/capa.jpg',
          datePublished: '2026-07-12',
          keywords: ['restaurantes penedo', 'onde comer em penedo', 'gastronomia penedo']
        })}
      />
      {/* Sticky Header Back Navigation */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => handleSelectArticle(null)} 
            className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none"
          >
            <ArrowLeft size={20} /> Voltar para o Blog
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Lendo: <span className="text-penedo-forest">Gastronomia em Penedo RJ</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative pt-10 md:pt-20 md:pt-32 pb-8 md:pb-16 md:pt-40 md:pb-24 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          <ImageWithFallback 
            src="/assets/imagens/blog/melhores-restaurantes/intro.jpg" 
            fallbackSrc="https://picsum.photos/seed/restaurantes-intro/1920/1080"
            className="w-full h-full object-cover" 
            alt="Onde Comer em Penedo experiencia gastronomica" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-penedo-forest/60 via-transparent to-penedo-forest"></div>
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-penedo-gold text-penedo-forest text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl"
          >
            Gastronomia & Experiência
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
          >
            Onde Comer em Penedo: Uma Experiência Gastronômica que <span className="text-penedo-gold italic">Vai Além da Mesa</span>
          </motion.h1>
        </div>
      </header>

      {/* Intro and Main Content */}
      <section className="py-8 md:py-16 md:py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="prose prose-xl prose-penedo max-w-none text-gray-600 mb-4 md:mb-8 md:mb-16 text-left">
            <p className="lead font-medium text-2xl text-gray-800 drop-shadow-sm mb-6">
              Penedo, no sul do estado do Rio de Janeiro, é um destino conhecido por suas paisagens encantadoras, clima acolhedor de serra e forte influência europeia.
            </p>
            <p className="text-lg leading-relaxed">
              No entanto, um dos grandes diferenciais da região está em sua rica gastronomia, capaz de transformar qualquer viagem em uma verdadeira experiência sensorial.
            </p>
            <p className="text-lg leading-relaxed">
              Com restaurantes que unem tradição, criatividade e ingredientes locais selecionados, a cidade oferece opções para os mais diversos paladares. Entre ambientes românticos, cartas de vinhos cuidadosamente elaboradas e pratos que valorizam tanto a culinária brasileira quanto referências internacionais, Penedo se consolida como um dos principais polos gastronômicos de serra do país.
            </p>
          </div>

          <div className="mb-4 md:mb-8 md:mb-16 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <ImageWithFallback 
              src="/assets/imagens/blog/melhores-restaurantes/intro-2.jpg"
              fallbackSrc="https://picsum.photos/seed/restaurantes-intro-2/1920/1080"
              alt="Introdução aos Restaurantes Penedo" 
              className="w-full h-auto md:h-96 object-cover bg-[#FAFAFA] cursor-pointer hover:scale-105 transition-transform duration-700"
              onClick={() => setSelectedImage("/assets/imagens/blog/melhores-restaurantes/intro-2.jpg")}
            />
          </div>

          {/* Restaurant Cards */}
          <div className="space-y-16">
            {restaurants.map((rest) => (
              <div key={rest.id} className="bg-white rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-xl text-left">
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-black text-penedo-forest mb-2">
                    {rest.instagram ? (
                      <a 
                        href={rest.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-penedo-emerald transition-colors inline-flex flex-wrap items-center gap-3 cursor-pointer group/title"
                      >
                        <span>{rest.icon} {rest.name}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-1 select-none">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                          </svg>
                          Instagram
                        </span>
                      </a>
                    ) : (
                      <span>{rest.icon} {rest.name}</span>
                    )}
                  </h2>
                  <p className="text-penedo-emerald font-bold tracking-widest text-xs uppercase">
                    {rest.tagline}
                  </p>
                </div>
                
                <div className="text-gray-600 space-y-4 mb-4 md:mb-8 text-lg">
                  <p>{rest.description}</p>
                  <p>{rest.details}</p>
                </div>

                {/* Sub-gallery with 2xl border radius and hover effects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 overflow-hidden rounded-2xl group shadow-md h-64 md:h-80">
                    <ImageWithFallback 
                      src={rest.images[0].src} 
                      fallbackSrc={rest.images[0].fallback} 
                      alt={`${rest.name} principal`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                      onClick={() => setSelectedImage(rest.images[0].src)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 h-64 md:h-80">
                    <div className="overflow-hidden rounded-2xl group shadow-md h-1/2">
                      <ImageWithFallback 
                        src={rest.images[1].src} 
                        fallbackSrc={rest.images[1].fallback} 
                        alt={`${rest.name} detalhe 1`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                        onClick={() => setSelectedImage(rest.images[1].src)}
                      />
                    </div>
                    <div className="overflow-hidden rounded-2xl group shadow-md h-1/2">
                      <ImageWithFallback 
                        src={rest.images[2].src} 
                        fallbackSrc={rest.images[2].fallback} 
                        alt={`${rest.name} detalhe 2`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                        onClick={() => setSelectedImage(rest.images[2].src)}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-center text-gray-400 italic">
                  Fotos retiradas do instagram d{rest.id === 'enoteca-serrana' ? 'a' : 'o'} {rest.name}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Conclusion */}
      <section className="py-8 md:py-16 bg-white text-left">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-penedo-forest mb-4 md:mb-8 tracking-tighter text-center">Conclusão</h2>
          <div className="prose prose-xl prose-penedo max-w-none text-gray-600 mb-6 md:mb-12">
            <p className="text-lg leading-relaxed">
              A gastronomia de Penedo é um dos principais motivos que levam os visitantes a retornarem frequentemente à cidade. Com opções que vão desde restaurantes rústicos e tradicionais até estabelecimentos altamente sofisticados e especializados em culinárias de origens diversas, o destino oferece experiências completas capazes de encantar e satisfazer os paladares mais exigentes.
            </p>
            <p className="text-lg leading-relaxed">
              Mais do que simples refeições, os renomados restaurantes de Penedo proporcionam momentos especiais em família ou a dois, unindo sabores autênticos, hospitalidade serrana exemplar e cenários inesquecíveis.
            </p>
            <p className="text-gray-400 text-sm mt-6 italic">Publicado em 22/06/2026.</p>
          </div>
          
          <div className="mb-4 md:mb-8 md:mb-16 rounded-[3rem] overflow-hidden shadow-2xl relative w-full h-96 md:h-[32rem]">
            <ImageWithFallback 
              src="/assets/imagens/blog/melhores-restaurantes/conclusao.jpg"
              fallbackSrc="https://picsum.photos/seed/restaurantes-conclusao/1920/1080"
              alt="Conclusão Onde Comer em Penedo" 
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
              onClick={() => setSelectedImage("/assets/imagens/blog/melhores-restaurantes/conclusao.jpg")}
            />
          </div>
        </div>
      </section>

      {/* CTA final section */}
      <section className="py-32 bg-penedo-forest relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="https://picsum.photos/seed/restaurantes-cta/1920/1080?blur=5" className="w-full h-full object-cover" alt="Footer Evento" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 md:mb-8 leading-tight">Pronto para sua própria jornada gastronômica?</h2>
          <p className="text-xl text-white/80 mb-6 md:mb-12 font-medium">Fale conosco pelo WhatsApp agora mesmo e receba dicas personalizadas sobre onde comer e onde se hospedar em Penedo!</p>
          <div className="flex justify-center">
            <BlogPostCTA 
              label="Falar com Especialista" 
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá!%20Gostaria%20de%20dicas%20sobre%20onde%20comer%20e%20passear%20em%20Penedo!')} 
              primary={true} 
            />
          </div>
        </div>
      </section>

      {/* Lightbox Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 md:top-8 right-4 md:right-8 text-white hover:text-gray-300 transition-colors z-50 cursor-pointer p-2 bg-black/50 rounded-full"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={selectedImage}
                fallbackSrc="https://picsum.photos/seed/modal-fallback/1200/900"
                alt="Imagem ampliada"
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
