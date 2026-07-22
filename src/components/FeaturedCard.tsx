import React from 'react';
import { motion } from 'motion/react';
import { Star, Phone, MessageCircle, Info, MapPin } from 'lucide-react';
import { DetailItem } from '../types';

export function FeaturedCard(props: { item: DetailItem, onClick: () => void }) {
  const { item, onClick } = props;
  
  // Grammatical gender logic
  const titleLower = item.title.toLowerCase();
  const isFeminine = titleLower.includes('pousada') || 
                     titleLower.includes('casa') || 
                     titleLower.includes('pizzaria') || 
                     titleLower.includes('choperia');
  const article = isFeminine ? 'a' : 'o';

  const whatsappMessage = encodeURIComponent(`Olá! Vi ${article} ${item.title} no portal VEM PRA PENEDO e gostaria de informações.`);
  const whatsappUrl = item.whatsapp 
    ? `https://wa.me/55${item.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}` 
    : `https://wa.me/5524992087767?text=${whatsappMessage}`;
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`group relative h-full flex flex-col bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
        item.isPremium 
          ? 'ring-4 ring-penedo-gold/20 shadow-2xl shadow-penedo-gold/5' 
          : 'shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-300/50'
      }`}
    >
      {(item.isPremium) && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-penedo-gold text-black font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            {item.badge || (item as any).badge || "Destaque"}
          </span>
        </div>
      )}

      <div 
        className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-gray-100"
        onClick={onClick}
      >
        {/* Blurred Background Layer for Contained Images */}
        {['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-girassol', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero'].includes(item.id) && (
          <div 
            className="absolute inset-0 z-0 opacity-40 scale-110 blur-xl font-sans"
            style={{ 
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        <img 
          src={item.image} 
          alt={item.title}
          loading="lazy"
          decoding="async"
          className={`relative z-10 w-full h-full transition-transform duration-1000 group-hover:scale-110 ${
            item.id === 'enoteca-serrana'
              ? 'object-cover object-[center_75%]'
              : item.id === 'hotel-girassol'
              ? 'object-contain object-center'
              : ['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero'].includes(item.id) 
                ? 'object-contain object-top' 
                : 'object-cover'
          }`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-500"></div>
        
        <div className="absolute bottom-5 left-6 right-6 z-30">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1 w-6 bg-penedo-gold rounded-full transition-all duration-500 group-hover:w-12"></div>
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.2em]">{item.category}</span>
          </div>
          <h3 className="text-white text-2xl font-black leading-none tracking-tighter mb-1">{item.title}</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {item.rating && (
              <div className="card-rating !text-white/80 !mb-0 !mt-0" onClick={(e) => e.stopPropagation()}>
                ⭐ {item.rating}
              </div>
            )}
            
            {item.tripadvisorUrl && (
              <div className="card-rating !text-white/80 !mb-0 !mt-0" onClick={(e) => e.stopPropagation()}>
                <a href={item.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="!text-penedo-gold hover:underline">
                  Tripadvisor
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-white/60 font-medium text-[10px]">
            <MapPin size={10} className="text-penedo-gold" />
            <span>{item.location?.split(',')[0] || 'Penedo, RJ'}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between bg-white cursor-pointer" onClick={onClick}>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-1 italic opacity-80">
          "{item.description}"
        </p>
        <div className="mt-2 flex items-center gap-2 text-penedo-emerald text-xs font-bold transition-opacity">
          <Info size={14} /> Mais Informações
        </div>
      </div>
    </motion.div>
  );
}
