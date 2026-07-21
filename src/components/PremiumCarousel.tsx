import React from 'react';
import { Star, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { DETAILS_DATA } from '../data/detailsData';
import { Carousel } from './Carousel';
import { PartnerHeader } from './PartnerHeader';
import { pushPremiumCardClick } from '../analytics/events';
import { shuffleArray } from '../utils/shuffle';
import { getBusinessPath } from '../routing/routeHelpers';
import { Link } from 'react-router-dom';

export function PremiumCarousel() {
  const premiumItems = React.useMemo(() => {
    const detailsPremium = Object.values(DETAILS_DATA).flat()
      .filter((item) => item.isPremium);
    
    // De-duplicate by id or slug
    const uniquePremiumMap = new Map();
    detailsPremium.forEach((item) => {
      const key = item.title;
      if (!uniquePremiumMap.has(key)) {
        uniquePremiumMap.set(key, item);
      }
    });
    
    const uniquePremium = Array.from(uniquePremiumMap.values());
      
    // Stable shuffle keeps the visual variety without changing between SSG and hydration.
    return shuffleArray(uniquePremium).slice(0, 12);
  }, []);

  if (premiumItems.length === 0) return null;

  return (
    <section className="py-10 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-penedo-mint/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-penedo-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto mb-4 md:mb-8 md:mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-penedo-graphite tracking-tighter leading-tight mb-6">
            ⭐ Destaques <span className="text-penedo-emerald">Premium</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
            Conheça as experiências mais exclusivas e recomendadas de Penedo selecionadas para você.
          </p>
        </div>

        <Carousel 
          title=""
          items={premiumItems as any}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          renderItem={(item, index) => (
            <Link
              to={getBusinessPath((item as any).slug || item.id)}
              onClick={() => {
                pushPremiumCardClick({
                  business_id: item.id,
                  business_name: item.title,
                  business_category: item.category
                }, index + 1);
              }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full group cursor-pointer block transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {['Hotel Girassol', 'Águia de Penedo', 'Rota dos Passeios', 'Trilhando Penedo Ecoturismo'].includes(item.title) && (
                  <div 
                    className="absolute inset-0 z-0 opacity-40 scale-110 blur-xl"
                    style={{ 
                      backgroundImage: `url(${(item as any).galeria?.[0] || item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}
                <img 
                  src={(item as any).galeria?.[0] || item.image} 
                  alt={item.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  width={400}
                  height={300}
                  className={`relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                    ['Hotel Girassol', 'Águia de Penedo', 'Rota dos Passeios', 'Trilhando Penedo Ecoturismo'].includes(item.title)
                      ? 'object-contain object-center'
                      : 'object-cover'
                  }`}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-penedo-gold text-black font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg">
                    {item.badge || (item as any).badge || "Destaque"}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-6 bg-penedo-gold rounded-full"></div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{(item as any).badge || item.category}</span>
                  </div>
                  <div className="mb-4">
                    <PartnerHeader item={item} size="small" />
                  </div>
                </div>
                <div 
                  className="w-full py-3.5 bg-penedo-forest text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-penedo-emerald transition-all shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  SAIBA MAIS <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          )}
        />
      </div>
    </section>
  );
}
