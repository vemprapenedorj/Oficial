import { EVENTS } from '../events/catalog';
import { EventCard } from '../events/EventCard';
import { EventsHighlight } from '../events/EventsHighlight';
import { searchEvents } from '../events/eventUtils';
import { useEventToday } from '../events/useEventToday';
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Page, DetailItem } from '../types';
import { shuffleArray } from '../utils/shuffle';
import { DETAILS_DATA } from '../data/detailsData';
import { PremiumCarousel } from '../components/PremiumCarousel';
import { SearchPromo } from '../components/SearchPromo';
import { pushSearch } from '../analytics/events';
import { DeferredSection } from '../components/performance/DeferredSection';
import { Carousel } from '../components/Carousel';
import { InfoCard } from '../components/InfoCard';
import { Link } from 'react-router-dom';
import { normalizeSearchText, searchIncludes } from '../utils/search';
import { SectionDividerLeaf } from '../components/SectionDividerLeaf';

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
  const today = useEventToday();
  const eventResults = searchEvents(EVENTS, searchQuery);

  // Randomized data for each section
  const shuffledOQueFazer = React.useMemo(() => shuffleArray(DETAILS_DATA['o-que-fazer']), []);
  const shuffledOndeFicar = React.useMemo(() => shuffleArray(DETAILS_DATA['onde-ficar']), []);
  const shuffledGastronomia = React.useMemo(() => shuffleArray(DETAILS_DATA['gastronomia']), []);
  const shuffledCompras = React.useMemo(() => shuffleArray(DETAILS_DATA['compras']), []);
  const shuffledBlog = React.useMemo(() => shuffleArray(DETAILS_DATA['blog']), []);

  const allItems = Object.values(DETAILS_DATA).flat();
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : allItems.filter(item => 
        searchIncludes(item.title, normalizedSearchQuery) ||
        searchIncludes(item.description, normalizedSearchQuery) ||
        searchIncludes(item.category, normalizedSearchQuery) ||
        searchIncludes(item.fullInfo, normalizedSearchQuery) ||
        item.tags?.some(tag => searchIncludes(tag, normalizedSearchQuery))
      );

  const resultCount = filteredResults.length + eventResults.length;
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, resultCount);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, resultCount]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#102633] lg:flex lg:h-[clamp(600px,76svh,760px)] lg:items-center">
        <picture className="block w-full lg:absolute lg:inset-0 lg:h-full">
          <source srcSet="/assets/imagens/hero-entrada-penedo.avif" type="image/avif" />
          <source srcSet="/assets/imagens/hero-entrada-penedo.webp" type="image/webp" />
          <img
            src="/assets/imagens/hero-entrada-penedo.jpg"
            width="1672"
            height="941"
            className="block h-auto w-full lg:h-full lg:object-cover"
            alt="Letreiro Eu amo Penedo diante das montanhas ao pôr do sol"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#081920]/80 via-[#081920]/40 to-transparent lg:block" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:px-6 md:py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
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
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/gastronomia/"
              className="px-8 py-4 bg-penedo-emerald hover:bg-penedo-forest text-white rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explorar Agora <ArrowRight size={20} />
            </Link>
            <Link
              to="/compras/"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Onde Comprar
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Premium Carousel Section */}
      <div className="section-with-leaf">
        <SectionDividerLeaf position="top-right" color="#174C35" opacity={0.8} size={150} variant="slow" />
        <DeferredSection height={760}>
          <PremiumCarousel />
        </DeferredSection>
      </div>

      <EventsHighlight />

      {/* Search Promo */}
      <SearchPromo query={searchQuery} onSearch={setSearchQuery} />

      {searchQuery.trim() !== '' ? (
        <section className="py-10 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-penedo-forest mb-4 md:mb-8">Resultados da Busca para "{searchQuery}"</h2>
            {filteredResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResults.map((item) => (
                  <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
                ))}
              </div>
            )}
            {eventResults.length > 0 && <div className="mt-10"><h3 className="text-2xl font-bold text-penedo-forest mb-6">Eventos</h3><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{eventResults.map(event => <EventCard key={event.id} event={event} today={today} />)}</div></div>}
            {resultCount === 0 && (
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
          <div className="section-with-leaf bg-white">
            <SectionDividerLeaf position="left" color="#2E6B34" opacity={0.8} size={140} />
            <DeferredSection height={520}>
              <Carousel 
                title="O Que Fazer"
                subtitle="Descubra as melhores atrações e passeios."
                items={shuffledOQueFazer}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('o-que-fazer')}
                navigateHref="/o-que-fazer/"
              />
            </DeferredSection>
          </div>

          {/* Onde Ficar Section */}
          <div className="section-with-leaf bg-nature-soft">
            <SectionDividerLeaf position="right" color="#6F9568" opacity={0.75} size={140} variant="subtle" />
            <DeferredSection height={520}>
              <Carousel 
                title="Onde Ficar"
                subtitle="Pousadas e hotéis para o seu descanso."
                items={shuffledOndeFicar}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('onde-ficar')}
                navigateHref="/onde-ficar/"
              />
            </DeferredSection>
          </div>

          {/* Gastronomia Section */}
          <div className="section-with-leaf bg-white">
            <SectionDividerLeaf position="left" color="#174C35" opacity={0.8} size={135} variant="slow" />
            <DeferredSection height={520}>
              <Carousel 
                title="Gastronomia"
                subtitle="Os melhores sabores de Penedo."
                items={shuffledGastronomia}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('gastronomia')}
                navigateHref="/gastronomia/"
              />
            </DeferredSection>
          </div>

          {/* Compras Section */}
          <div className="section-with-leaf bg-nature-cream">
            <SectionDividerLeaf position="bottom-right" color="#6F9568" opacity={0.75} size={145} />
            <DeferredSection height={520}>
              <Carousel 
                title="Compras & Lojas"
                subtitle="Artesanato e produtos exclusivos."
                items={shuffledCompras}
                renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
                onNavigate={() => onNavigate('compras')}
                navigateHref="/compras/"
              />
            </DeferredSection>
          </div>

          {/* Blog Section */}
          <div className="section-with-leaf bg-white">
            <SectionDividerLeaf position="left" color="#2E6B34" opacity={0.7} size={135} variant="subtle" />
            <DeferredSection height={520}>
              <Carousel 
                title="Blog & Dicas"
                subtitle="Fique por dentro das novidades e curiosidades."
                items={shuffledBlog}
                renderItem={(item) => (
                  <InfoCard 
                    item={item} 
                    onOpen={(item) => {
                      if (item.id === 'melhores-pizzarias-de-penedo' || item.id === 'roteiro-1-dia-em-penedo' || item.id === 'penedo-guia' || item.id === 'cachoeiras-penedo' || item.id === 'restaurantes' || item.id === 'melhores-hospedagens') {
                        onSelectArticle(item.id);
                      } else {
                        onNavigate('blog');
                      }
                    }} 
                  />
                )}
                onNavigate={() => onNavigate('blog')}
                navigateHref="/blog/"
              />
            </DeferredSection>
          </div>
        </>
      ) /* End of searchQuery conditional */}
    </div>
);
}
