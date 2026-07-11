import React from 'react';
import { Info, MapPin } from 'lucide-react';
import { DetailItem } from '../types';

interface InfoCardProps {
  item: DetailItem;
  onOpen: (item: DetailItem) => void;
  key?: string;
}

export const InfoCard = React.memo(function InfoCard({ item, onOpen }: InfoCardProps) {
  const isPremium = React.useMemo(() => {
    return item.isPremium || (item as any).is_premium;
  }, [item]);

  const cardImage = React.useMemo(() => {
    if (isPremium) {
      const folder = item.slug || item.id;
      let cleanFolder = folder.split('/').pop() || folder;
      if (cleanFolder === 'pousada-aurora-mantiqueira') {
        cleanFolder = 'pousada-aurora-da-mantiqueira';
      } else if (cleanFolder === 'pousada-rainha-mata') {
        cleanFolder = 'pousada-rainha-da-mata';
      }
      return `/assets/imagens/premium/${cleanFolder}/galeria-1.jpg`;
    }
    return item.image;
  }, [item, isPremium]);

  const imgClass = React.useMemo(() => {
    let classes = "relative z-10 w-full h-full transition-transform duration-700 ";
    
    // Scale / Zoom logic specifically for horizontal logos with empty margins like Pousada do Sol
    if (item.id === 'pousada-do-sol') {
      classes += "scale-[1.35] origin-top group-hover:scale-[1.45] ";
    } else if (item.id === 'maria-cuisine') {
      classes += "scale-[1.10] origin-top group-hover:scale-[1.20] ";
    } else {
      classes += "group-hover:scale-110 ";
    }
    
    // Object fit logic
    if (isPremium) {
      classes += "object-cover";
    } else if (item.id === 'shopping-roda-dagua') {
      classes += "object-cover object-right";
    } else if (item.id === 'hotel-girassol') {
      classes += "object-contain object-center";
    } else if (['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-mata', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'hotel-casa-encantada', 'pousada-santa-fe', 'pousada-do-sol', 'vert-hotel', 'pousada-lago', 'hotel-terras-finlandia', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'expedicao-raizes', 'aguia-de-penedo', 'rota-dos-passeios', 'trilhando-penedo', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe', 'santa-claus-burger', 'maria-cuisine', 'armazem-da-vila', 'geek-penedo', 'astral-exotheryca', 'via-lactea-balas', 'casa-das-latas', 'vanilla-patisserie', 'delicias-da-carol', 'fue-gelateria', 'cafe-finlandes-penedo', 'arte-da-nossa-terra', 'reserva-da-mata', 'meu-sonho', 'artevelas', 'raio-de-luz-decoracoes', 'raio-de-luz', 'pousada-doce-mel', 'le-garden-pousada-boutique', 'pousada-viking', 'halloween-inn-penedo', 'pousada-nova-conquista', 'recanto-dos-passaros-penedo', 'pousada-laponia', 'vilar-hotel', 'hotel-penedo-inn', 'chale-na-roca-penedo', 'pousada-chicle-penedo-mc', 'pousada-estancia-penedo', 'casa-de-artista-suites-penedo', 'pousada-da-praca-penedo', 'pousada-bela-vista-penedo', 'pousada-chales-mon-desir', 'chales-laco-e-no', 'hotel-moradas-do-penedo', 'hotel-aromas-de-penedo', 'pousada-finlandia', 'city-park-hotel', 'hotel-do-papai-noel', 'pousada-penedo-house', 'pousada-nossa-senhora', 'hotel-pequena-suecia'].includes(item.id)) {
      classes += "object-contain object-top";
    } else {
      classes += "object-cover";
    }
    
    return classes;
  }, [item.id, isPremium]);

  const linkHref = React.useMemo(() => {
    if (isPremium) {
      return `#/detalhe/${item.slug || item.id}`;
    }
    return `#/local/${item.id}`;
  }, [item, isPremium]);

  return (
    <a 
      href={linkHref}
      onClick={(e) => {
        e.preventDefault();
        onOpen(item);
      }}
      className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer bg-gray-100 block transition-transform duration-300 hover:scale-[1.02] will-change-transform"
    >
      {/* Blurred Background Layer for Contained Images */}
      {!isPremium && ['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-girassol', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-mata', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'hotel-casa-encantada', 'pousada-santa-fe', 'pousada-do-sol', 'vert-hotel', 'pousada-lago', 'hotel-terras-finlandia', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'expedicao-raizes', 'aguia-de-penedo', 'rota-dos-passeios', 'trilhando-penedo', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe', 'santa-claus-burger', 'maria-cuisine', 'armazem-da-vila', 'geek-penedo', 'astral-exotheryca', 'via-lactea-balas', 'casa-das-latas', 'vanilla-patisserie', 'delicias-da-carol', 'fue-gelateria', 'cafe-finlandes-penedo', 'arte-da-nossa-terra', 'reserva-da-mata', 'meu-sonho', 'artevelas', 'raio-de-luz-decoracoes', 'raio-de-luz', 'pousada-doce-mel', 'le-garden-pousada-boutique', 'pousada-viking', 'halloween-inn-penedo', 'pousada-nova-conquista', 'recanto-dos-passaros-penedo', 'pousada-laponia', 'vilar-hotel', 'hotel-penedo-inn', 'chale-na-roca-penedo', 'pousada-chicle-penedo-mc', 'pousada-estancia-penedo', 'casa-de-artista-suites-penedo', 'pousada-da-praca-penedo', 'pousada-bela-vista-penedo', 'pousada-chales-mon-desir', 'chales-laco-e-no', 'hotel-moradas-do-penedo', 'hotel-aromas-de-penedo', 'pousada-finlandia', 'city-park-hotel', 'hotel-do-papai-noel', 'pousada-penedo-house', 'pousada-nossa-senhora', 'hotel-pequena-suecia'].includes(item.id) && (
        <div 
          className="absolute inset-0 z-0 opacity-40 scale-110 blur-xl"
          style={{ 
            backgroundImage: `url(${cardImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <img 
        src={cardImage} 
        loading="lazy"
        decoding="async"
        width={320}
        height={420}
        className={imgClass}
        alt={`${item.category || 'Estabelecimento'} ${item.title} em Penedo RJ`} 
        referrerPolicy="no-referrer" 
      />
      
      {/* Badge/Tag de Destaque para itens Premium */}
      {isPremium && (
        <div className="absolute top-4 left-4 z-30">
          <span className="bg-penedo-gold text-black font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg">
            {item.tag_destaque || (item as any).tag_destaque || "Destaque"}
          </span>
        </div>
      )}

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 z-30 px-6 pb-4 pt-6 text-white text-left w-full">
        <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-bold uppercase tracking-wider mb-2">
          {item.category}
        </span>
        
        {/* Title and Logo container */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-white border border-white/20 flex items-center justify-center">
            <img 
              src={`/assets/imagens/logos/logo-${item.id}.jpg`} 
              alt={`Logotipo oficial do estabelecimento ${item.title} em Penedo RJ`} 
              width={24}
              height={24}
              className="w-full h-full object-cover" 
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== item.image) {
                  target.src = item.image;
                } else {
                  target.style.display = 'none';
                }
              }}
            />
          </div>
          <h3 className="text-xl font-bold leading-tight line-clamp-1">{item.title}</h3>
        </div>
        
        {item.location && (
          <div className="flex items-center gap-1 text-white/50 text-[10px] mb-1 font-semibold">
            <MapPin size={10} className="text-penedo-gold shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        )}
        
        {item.tripadvisorUrl && (
          <div className="card-rating !text-white/70 mb-1" onClick={(e) => e.stopPropagation()}>
            ⭐ {item.rating || '4.5'} no 
            <a href={item.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="!text-white hover:underline ml-1">
              Tripadvisor
            </a>
          </div>
        )}

        <p className="text-white/60 text-xs line-clamp-2">{item.description}</p>
      </div>
    </a>
  );
});
