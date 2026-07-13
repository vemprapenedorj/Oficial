import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Phone, Mail, MapPin, Clock, Globe, Star, Compass, 
  DollarSign, CheckCircle, MessageCircle, X, ChevronLeft, ChevronRight,
  Calendar, Instagram, ShieldCheck
} from 'lucide-react';
import { Page, DetailItem } from '../types';
import { DETAILS_DATA } from '../data/detailsData';
import locaisData from '../locais.json';
import { pushBusinessPageView, pushWhatsappClick, pushInstagramClick } from '../analytics/events';
import { trackEvent } from '../analytics/tracking';
import { generateSEO } from '../seo';
import SEO from '../components/SEO';
import { PartnerHeader } from '../components/PartnerHeader';
import { getSubcategoryInfo } from '../seo/utils/seoUtils';

// Helper to extract video embed details
function getVideoEmbedData(url: string): { url: string; platform: 'youtube' | 'instagram' | 'unknown' } {
  const cleanUrl = url.trim();
  if (cleanUrl.includes('instagram.com/p/') || cleanUrl.includes('instagram.com/reel/')) {
    const cleanInsta = cleanUrl.split('?')[0].replace(/\/?$/, '');
    return { url: `${cleanInsta}/embed`, platform: 'instagram' };
  }
  let videoId = '';
  if (cleanUrl.includes('youtube.com/watch')) {
    const urlObj = new URL(cleanUrl);
    videoId = urlObj.searchParams.get('v') || '';
  } else if (cleanUrl.includes('youtu.be/')) {
    videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (cleanUrl.includes('youtube.com/embed/')) {
    videoId = cleanUrl.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  if (videoId) {
    return { url: `https://www.youtube.com/embed/${videoId}`, platform: 'youtube' };
  }
  return { url: cleanUrl, platform: 'unknown' };
}

export function PremiumDetailPage({ slug, onNavigate, onOpenDetail }: { slug: string, onNavigate: (page: Page, slug?: string) => void, onOpenDetail?: (item: DetailItem) => void }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  const item = React.useMemo(() => {
    const allItems = [...Object.values(locaisData).flat(), ...Object.values(DETAILS_DATA).flat()];
    return allItems.find((i: any) => (i.slug === slug || i.id === slug) && (i.is_premium || i.isPremium)) as any;
  }, [slug]);

  useEffect(() => {
    if (item) {
      pushBusinessPageView({
        business_id: item.id,
        business_name: item.title,
        business_category: item.category,
        is_premium: !!(item.isPremium || item.is_premium)
      });
    }
  }, [item]);

  const galleryImages = React.useMemo(() => {
    if (!item) return [];
    
    const isPremium = item.isPremium || item.is_premium;
    if (isPremium) {
      const folder = item.slug || item.id;
      let cleanFolder = folder.split('/').pop() || folder;
      if (cleanFolder === 'pousada-aurora-mantiqueira') {
        cleanFolder = 'pousada-aurora-da-mantiqueira';
      } else if (cleanFolder === 'pousada-rainha-mata') {
        cleanFolder = 'pousada-rainha-da-mata';
      } else if (cleanFolder === 'rodrigo-dione') {
        cleanFolder = 'rodrigo-massoterapeuta';
      }
      const prefix = `/assets/imagens/premium/${cleanFolder}/`;
      
      let rawImages = item.galeria || [];
      
      // Filter out any logos or cover images from the gallery
      let cleanImages = rawImages.filter((img: string) => {
        const filename = img.split('/').pop() || '';
        return !filename.toLowerCase().includes('logo') && 
               !filename.toLowerCase().includes('aurora-da-mantiqueira.jpg') && 
               !filename.toLowerCase().includes('rainha-da-mata.jpg') && 
               !filename.toLowerCase().includes('raizes-da-mantiqueira.png');
      });

      // Map paths to premium folder if they are not already, or standardize them
      cleanImages = cleanImages.map((img: string) => {
        const filename = img.split('/').pop() || '';
        if (filename.startsWith('galeria-') || filename.startsWith('expedicao-raizes-') || filename.startsWith('casa-da-picanha-')) {
          let standardName = filename;
          if (filename.includes('jeep')) standardName = 'galeria-1.jpg';
          if (filename.includes('trail')) standardName = 'galeria-2.jpg';
          if (filename.includes('waterfall')) standardName = 'galeria-3.jpg';
          return `${prefix}${standardName}`;
        }
        if (!img.startsWith('http') && img.includes('/')) {
          return `${prefix}${filename}`;
        }
        return img;
      });

      // If no gallery images found, generate default galeria-1 to galeria-6
      if (cleanImages.length === 0) {
        for (let i = 1; i <= 6; i++) {
          cleanImages.push(`${prefix}galeria-${i}.jpg`);
        }
      }

      // Limit to max 6 gallery images
      return cleanImages.slice(0, 6);
    }
    
    return item.galeria?.slice(1, 7) || [];
  }, [item]);

  useEffect(() => {
    if (!item) {
      onNavigate('home');
    }
  }, [item, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImgIndex === null) return;
      if (e.key === 'ArrowLeft') {
        setSelectedImgIndex(prev => prev !== null ? (prev === 0 ? galleryImages.length - 1 : prev - 1) : null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIndex(prev => prev !== null ? (prev === galleryImages.length - 1 ? 0 : prev + 1) : null);
      } else if (e.key === 'Escape') {
        setSelectedImgIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImgIndex, galleryImages.length]);

  if (!item) return null;

  const getWhatsAppMessage = () => {
    const isLodging = item.category === 'Hospedagem';
    const foodCategories = ['Gastronomia', 'Italiana', 'Pizzaria', 'Contemporânea', 'Churrasco', 'Carnes', 'Alemã', 'Peixes', 'Experiência', 'Choperia'];
    const isFood = foodCategories.includes(item.category);
    
    // Grammatical gender logic
    const titleLower = item.title.toLowerCase();
    const isFeminine = titleLower.includes('pousada') || 
                       titleLower.includes('casa') || 
                       titleLower.includes('pizzaria') || 
                       titleLower.includes('choperia') ||
                       titleLower.includes('cachoeira') ||
                       titleLower.includes('pequena finlândia');
    
    const article = isFeminine ? 'a' : 'o';
    const contraction = isFeminine ? 'na' : 'no';
    
    if (isLodging) {
      return `Olá, vim do portal VEM PRA PENEDO e gostaria de informações sobre reservas ${contraction} ${item.title}`;
    }
    if (isFood) {
      return `Olá! Vi ${article} ${item.title} no VEM PRA PENEDO e gostaria de ver o cardápio.`;
    }
    return `Olá! Vi ${article} ${item.title} no VEM PRA PENEDO e gostaria de mais informações.`;
  };

  const whatsappMessage = encodeURIComponent(getWhatsAppMessage());
  const whatsappUrl = item.link_whatsapp
    ? `${item.link_whatsapp}?text=${whatsappMessage}`
    : item.whatsapp
      ? `https://wa.me/55${item.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`
      : `https://wa.me/5524992087767?text=${whatsappMessage}`;

  const instagramUrl = item.link_instagram || item.instagram || "https://www.instagram.com/vemprapenedo/";
  const mapsUrl = (item.latitude && item.longitude)
    ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
    : (item.link_maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ', Penedo, Itatiaia - RJ')}`);

  const ActionButtons = ({ sticky = false }: { sticky?: boolean }) => {
    const isPremium = item.isPremium || (item as any).is_premium;
    const isHospedagem = item.category === 'Hospedagem';
    const fallbackBookingUrl = 'https://www.booking.com/searchresults.pt-br.html?label=pt-br-booking-desktop-9_uvqir24qvA6x6xGiDvCQS652796015463%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp1031722%3Ali%3Adec%3Adm&gclid=Cj0KCQjwxvjRBhC2ARIsAI7KJa1ZHtRerJPfgkFeXecwrxjO7CkOzHPB6Gy0PC6H1ul-Q0ltXy90nk0aAiq6EALw_wcB&aid=2311236&dest_id=900048364&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&order=class';
    const bookingUrl = item.link_booking || fallbackBookingUrl;

    // Se for hospedagem e não for premium, exibe 2 colunas (Booking + Maps)
    // Caso contrário (Premium ou não-Hospedagem), exibe 3 colunas (WhatsApp + Insta + Maps)
    const gridCols = (!isPremium && isHospedagem) 
      ? 'md:grid-cols-2' 
      : 'md:grid-cols-3';

    return (
      <div className={`grid grid-cols-1 ${gridCols} gap-3 ${sticky ? 'fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md z-[100] md:hidden border-t shadow-[0_-10px_20px_rgba(0,0,0,0.1)]' : 'mt-8'}`}>
        
        {isPremium || !isHospedagem ? (
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => pushWhatsappClick({
              business_id: item.id,
              business_name: item.title,
              business_category: item.category,
              is_premium: !!(item.isPremium || item.is_premium)
            })}
            className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] transition-all text-sm shadow-md"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        ) : (
          <a 
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('booking_lead', item.category, item.title)}
            className="flex items-center justify-center gap-2 py-3 bg-[#003580] text-white font-bold rounded-xl hover:bg-[#002252] shadow-lg shadow-blue-900/20 transition-all text-sm shadow-md"
          >
            <Calendar size={18} /> Reservar na Booking
          </a>
        )}

        {!sticky && (
          <>
            {(isPremium || !isHospedagem) && (
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => pushInstagramClick({
                  business_id: item.id,
                  business_name: item.title,
                  business_category: item.category,
                  is_premium: !!(item.isPremium || item.is_premium)
                })}
                className="flex items-center justify-center gap-2 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-md"
                style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
              >
                <Instagram size={18} /> Instagram
              </a>
            )}
            
            {item.googleProfileUrl && (
              <a 
                href={item.googleProfileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackEvent('google_profile', item.category, item.title)}
                className="flex items-center justify-center gap-2 py-3 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm shadow-md"
              >
                <Star size={18} className="text-penedo-gold fill-penedo-gold" /> Avaliações no Google
              </a>
            )}

            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('map_location', item.category, item.title)}
              className="flex items-center justify-center gap-2 py-3 bg-penedo-forest text-white font-bold rounded-xl hover:bg-black transition-all text-sm shadow-md"
            >
              <Compass size={18} /> Ver no Google Maps
            </a>
          </>
        )}
      </div>
    );
  };
  const recommendations = React.useMemo(() => {
    if (!item) return null;
    const catLower = (item.category || '').toLowerCase();
    const currentLoc = (item.location || '').toLowerCase();
    
    // Zone indicators
    const isAlto = currentLoc.includes('alto');
    const isCentro = currentLoc.includes('mangueiras') || currentLoc.includes('centro') || currentLoc.includes('finlândia') || currentLoc.includes('duendes') || currentLoc.includes('vale dos duendes');
    const isCachoeiras = currentLoc.includes('cachoeira') || currentLoc.includes('deus') || currentLoc.includes('esmeraldas');
    
    const getZoneScore = (candidateLoc: string) => {
      const cl = candidateLoc.toLowerCase();
      if (cl === currentLoc) return 20;
      if (isAlto && cl.includes('alto')) return 10;
      if (isCentro && (cl.includes('centro') || cl.includes('mangueiras') || cl.includes('finlândia') || cl.includes('duendes'))) return 10;
      if (isCachoeiras && cl.includes('cachoeira')) return 10;
      return 0;
    };
    
    const getSharedTagsCount = (candTags: string[]) => {
      if (!candTags || !item.tags) return 0;
      return candTags.filter(t => item.tags!.some(it => it.toLowerCase() === t.toLowerCase())).length;
    };
    
    let nearPlacesCat: 'gastronomia' | 'onde-ficar' | 'o-que-fazer' = 'gastronomia';
    let secondaryCat: 'onde-ficar' | 'o-que-fazer' | 'gastronomia' = 'o-que-fazer';
    
    if (catLower === 'hospedagem' || catLower === 'onde-ficar') {
      nearPlacesCat = 'gastronomia';
      secondaryCat = 'o-que-fazer';
    } else if (catLower === 'gastronomia' || catLower === 'restaurantes') {
      nearPlacesCat = 'onde-ficar';
      secondaryCat = 'o-que-fazer';
    } else {
      nearPlacesCat = 'onde-ficar';
      secondaryCat = 'gastronomia';
    }
    
    const scoreCandidates = (cat: 'gastronomia' | 'onde-ficar' | 'o-que-fazer' | 'compras') => {
      return (DETAILS_DATA[cat] || [])
        .filter(c => c.id !== item.id && (c as any).status !== 'draft')
        .map(c => {
          let score = getZoneScore(c.location || '');
          score += getSharedTagsCount(c.tags || []) * 2;
          score += (c.isPremium || (c as any).is_premium) ? 5 : 0;
          return { item: c, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(x => x.item);
    };
    
    const recommendedNearPlaces = scoreCandidates(nearPlacesCat).slice(0, 3);
    const recommendedSecondary = scoreCandidates(secondaryCat).slice(0, 2);
    
    let recommendedBlog = {
      id: 'penedo-guia',
      title: 'Penedo RJ: Guia Completo de Viagem',
      description: 'Descubra como aproveitar o melhor de Penedo, a colônia finlandesa no Rio de Janeiro.'
    };
    if (catLower === 'hospedagem' || catLower === 'onde-ficar') {
      recommendedBlog = {
        id: 'melhores-hospedagens',
        title: 'As Melhores Hospedagens em Penedo RJ',
        description: 'Encontre pousadas charmosas, chalés privativos e hotéis incríveis para sua viagem.'
      };
    } else if (catLower === 'gastronomia' || catLower === 'restaurantes') {
      recommendedBlog = {
        id: 'restaurantes',
        title: 'Onde Comer em Penedo: Experiências Gastronômicas',
        description: 'Um roteiro pelos melhores restaurantes de truta, fondue e chocolates finos.'
      };
    } else if (catLower === 'o-que-fazer' || catLower === 'compras') {
      recommendedBlog = {
        id: 'cachoeiras-penedo',
        title: 'Guia de Cachoeiras e Trilhas em Penedo',
        description: 'Dicas práticas para visitar as cachoeiras públicas e trilhas de aventura mais bonitas.'
      };
    }
    
    return {
      nearPlaces: recommendedNearPlaces,
      secondary: recommendedSecondary,
      blog: recommendedBlog,
      nearPlacesTitle: nearPlacesCat === 'gastronomia' ? 'Restaurantes Próximos' : 'Hospedagens Próximas',
      secondaryTitle: secondaryCat === 'o-que-fazer' ? 'Atrações Recomendadas' : 'Gastronomia Recomendada'
    };
  }, [item]);

  const seoData = generateSEO('business', item);
  if (galleryImages.length > 0) {
    const businessSchema = (seoData.schema as any[]).find((s: any) => s["@type"] === 'Restaurant' || s["@type"] === 'Hotel' || s["@type"] === 'TouristAttraction' || s["@type"] === 'LocalBusiness') as any;
    if (businessSchema) {
      businessSchema.image = galleryImages.map((img: string) => img.startsWith('http') ? img : `https://vemprapenedo.com.br${img}`);
    }
  }

  const itemCategory = item.category?.toLowerCase() || '';
  const categoryCleanPath = (itemCategory === 'hospedagem' || itemCategory === 'onde-ficar')
    ? 'onde-ficar'
    : (itemCategory === 'gastronomia' || itemCategory === 'carnes' || itemCategory === 'restaurantes')
      ? 'gastronomia'
      : (itemCategory === 'compras' || itemCategory === 'lojas')
        ? 'compras'
        : 'o-que-fazer';

  const categoryLabel = (itemCategory === 'hospedagem' || itemCategory === 'onde-ficar')
    ? 'Onde Ficar'
    : (itemCategory === 'gastronomia' || itemCategory === 'carnes' || itemCategory === 'restaurantes')
      ? 'Gastronomia'
      : (itemCategory === 'compras' || itemCategory === 'lojas')
        ? 'Compras'
        : 'O Que Fazer';

  const { subName, subSlug } = getSubcategoryInfo(item);

  return (
    <div
      className="bg-white min-h-screen pb-40 md:pb-20 relative"
    >
      <SEO {...seoData} />
      {/* Header / Gallery */}
      <section className="pt-10 md:pt-20 md:pt-32 pb-6 md:pb-12 bg-penedo-mint/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8 text-left">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all bg-transparent border-none outline-none cursor-pointer"
            >
              <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
            </button>
            
            <nav className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center flex-wrap gap-y-1" aria-label="Breadcrumb">
              <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-penedo-emerald transition-colors">Início</a>
              <span className="mx-2 text-gray-400">/</span>
              <a 
                href={`/${categoryCleanPath}`} 
                onClick={(e) => { e.preventDefault(); onNavigate(categoryCleanPath as Page); }}
                className="hover:text-penedo-emerald transition-colors"
              >
                {categoryLabel}
              </a>
              <span className="mx-2 text-gray-400">/</span>
              <a 
                href={`/${categoryCleanPath}#${subSlug}`} 
                onClick={(e) => { e.preventDefault(); onNavigate(categoryCleanPath as Page); }}
                className="hover:text-penedo-emerald transition-colors"
              >
                {subName}
              </a>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-penedo-forest line-clamp-1">{item.title}</span>
            </nav>
          </div>
          
          <div className="mb-6 md:mb-8">
            <PartnerHeader item={item} size="large" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4 md:mb-8">
            {galleryImages.map((img: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedImgIndex(idx)}
                className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white cursor-pointer group/img"
              >
                  <img 
                    src={img} 
                    alt={`Imagem ${idx + 1} de ${item.category || 'Estabelecimento'} ${item.title} em Penedo RJ`} 
                    loading={idx === 0 ? "eager" : "lazy"} 
                    fetchPriority={idx === 0 ? "high" : undefined}
                    decoding="async"
                    width={360}
                    height={270}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 group-hover/img:rotate-1"
                    referrerPolicy="no-referrer"
                  />
              </motion.div>
            ))}
          </div>

          <ActionButtons />
        </div>
      </section>

      {/* Image Modal Carousel */}
      <AnimatePresence>
        {selectedImgIndex !== null && galleryImages[selectedImgIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
            onClick={() => setSelectedImgIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImgIndex(null)}
                className="absolute -top-12 right-0 md:-right-10 text-white hover:text-penedo-gold transition-colors z-50 p-2 bg-black/50 rounded-full cursor-pointer flex items-center justify-center"
              >
                <X size={32} />
              </button>

              {/* Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImgIndex(prev => prev !== null ? (prev === 0 ? galleryImages.length - 1 : prev - 1) : null);
                }}
                className="absolute left-4 md:-left-16 text-white hover:text-penedo-gold transition-all z-50 p-3 bg-black/40 hover:bg-black/70 rounded-full cursor-pointer hover:scale-110 flex items-center justify-center"
              >
                <ChevronLeft size={36} />
              </button>

              {/* Image Container with Animation */}
              <motion.div
                key={selectedImgIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex items-center justify-center"
              >
                <img 
                  src={galleryImages[selectedImgIndex]} 
                  alt={`${item.title} ampliada ${selectedImgIndex + 1}`} 
                  decoding="async"
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border-4 border-white/10"
                />
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImgIndex(prev => prev !== null ? (prev === galleryImages.length - 1 ? 0 : prev + 1) : null);
                }}
                className="absolute right-4 md:-right-16 text-white hover:text-penedo-gold transition-all z-50 p-3 bg-black/40 hover:bg-black/70 rounded-full cursor-pointer hover:scale-110 flex items-center justify-center"
              >
                <ChevronRight size={36} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description */}
      <section className="pt-10 md:pt-20 pb-6 md:pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4 md:mb-8">
            <div className="w-12 h-12 rounded-2xl bg-penedo-gold text-penedo-forest flex items-center justify-center shadow-lg">
              <Star size={24} />
            </div>
            <h2 className="text-3xl font-black text-penedo-forest tracking-tight">Experiência Penedo</h2>
          </div>
          
          <div className="prose prose-xl prose-penedo max-w-none text-gray-600 leading-relaxed space-y-6">
            {item.link_video ? (
              (() => {
                const videoData = getVideoEmbedData(item.link_video);
                const isInstagram = videoData.platform === 'instagram';
                return (
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-6 md:mb-12">
                    <div className="flex-1 w-full text-left">
                      <div className="bg-penedo-mint/5 p-8 md:p-12 rounded-[2.5rem] border-l-8 border-penedo-gold shadow-sm">
                        <p className="text-xl md:text-2xl font-bold text-penedo-forest leading-relaxed italic">
                          "{item.descricao_longa || item.description}"
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full md:max-w-[340px] shrink-0 mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                      {/* Custom Instagram Header */}
                      <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full border border-penedo-gold bg-white overflow-hidden flex items-center justify-center p-1">
                            <img 
                              src={item.galeria?.[0]} 
                              alt={item.title} 
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-800 text-xs leading-none">{item.title}</p>
                            <p className="text-[10px] text-gray-400">Curadoria Premium</p>
                          </div>
                        </div>
                        <a 
                          href={instagramUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full font-black text-[9px] uppercase tracking-wider transition-all"
                        >
                          Instagram
                        </a>
                      </div>

                      {/* Video Content */}
                      <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex items-center justify-center">
                        {isInstagram ? (
                          <iframe
                            src={`${videoData.url}?muted=1`}
                            title={`Vídeo - ${item.title}`}
                            loading="lazy"
                            className="absolute w-full h-[calc(100%+140px)] -top-[50px] left-0 border-none scale-[1.01]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <iframe
                            src={videoData.url}
                            title={`Vídeo - ${item.title}`}
                            loading="lazy"
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-penedo-mint/5 p-8 md:p-12 rounded-[2.5rem] border-l-8 border-penedo-gold mb-6 md:mb-12 shadow-sm text-left">
                <p className="text-xl md:text-2xl font-bold text-penedo-forest leading-relaxed italic">
                  "{item.descricao_longa || item.description}"
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-12">
              <div>
                <h3 className="text-2xl font-black text-penedo-forest mb-4 flex items-center gap-2 italic">
                  <span className="text-penedo-gold">/</span> Sobre o local
                </h3>
                <p className="text-lg">
                  {item.fullInfo}
                </p>
              </div>
              
              <div className="space-y-6">
                {item.hours && (
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-penedo-forest mb-3 flex items-center gap-2">
                      <Clock size={18} className="text-penedo-emerald" /> Horário
                    </h4>
                    <p className="text-gray-500 text-sm leading-snug">{item.hours}</p>
                  </div>
                )}
                
                <div className="p-6 bg-penedo-forest rounded-3xl text-white shadow-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-penedo-gold" /> Curadoria Premium
                  </h4>
                  <p className="text-xs opacity-80">Este estabelecimento faz parte da nossa curadoria Premium, garantindo excelência em atendimento e qualidade.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {item.latitude && item.longitude && (
        <section className="py-10 md:py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-penedo-emerald text-white flex items-center justify-center shadow-md">
                <MapPin size={20} />
              </div>
              <h3 className="text-2xl font-bold text-penedo-forest">Localização</h3>
            </div>
            
            <div className="relative w-full h-[350px] bg-gray-50 rounded-[1.8rem] overflow-hidden border border-gray-200 flex flex-col items-center justify-center p-6 text-center shadow-inner">
              {showMap ? (
                <>
                  <iframe
                    src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=16&output=embed`}
                    title={`Mapa - ${item.title}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                  <div className="absolute bottom-4 right-4 z-10">
                    <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white text-penedo-forest hover:bg-gray-100 font-bold rounded-xl shadow-lg border border-gray-100 text-xs transition-all"
                    >
                      <Compass size={14} /> Abrir no Google Maps
                    </a>
                  </div>
                </>
              ) : (
                <div className="z-10 flex flex-col items-center gap-3">
                  <p className="text-gray-600 font-medium text-sm">O mapa interativo está oculto para preservar a performance.</p>
                  <button 
                    onClick={() => setShowMap(true)}
                    className="px-6 py-3 bg-penedo-emerald hover:bg-penedo-forest text-white font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 text-sm cursor-pointer"
                  >
                    Mostrar mapa
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Section (Internal Link Mesh) */}
      {recommendations && (
        <section className="py-12 md:py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-10 text-left">
              <div className="w-12 h-12 rounded-2xl bg-penedo-gold text-penedo-forest flex items-center justify-center shadow-lg shrink-0">
                <Compass size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-penedo-forest tracking-tight">Descubra Mais em Penedo</h2>
                <p className="text-gray-500 text-sm">Estabelecimentos próximos e dicas recomendadas para seu roteiro</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Near Places */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-penedo-forest border-b pb-2 border-gray-200">
                  {recommendations.nearPlacesTitle}
                </h3>
                <div className="space-y-4">
                  {recommendations.nearPlaces.map(place => (
                    <div 
                      key={place.id}
                      onClick={() => {
                        const isPrem = place.isPremium || (place as any).is_premium;
                        if (isPrem) {
                          onNavigate('premium-detail', place.slug || place.id);
                        } else if (onOpenDetail) {
                          onOpenDetail(place);
                        }
                      }}
                      className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={place.image} 
                          alt={`${place.category} ${place.title} em Penedo RJ`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          loading="lazy"
                          decoding="async"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-penedo-emerald transition-colors">{place.title}</h4>
                        <p className="text-xs text-gray-400 mb-1">{place.location}</p>
                        <span className="text-[10px] font-bold text-penedo-gold">Ver mais</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Places */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-penedo-forest border-b pb-2 border-gray-200">
                  {recommendations.secondaryTitle}
                </h3>
                <div className="space-y-4">
                  {recommendations.secondary.map(place => (
                    <div 
                      key={place.id}
                      onClick={() => {
                        const isPrem = place.isPremium || (place as any).is_premium;
                        if (isPrem) {
                          onNavigate('premium-detail', place.slug || place.id);
                        } else if (onOpenDetail) {
                          onOpenDetail(place);
                        }
                      }}
                      className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={place.image} 
                          alt={`${place.category} ${place.title} em Penedo RJ`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          loading="lazy"
                          decoding="async"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-800 line-clamp-1 group-hover:text-penedo-emerald transition-colors">{place.title}</h4>
                        <p className="text-xs text-gray-400 mb-1">{place.location}</p>
                        <span className="text-[10px] font-bold text-penedo-gold">Ver mais</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blog & Category Links */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-penedo-forest border-b pb-2 border-gray-200">Dicas do Especialista</h3>
                
                {/* Blog Card */}
                <div 
                  onClick={() => onNavigate('blog', recommendations.blog.id)}
                  className="p-6 bg-penedo-forest text-white rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider mb-4 border border-white/10">Artigo do Blog</span>
                    <h4 className="text-xl font-black mb-2 group-hover:text-penedo-gold transition-colors leading-tight">{recommendations.blog.title}</h4>
                    <p className="text-xs opacity-75 mb-4 leading-relaxed">{recommendations.blog.description}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-penedo-gold uppercase tracking-wider group-hover:gap-3 transition-all">
                      Ler artigo completo <ArrowRight size={16} className="shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Category Link */}
                <div 
                  onClick={() => onNavigate(categoryCleanPath as Page)}
                  className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer text-center group"
                >
                  <h4 className="font-bold text-gray-800 mb-1">Quer ver a lista completa?</h4>
                  <p className="text-xs text-gray-400 mb-4">Veja todas as opções da categoria {item.category} em Penedo.</p>
                  <span className="inline-block px-6 py-2.5 bg-gray-50 group-hover:bg-penedo-emerald group-hover:text-white rounded-2xl font-bold text-xs text-penedo-emerald uppercase tracking-widest transition-all">
                    Ver {item.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile Buttons */}
      <ActionButtons sticky />
    </div>
  );
}

