import React from 'react';
import { DetailItem } from '../types';
import { Link } from 'react-router-dom';
import { getBusinessPath } from '../routing/routeHelpers';
import { CARD_LOGO_PRESENTATION_BY_ID, LOGO_BACKGROUND_BY_ID } from './cardVisuals';

interface InfoCardProps {
  item: DetailItem;
  onOpen: (item: DetailItem) => void;
  key?: string;
}

export const InfoCard = React.memo(function InfoCard({ item, onOpen }: InfoCardProps) {
  const isPremium = item.isPremium === true;
  const logoPresentation = CARD_LOGO_PRESENTATION_BY_ID[item.id];
  const logoBackgroundColor = logoPresentation?.backgroundColor || LOGO_BACKGROUND_BY_ID[item.id];

  const cardImage = React.useMemo(() => {
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
      return item.galeria?.[0] || item.image;
    }
    return item.image;
  }, [item, isPremium]);

  const imgClass = React.useMemo(() => {
    let classes = "relative z-10 transition-transform duration-700 ";

    if (logoPresentation) {
      return classes + logoPresentation.imageClassName;
    }
    
    // Scale / Zoom logic specifically for horizontal logos with empty margins like Pousada do Sol
    if (item.id === 'pousada-do-sol') {
      classes += "scale-[1.35] origin-center group-hover:scale-[1.45] ";
    } else if (item.id === 'maria-cuisine') {
      classes += "scale-[1.10] origin-center group-hover:scale-[1.20] ";
    } else {
      classes += "group-hover:scale-110 ";
    }
    
    if (logoBackgroundColor) {
      classes += "max-h-full max-w-full object-contain object-center p-4 m-auto";
    } else if (item.id === 'rodrigo-dione') {
      classes += "w-full h-full object-contain object-center";
    } else if (item.id === 'hotel-girassol') {
      classes += "w-full h-full object-contain object-center p-3";
    } else if (isPremium) {
      classes += "w-full h-full object-cover";
    } else if (['jipe-tour', 'casa-das-pedras', 'casa-dos-cristais', 'bufallo-couros', 'guela-seca', 'deck-pizzaria-e-choperia'].includes(item.id)) {
      classes += "w-full h-full object-contain object-top";
    } else if (item.id === 'enoteca-serrana') {
      classes += "w-full h-full object-cover object-[center_75%]";
    } else if (item.id === 'sorvete-de-penedo') {
      classes += "w-full h-full object-contain object-top p-1";
    } else if (['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-da-cachoeira', 'pousada-serra-da-india', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-mata', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'hotel-casa-encantada', 'pousada-santa-fe', 'pousada-do-sol', 'vert-hotel', 'pousada-lago', 'hotel-terras-finlandia', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'farm-pizzaria', 'kaiten-sushi', 'loazo-resto', 'oh-baba-pizza-e-esfiha', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'expedicao-raizes', 'aguia-de-penedo', 'rota-dos-passeios', 'trilhando-penedo', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe', 'santa-claus-burger', 'maria-cuisine', 'armazem-da-vila', 'geek-penedo', 'astral-exotheryca', 'via-lactea-balas', 'casa-das-latas', 'vanilla-patisserie', 'delicias-da-carol', 'fue-gelateria', 'cafe-finlandes-penedo', 'arte-da-nossa-terra', 'reserva-da-mata', 'meu-sonho', 'artevelas', 'raio-de-luz-decoracoes', 'raio-de-luz', 'pousada-doce-mel', 'le-garden-pousada-boutique', 'pousada-viking', 'halloween-inn-penedo', 'pousada-nova-conquista', 'recanto-dos-passaros-penedo', 'pousada-laponia', 'vilar-hotel', 'hotel-penedo-inn', 'chale-na-roca-penedo', 'pousada-chicle-penedo-mc', 'pousada-estancia-penedo', 'casa-de-artista-suites-penedo', 'pousada-da-praca-penedo', 'pousada-bela-vista-penedo', 'pousada-chales-mon-desir', 'chales-laco-e-no', 'hotel-moradas-do-penedo', 'hotel-aromas-de-penedo', 'pousada-finlandia', 'city-park-hotel', 'hotel-do-papai-noel', 'pousada-penedo-house', 'pousada-nossa-senhora', 'hotel-pequena-suecia', 'chocolate-do-papai-noel', 'emporio-haru', 'emporio-chamoun', 'culto-cafe', 'rosana-balas-coco', 'from-penedo-delicatessen', 'cantinho-mineiro-tia-lili', 'esquina-da-serra', 'quatro-marias-boulangerie', 'grao-padaria-penedo', 'rei-da-vila', 'pousada-recanto-de-moria', 'unica-arte-para-voce', 'azia-sushi-lounge', 'bistro-du-cheff', 'sorvete-finlandes', 'acailandia-penedo', 'pe-de-canela-buteco', 'andicaro-penedo-cafes-especiais', 'clube-finlandia', 'esquilo-passeios', 'gute-passeios', 'restaurante-toa-toa', 'janela-divino', 'pousada-das-acerolas', 'pousada-vale-do-ermitao'].includes(item.id)) {
      classes += "w-full h-full object-contain object-top";
    } else {
      classes += "w-full h-full object-cover";
    }
    
    return classes;
  }, [item.id, isPremium, logoBackgroundColor, logoPresentation]);

  const linkHref = React.useMemo(() => {
    if (isPremium) {
      return getBusinessPath(item.slug || item.id);
    }
    return '';
  }, [item, isPremium]);

  return (
    <article
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-transform duration-300 hover:scale-[1.02] motion-reduce:transform-none"
    >
      {isPremium ? (
        <Link
          to={linkHref}
          aria-label={`Abrir detalhes de ${item.title}`}
          className="absolute inset-0 z-[25]"
        >
          <span className="sr-only">{`Abrir detalhes de ${item.title}`}</span>
        </Link>
      ) : (
        <button
          type="button"
          aria-label={`Abrir detalhes de ${item.title}`}
          onClick={() => onOpen(item)}
          className="absolute inset-0 z-[25]"
        >
          <span className="sr-only">{`Abrir detalhes de ${item.title}`}</span>
        </button>
      )}
      <div
        className="relative flex aspect-[3/4] w-full shrink-0 items-center justify-center overflow-hidden bg-gray-100"
        style={{ backgroundColor: logoBackgroundColor || '#F9FAFB' }}
      >
        {!logoBackgroundColor && !isPremium && imgClass.includes('object-contain') && (
          <div
            className="absolute inset-0 z-0 scale-110 bg-cover bg-center opacity-40 blur-xl"
            style={{ backgroundImage: `url(${cardImage})` }}
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

        {isPremium && (
          <div className="pointer-events-none absolute left-4 top-4 z-30">
            <span className="rounded-full bg-penedo-gold px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter text-black shadow-lg">
              RECOMENDADO
            </span>
          </div>
        )}
      </div>

      <div className="flex min-h-52 flex-grow flex-col border-t border-gray-100 bg-white p-5 text-left">
        <span className="mb-2 inline-block max-w-full self-start overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-penedo-forest/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-penedo-forest">
          {item.category}
        </span>

        <div className="mb-2 flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-xs">
            <img 
              src={item.image}
              alt={`Logotipo oficial do estabelecimento ${item.title} em Penedo RJ`} 
              width={24}
              height={24}
              className={`h-full w-full ${item.id === 'sorvete-de-penedo' ? 'object-contain p-0.5' : 'object-cover'}`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h3 className="min-w-0 line-clamp-1 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-penedo-emerald">{item.title}</h3>
        </div>

        <div className="mb-3 min-h-4">
          {item.tripadvisorUrl && (
            <div className="card-rating !m-0 text-xs text-gray-500">
              {item.rating && `⭐ ${item.rating} no `}
              <a href={item.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative z-40 ml-1 text-gray-700 hover:underline">
                Tripadvisor
              </a>
            </div>
          )}
        </div>

        <p className="h-[3.75rem] line-clamp-3 text-xs leading-5 text-gray-600">{item.description}</p>
      </div>
    </article>
  );
});
