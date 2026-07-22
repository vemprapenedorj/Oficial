import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Page, DetailItem } from '../types';
import { shuffleArray } from '../utils/shuffle';
import { DETAILS_DATA } from '../data/detailsData';
import { PremiumCarousel } from '../components/PremiumCarousel';
import { SearchPromo } from '../components/SearchPromo';
import { pushSearch } from '../analytics/events';
import { DeferredSection } from '../components/performance/DeferredSection';
import { Helmet } from 'react-helmet-async';
import { Carousel } from '../components/Carousel';
import { InfoCard } from '../components/InfoCard';
import { Link } from 'react-router-dom';

export function HomePage({ 
  onNavigate, 
  onOpenDetail,
  onSelectArticle
}: { 
  onNavigate: (page: Page) => void, 
  onOpenDetail: (item: DetailItem) => void,
  onSelectArticle: (id: string | null) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Randomized data for each section
  const shuffledOQueFazer = React.useMemo(() => shuffleArray(DETAILS_DATA['o-que-fazer']), []);
  const shuffledOndeFicar = React.useMemo(() => shuffleArray(DETAILS_DATA['onde-ficar']), []);
  const shuffledGastronomia = React.useMemo(() => shuffleArray(DETAILS_DATA['gastronomia']), []);
  const shuffledCompras = React.useMemo(() => shuffleArray(DETAILS_DATA['compras']), []);
  const shuffledBlog = React.useMemo(() => shuffleArray(DETAILS_DATA['blog']), []);

  const allItems = Object.values(DETAILS_DATA).flat();
  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredResults.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredResults.length]);

  return (
    <div>
      <Helmet>
        <link rel="preload" as="image" href="/assets/imagens/hero-mobile.webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/imagens/hero-tablet.webp" media="(min-width: 768px) and (max-width: 1279px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/imagens/hero-desktop.webp" media="(min-width: 1280px)" fetchPriority="high" />
      </Helmet>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            {/* Desktop (1920px) */}
            <source 
              media="(min-width: 1280px)" 
              srcSet="/assets/imagens/hero-desktop.avif" 
              type="image/avif" 
            />
            <source 
              media="(min-width: 1280px)" 
              srcSet="/assets/imagens/hero-desktop.webp" 
              type="image/webp" 
            />
            <source 
              media="(min-width: 1280px)" 
              srcSet="/assets/imagens/hero-desktop.jpg" 
              type="image/jpeg" 
            />

            {/* Tablet (1280px) */}
            <source 
              media="(min-width: 768px)" 
              srcSet="/assets/imagens/hero-tablet.avif" 
              type="image/avif" 
            />
            <source 
              media="(min-width: 768px)" 
              srcSet="/assets/imagens/hero-tablet.webp" 
              type="image/webp" 
            />
            <source 
              media="(min-width: 768px)" 
              srcSet="/assets/imagens/hero-tablet.jpg" 
              type="image/jpeg" 
            />

            {/* Mobile (768px) */}
            <source 
              srcSet="/assets/imagens/hero-mobile.avif" 
              type="image/avif" 
            />
            <source 
              srcSet="/assets/imagens/hero-mobile.webp" 
              type="image/webp" 
            />
            
            <img 
              src="/assets/imagens/hero-mobile.jpg" 
              className="w-full h-full object-cover" 
              alt="Penedo"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span 
            className="inline-block px-4 py-1 mb-6 rounded-full bg-penedo-gold/20 border border-penedo-gold/30 text-penedo-gold text-sm font-semibold tracking-widest uppercase"
          >
            Descubra o Paraíso
          </span>
          <h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            A Magia de <span className="text-penedo-gold drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">Penedo</span>
          </h1>
          <p 
            className="text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Entre a natureza exuberante e o charme da colonização finlandesa, encontre o seu refúgio perfeito na Serra da Mantiqueira.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/gastronomia"
              className="px-8 py-4 bg-penedo-emerald hover:bg-penedo-forest text-white rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explorar Agora <ArrowRight size={20} />
            </Link>
            <Link
              to="/compras"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Onde Comprar
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Carousel Section */}
      <PremiumCarousel />

      {/* Search Promo */}
      <SearchPromo query={searchQuery} onSearch={setSearchQuery} />

      {searchQuery.trim() !== '' ? (
        <section className="py-10 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-penedo-forest mb-4 md:mb-8">Resultados da Busca para "{searchQuery}"</h2>
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResults.map((item) => (
                  <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-20">
                <p className="text-gray-500 text-xl">Nenhum resultado encontrado em todo o site.</p>
              </div>
            )}
            <div className="mt-12 pt-12 border-t border-gray-100">
              <button 
                onClick={() => setSearchQuery('')}
                className="text-penedo-emerald font-bold hover:underline"
              >
                ← Voltar para os destaques
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* O Que Fazer Section */}
          <DeferredSection height={450}>
              <Carousel 
                title="O Que Fazer"
                subtitle="Descubra as melhores atrações e passeios."
                items={shuffledOQueFazer}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('o-que-fazer')}
                navigateHref="/o-que-fazer"
              />
          </DeferredSection>

          {/* Onde Ficar Section */}
          <DeferredSection height={450}>
              <Carousel 
                title="Onde Ficar"
                subtitle="Pousadas e hotéis para o seu descanso."
                items={shuffledOndeFicar}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('onde-ficar')}
                navigateHref="/onde-ficar"
              />
          </DeferredSection>

          {/* Gastronomia Section */}
          <DeferredSection height={450}>
              <Carousel 
                title="Gastronomia"
                subtitle="Os melhores sabores de Penedo."
                items={shuffledGastronomia}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('gastronomia')}
                navigateHref="/gastronomia"
              />
          </DeferredSection>

          {/* Compras Section */}
          <DeferredSection height={450}>
              <Carousel 
                title="Compras & Lojas"
                subtitle="Artesanato e produtos exclusivos."
                items={shuffledCompras}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('compras')}
                navigateHref="/compras"
              />
          </DeferredSection>

          {/* Blog Section */}
          <DeferredSection height={450}>
              <Carousel 
                title="Blog & Dicas"
                subtitle="Fique por dentro das novidades e curiosidades."
                items={shuffledBlog}
                renderItem={(item) => (
                  <InfoCard 
                    item={item} 
                    onOpen={(item) => {
                      if (item.id === 'roteiro-1-dia-em-penedo' || item.id === 'penedo-guia' || item.id === 'cachoeiras-penedo' || item.id === 'restaurantes' || item.id === 'melhores-hospedagens') {
                        onSelectArticle(item.id);
                      } else {
                        onNavigate('blog');
                      }
                    }} 
                  />
                )}
                onNavigate={() => onNavigate('blog')}
                navigateHref="/blog"
              />
          </DeferredSection>
        </>
      ) /* End of searchQuery conditional */}
    </div>
);
}
