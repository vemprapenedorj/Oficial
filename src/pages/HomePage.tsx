import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Page, DetailItem } from '../types';
import { shuffleArray } from '../utils/shuffle';
import { DETAILS_DATA } from '../data/detailsData';
import { PremiumCarousel } from '../components/PremiumCarousel';
import { SearchPromo } from '../components/SearchPromo';
import { pushSearch } from '../analytics/events';
import { DeferredSection } from '../components/performance/DeferredSection';

const Carousel = lazy(() => import('../components/Carousel').then(m => ({ default: m.Carousel })));
const InfoCard = lazy(() => import('../components/InfoCard').then(m => ({ default: m.InfoCard })));

export function HomePage({ 
  onNavigate, 
  onOpenDetail,
  onSelectArticle,
  onNavigatePremium
}: { 
  onNavigate: (page: Page) => void, 
  onOpenDetail: (item: DetailItem) => void,
  onSelectArticle: (id: string | null) => void,
  onNavigatePremium: (slug: string) => void
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
            <a 
              href="/gastronomia"
              onClick={(e) => { e.preventDefault(); onNavigate('gastronomia'); }} 
              className="px-8 py-4 bg-penedo-emerald hover:bg-penedo-forest text-white rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explorar Agora <ArrowRight size={20} />
            </a>
            <a 
              href="/compras"
              onClick={(e) => { e.preventDefault(); onNavigate('compras'); }} 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Onde Comprar
            </a>
          </div>
        </div>
      </section>

      {/* Premium Carousel Section */}
      <PremiumCarousel onNavigatePremium={onNavigatePremium} />

      {/* Search Promo */}
      <SearchPromo query={searchQuery} onSearch={setSearchQuery} />

      {searchQuery.trim() !== '' ? (
        <section className="py-10 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-penedo-forest mb-4 md:mb-8">Resultados da Busca para "{searchQuery}"</h2>
            {filteredResults.length > 0 ? (
              <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-penedo-emerald border-t-transparent rounded-full animate-spin"></div></div>}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredResults.map((item) => (
                    <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
                  ))}
                </div>
              </Suspense>
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
            <Suspense fallback={<div style={{ height: "450px" }} />}>
              <Carousel 
                title="O Que Fazer"
                subtitle="Descubra as melhores atrações e passeios."
                items={shuffledOQueFazer}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('o-que-fazer')}
              />
            </Suspense>
          </DeferredSection>

          {/* Onde Ficar Section */}
          <DeferredSection height={450}>
            <Suspense fallback={<div style={{ height: "450px" }} />}>
              <Carousel 
                title="Onde Ficar"
                subtitle="Pousadas e hotéis para o seu descanso."
                items={shuffledOndeFicar}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('onde-ficar')}
              />
            </Suspense>
          </DeferredSection>

          {/* Gastronomia Section */}
          <DeferredSection height={450}>
            <Suspense fallback={<div style={{ height: "450px" }} />}>
              <Carousel 
                title="Gastronomia"
                subtitle="Os melhores sabores de Penedo."
                items={shuffledGastronomia}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('gastronomia')}
              />
            </Suspense>
          </DeferredSection>

          {/* Compras Section */}
          <DeferredSection height={450}>
            <Suspense fallback={<div style={{ height: "450px" }} />}>
              <Carousel 
                title="Compras & Lojas"
                subtitle="Artesanato e produtos exclusivos."
                items={shuffledCompras}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('compras')}
              />
            </Suspense>
          </DeferredSection>

          {/* Blog Section */}
          <DeferredSection height={450}>
            <Suspense fallback={<div style={{ height: "450px" }} />}>
              <Carousel 
                title="Blog & Dicas"
                subtitle="Fique por dentro das novidades e curiosidades."
                items={shuffledBlog}
                renderItem={(item) => (
                  <InfoCard 
                    item={item} 
                    onOpen={(item) => {
                      if (item.id === 'penedo-guia' || item.id === 'cachoeiras-penedo' || item.id === 'restaurantes' || item.id === 'melhores-hospedagens') {
                        onSelectArticle(item.id);
                        onNavigate('blog');
                      } else {
                        onNavigate('blog');
                      }
                    }} 
                  />
                )}
                onNavigate={() => onNavigate('blog')}
              />
            </Suspense>
          </DeferredSection>
        </>
      ) /* End of searchQuery conditional */}
    </div>
);
}
