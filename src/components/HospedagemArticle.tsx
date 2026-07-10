import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, ArrowRight, Check } from 'lucide-react';
import SEO from './SEO';
import { generateSEO } from '../seo';

interface HospedagemArticleProps {
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
        } else if (currentSrc !== 'https://picsum.photos/seed/hotel-fallback/800/600') {
          setCurrentSrc('https://picsum.photos/seed/hotel-fallback/800/600');
        }
      }}
    />
  );
};

export function HospedagemArticle({ handleSelectArticle }: HospedagemArticleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const hotels = [
    {
      id: 'pousada-do-lago',
      name: 'Pousada do Lago Penedo',
      icon: '🏞️',
      tagline: 'Extensa Área Verde, Lago Próprio e Sossego a Poucos Passos do Centro',
      instagram: 'https://www.instagram.com/pousadadolagopenedo',
      description: 'Com uma incrível área verde plana de 19.000m² e um exuberante lago próprio repleto de paz, a Pousada do Lago oferece uma experiência única que combina a tranquilidade e a privacidade da natureza serrana com a conveniência de estar a apenas 200 metros do centro comercial de Penedo. Localizada de forma privilegiada entre a tradicional Fábrica de Chocolates e a Pequena Finlândia (Casa do Papai Noel), a pousada permite que você explore as principais atrações da cidade a pé, dispensando o uso do carro para passear por charmosos cafés, lojas de artesanato e restaurantes locais.',
      details: 'Todas as aconchegantes acomodações contam com varanda privativa e lareira (ecológica ou a lenha), garantindo que o gostoso clima da serra abrace você todos os dias. O hóspede pode optar pelos amplos Apartamentos Master de decoração moderna, ou pelos charmosos Apartamentos Lago com varandas de frente para a tranquilidade das águas ou para o jardim. Para quem busca exclusividade e romance, as Suítes Superiores assinadas por designers de interiores oferecem luxos como móveis sob medida, camas queen ou king, smart TVs gigantes de até 65" e banheira de hidromassagem dupla da renomada marca Jacuzzi. Outra opção de altíssimo padrão são os chalés e os luxuosos Apartamentos Hidro Lago, posicionados estrategicamente à beira do lago em charmosos decks de madeira para proporcionar o máximo em conforto, requinte e conexão com a natureza.',
      amenities: ['Lago próprio com decks', '19.000m² de área verde', 'Todas as suítes com lareira', 'Varanda privativa com rede', 'Apenas 200m do centro', 'Hidromassagem Jacuzzi dupla', 'Wi-Fi gratuito de alta velocidade', 'Estacionamento privativo'],
      images: [
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-lago1.jpg', fallback: 'https://picsum.photos/seed/pousadadolago1/800/600' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-lago2.jpeg', fallback: 'https://picsum.photos/seed/pousadadolago2/600/400' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-lago3.jpg', fallback: 'https://picsum.photos/seed/pousadadolago3/600/400' }
      ]
    },
    {
      id: 'villa-luna',
      name: 'Pousada Villa Luna',
      icon: '🌙',
      tagline: 'Charme Europeu e Natureza Exuberante no Coração de Penedo',
      instagram: 'https://www.instagram.com/pousadavillaluna/',
      description: 'Situada estrategicamente na avenida principal de Penedo e a apenas 200 metros da famosa Pequena Finlândia e da charmosa Vila da Gula, a Pousada Villa Luna surpreende e encanta seus visitantes. Cercada por uma belíssima área verde plana de 7.000m² repleta de árvores frutíferas e flores tropicais, a pousada proporciona um clima familiar e harmonioso, perfeito para quem busca a tranquilidade da serra com a conveniência de estar pertinho do centro histórico, das principais lojas, bares e restaurantes da região.',
      details: 'A estrutura dispõe de confortáveis suítes de 12m² a 15m² equipadas com cama de casal padrão, Queen ou King, além de românticos bangalôs com camas de toras de eucalipto feitas por artesãos locais, enxoval de percal bordado à mão, toalhas gigantes, roupões e varanda privativa com rede. Os bangalôs premium também oferecem uma incrível banheira de hidromassagem dupla integrada ao quarto com vista para o jardim ou um relaxante Ofurô oriental ao lado da cama. O maravilhoso buffet de café da manhã é um dos grandes destaques do local, servindo deliciosos bolos, geleias caseiras, panquecas doces e salgadas feitas na hora, ovos e sucos naturais. Para o lazer e bem-estar, a pousada conta com uma deliciosa piscina no jardim, sauna e um espaço de SPA com terapias e massagens relaxantes orientais.',
      amenities: ['Estacionamento gratuito', 'Somos Pet Friendly', 'Wi-Fi gratuito', 'Quartos para famílias', 'Piscina ao ar livre', 'SPA com massagens', 'Sauna a vapor', 'Copa do bebê'],
      images: [
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna1.jpg', fallback: 'https://picsum.photos/seed/villaluna1/800/600' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna2.jpg', fallback: 'https://picsum.photos/seed/villaluna2/600/400' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-villa-luna3.jpg', fallback: 'https://picsum.photos/seed/villaluna3/600/400' }
      ]
    },
    {
      id: 'hotel-britannia',
      name: 'Hotel Britannia',
      icon: '🇬🇧',
      tagline: 'O Requinte Britânico com Toques de Realeza no Sul Fluminense',
      instagram: 'https://www.instagram.com/hotel.britannia/',
      description: 'Localizado no centro de Penedo, a apenas 500 metros (cerca de 8 minutos de caminhada) da Casa do Papai Noel, o Hotel Britannia traz para a região um conceito único inspirado no requinte, na história e na cultura britânica. Trata-se de um refúgio tradicional ideal tanto para turistas que buscam curtir o melhor de Penedo quanto para quem viaja a lazer em busca de uma atmosfera diferenciada e de muito charme. A decoração elegante conta com ambientes inspiradores, como a aconchegante Sala dos Beatles e o imperdível chá da tarde tradicional inglês servido com todo o carinho aos hóspedes.',
      details: 'O hotel dispõe de variadas opções de hospedagem planejadas para garantir total conforto. As Suítes Standard oferecem decoração clássica, cama Queen Size, banheiro privativo, ar-condicionado, TV a cabo HD e frigobar. Para momentos mais românticos, os aconchegantes Chalés de Alvenaria e de Madeira oferecem uma quentinha lareira privativa para as noites frias de serra. Já as amplas Suítes Master de 24m² e o exclusivo Chalé da Árvore combinam o calor da lareira com uma luxuosa banheira de hidromassagem privativa. A infraestrutura de lazer é impecável, com piscinas adulta e infantil (incluindo uma relaxante piscina natural), sauna seca, salão de jogos equipado, um incrível pub temático interno e um café da manhã fabuloso com produtos artesanais de alta qualidade.',
      amenities: ['2 piscinas (adulta/infantil)', 'Piscina natural e fria', 'Estacionamento gratuito', 'Wi-Fi de alta velocidade', 'Quartos para famílias', 'Pub temático inglês', 'Salão de jogos', 'Chaleira em todos os quartos'],
      images: [
        { src: '/assets/imagens/blog/melhores-hospedagens/hotel-britania1.jpg', fallback: 'https://picsum.photos/seed/britannia1/800/600' },
        { src: '/assets/imagens/blog/melhores-hospedagens/hotel-britania2.jpg', fallback: 'https://picsum.photos/seed/britannia2/600/400' },
        { src: '/assets/imagens/blog/melhores-hospedagens/hotel-britania3.jpg', fallback: 'https://picsum.photos/seed/britannia3/600/400' }
      ]
    },
    {
      id: 'santa-fe',
      name: 'Pousada Santa Fé de Penedo',
      icon: '🌋',
      tagline: 'Vista Espetacular da Serra e Inspiração Cultural Sul-Americana',
      instagram: 'https://www.instagram.com/santafepenedo/',
      description: 'Para quem busca sossego absoluto, contato direto com a natureza e ar puro, o destino ideal é a Pousada Santa Fé de Penedo. Situada a apenas 2 km do centrinho de Penedo, no charmoso Vale do Ermitão, seu grande diferencial é a vista privilegiada e deslumbrante das montanhas da Serra da Mantiqueira. A pousada se funde de forma harmônica com a paisagem natural e apresenta uma decoração viva e colorida inspirada na rica herança cultural da América do Sul e do México.',
      details: 'Com 17 suítes acolhedoras, os quartos possuem varandas panorâmicas equipadas com redes de descanso. As Suítes Luxo apresentam decorações temáticas mexicanas que homenageiam ícones como a pintora Frida Kahlo, os grupos Mariachis e a gastronomia local (Tacos & Nachos). Para o máximo conforto, as Suítes Master e Master Plus oferecem espaços generosos de até 50m², banheira de hidromassagem aquecida integrada, iluminação decorativa em LED de extremo bom gosto e vista privativa da serra. O buffet de café da manhã é servido em um salão envidraçado à beira da maravilhosa piscina panorâmica. A pousada conta ainda com hidromassagem aquecida ao ar livre no terraço panorâmico, salão de jogos, sala de lareira para os dias frios, um charmoso jardim de inverno com fogo de chão, mini copa de apoio e um SPA especializado em massagens e terapias corporais.',
      amenities: ['Café da manhã à beira da piscina', 'Piscina panorâmica', 'Hidromassagem aquecida', 'Wi-Fi gratuito', 'Salão de jogos', 'Sala de lareira', 'Fogo de chão no jardim', 'SPA & Massagens relaxantes'],
      images: [
        { src: '/assets/imagens/blog/melhores-hospedagens/santafe-penedo1.jpg', fallback: 'https://picsum.photos/seed/santafe1/800/600' },
        { src: '/assets/imagens/blog/melhores-hospedagens/santafe-penedo2.jpg', fallback: 'https://picsum.photos/seed/santafe2/600/400' },
        { src: '/assets/imagens/blog/melhores-hospedagens/santafe-penedo3.jpg', fallback: 'https://picsum.photos/seed/santafe3/600/400' }
      ]
    },
    {
      id: 'pousada-do-sol',
      name: 'Pousada do Sol',
      icon: '☀️',
      tagline: 'Sua Opção Completa com Piscina Aquecida ao Lado do Centrinho',
      instagram: 'https://www.instagram.com/pousadadosolpenedo/',
      description: 'A Pousada do Sol de 3 estrelas é sinônimo de bem-estar e conveniência em Penedo. Localizada a apenas 100 metros do Shopping Terras da Finlândia e a 9 minutos a pé do Museu Finlandês, ela é perfeita para quem quer estacionar o carro e fazer tudo caminhando. O local alia uma estrutura robusta com recepção 24 horas a uma atmosfera super relaxante, ideal para casais que querem descansar ou famílias que viajam com crianças.',
      details: 'Com 31 quartos aconchegantes e modernos equipados com ar-condicionado, controle de temperatura, frigobar e TV de tela plana, a pousada atende a todos os perfis. As opções vão desde o Quarto Familiar com varanda e vista para a cidade, Estúdios Deluxe com piso frio, Suítes com cama King size, até os privativos Chalés com entrada independente e varanda voltada para o belo jardim interno. O destaque fica para o Chalé Superior, que oferece uma incrível banheira de hidromassagem privativa para banhos relaxantes após os passeios. No quesito lazer, os hóspedes desfrutam de duas piscinas (sendo uma deliciosa piscina aquecida), sauna úmida, banho turco de imersão e um farto buffet de café da manhã gratuito servido diariamente com bolos frescos, pães e quitutes da serra.',
      amenities: ['2 piscinas (sendo uma aquecida)', 'Sauna úmida e Banho turco', 'Estacionamento gratuito', 'Wi-Fi em toda a propriedade', 'Quartos para não fumantes', 'Recepção 24 horas', 'Serviço de quarto', 'Café da manhã buffet grátis'],
      images: [
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-do-sol1.jpg', fallback: 'https://picsum.photos/seed/pousadadosol1/800/600' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-do-sol2.jpg', fallback: 'https://picsum.photos/seed/pousadadosol2/600/400' },
        { src: '/assets/imagens/blog/melhores-hospedagens/pousada-do-sol3.jpg', fallback: 'https://picsum.photos/seed/pousadadosol3/600/400' }
      ]
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <SEO 
        {...generateSEO('article', {
          slug: 'melhores-hospedagens',
          title: 'Onde se Hospedar em Penedo',
          description: 'Um guia de hospedagem em Penedo com as melhores pousadas e chalés. Lareiras aconchegantes, hidromassagem e vistas incríveis.',
          image: '/assets/imagens/blog/melhores-hospedagens/intro.jpg',
          datePublished: '2026-06-23',
          keywords: ['onde ficar em penedo', 'pousadas penedo', 'hoteis penedo']
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
            Lendo: <span className="text-penedo-forest">Onde se Hospedar em Penedo</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative pt-10 md:pt-20 md:pt-32 pb-8 md:pb-16 md:pt-40 md:pb-24 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          <ImageWithFallback 
            src="/assets/imagens/blog/melhores-hospedagens/intro2.jpg" 
            fallbackSrc="https://picsum.photos/seed/pousadas-intro/1920/1080"
            className="w-full h-full object-cover" 
            alt="Onde se hospedar em Penedo pousadas de charme" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-penedo-forest/60 via-transparent to-penedo-forest"></div>
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-penedo-gold text-penedo-forest text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl"
          >
            Hospedagem & Conforto
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
          >
            Onde se Hospedar em Penedo: Pousadas e Hotéis que <span className="text-penedo-gold italic">Encantam e Surpreendem</span>
          </motion.h1>
        </div>
      </header>

      {/* Intro and Main Content */}
      <section className="py-8 md:py-16 md:py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="prose prose-xl prose-penedo max-w-none text-gray-600 mb-4 md:mb-8 md:mb-16 text-left">
            <p className="lead font-medium text-2xl text-gray-800 drop-shadow-sm mb-6">
              Escolher uma boa hospedagem é fundamental para garantir que sua viagem a Penedo seja mágica. A cidade é famosa pelo clima aconchegante de serra, arquitetura de inspiração europeia e natureza rica.
            </p>
            <p className="text-lg leading-relaxed">
              O charme se reflete diretamente nas pousadas e hotéis locais. Seja um romântico bangalô rústico com lareira para aquecer o frio da noite, ou um hotel com infraestrutura completa de lazer e piscinas aquecidas bem pertinho do centrinho de compras, Penedo oferece o refúgio perfeito para recarregar as energias em casal, em família ou entre amigos.
            </p>
            <p className="text-lg leading-relaxed">
              Preparamos uma seleção exclusiva com cinco das hospedagens mais encantadoras de Penedo. Cada uma delas possui uma proposta única, hospitalidade de excelência e detalhes que farão você se sentir em casa na única colônia finlandesa do Brasil.
            </p>
          </div>

          <div className="mb-4 md:mb-8 md:mb-16 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <ImageWithFallback 
              src="/assets/imagens/blog/melhores-hospedagens/intro2.jpg"
              fallbackSrc="https://picsum.photos/seed/pousadas-intro-2/1200/600"
              alt="Introdução Pousadas e Hoteis Penedo" 
              className="w-full h-auto max-h-[80vh] object-cover object-center bg-[#FAFAFA] cursor-pointer hover:scale-105 transition-transform duration-700"
              onClick={() => setSelectedImage("/assets/imagens/blog/melhores-hospedagens/intro2.jpg")}
            />
          </div>

          {/* Hotel/Pousada Cards */}
          <div className="space-y-16">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-xl text-left">
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-black text-penedo-forest mb-2">
                    {hotel.instagram ? (
                      <a 
                        href={hotel.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-penedo-emerald transition-colors inline-flex flex-wrap items-center gap-3 cursor-pointer group/title"
                      >
                        <span>{hotel.icon} {hotel.name}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 hover:bg-red-100 transition-colors flex items-center gap-1 select-none">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                          </svg>
                          Instagram
                        </span>
                      </a>
                    ) : (
                      <span>{hotel.icon} {hotel.name}</span>
                    )}
                  </h2>
                  <p className="text-penedo-emerald font-bold tracking-widest text-xs uppercase mb-4">
                    {hotel.tagline}
                  </p>
                </div>
                
                <div className="text-gray-600 space-y-4 mb-6 text-lg">
                  <p>{hotel.description}</p>
                  <p>{hotel.details}</p>
                </div>

                {/* Amenities List */}
                <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-penedo-forest text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    ✨ Comodidades & Destaques:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <span className="w-5 h-5 rounded-full bg-penedo-emerald/10 text-penedo-emerald flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-gallery with 2xl border radius and hover effects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2 overflow-hidden rounded-2xl group shadow-md h-64 md:h-80">
                    <ImageWithFallback 
                      src={hotel.images[0].src} 
                      fallbackSrc={hotel.images[0].fallback} 
                      alt={`${hotel.name} principal`} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${hotel.id === 'pousada-do-sol' ? 'object-bottom' : ''}`} 
                      onClick={() => setSelectedImage(hotel.images[0].src)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 h-64 md:h-80">
                    <div className="overflow-hidden rounded-2xl group shadow-md h-1/2">
                      <ImageWithFallback 
                        src={hotel.images[1].src} 
                        fallbackSrc={hotel.images[1].fallback} 
                        alt={`${hotel.name} detalhe 1`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" 
                        onClick={() => setSelectedImage(hotel.images[1].src)}
                      />
                    </div>
                    <div className="overflow-hidden rounded-2xl group shadow-md h-1/2">
                      <ImageWithFallback 
                        src={hotel.images[2].src} 
                        fallbackSrc={hotel.images[2].fallback} 
                        alt={`${hotel.name} detalhe 2`} 
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${hotel.id === 'hotel-britannia' ? 'object-bottom' : ''} ${hotel.id === 'santa-fe' ? 'object-bottom md:object-center' : ''}`} 
                        onClick={() => setSelectedImage(hotel.images[2].src)}
                      />
                    </div>
                  </div>
                </div>
                
                <p className="mt-4 text-[11px] text-center text-gray-400 italic">
                  Fotos retiradas do instagram d{hotel.name.includes('Pousada') ? 'a' : 'o'} {hotel.name}
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
              Encontrar o hotel ou a pousada ideal faz toda a diferença para criar memórias inesquecíveis. Seja desfrutando da paz do exuberante lago privativo na imensa área verde de 19.000m² da espetacular Pousada do Lago, mergulhando na rica cultura britânica do tradicional Britannia, relaxando em meio à verdejante mata atlântica de 7.000m² da charmosa Villa Luna, contemplando o amanhecer sobre a Serra da Mantiqueira na artística Santa Fé, ou aproveitando a conveniência de estar pertinho de tudo com as piscinas quentinhas da Pousada do Sol.
            </p>
            <p className="text-lg leading-relaxed">
              Mais do que locais de repouso, as pousadas de Penedo oferecem cenários deslumbrantes, aconchego em cada pequeno detalhe e a amigável hospitalidade de serra para que você desfrute cada instante de sua estadia.
            </p>
            <p className="text-gray-400 text-sm mt-6 italic">Publicado em 23/06/2026.</p>
          </div>
          
          <div className="mb-4 md:mb-8 md:mb-16 rounded-[3rem] overflow-hidden shadow-2xl relative w-full h-96 md:h-[32rem]">
            <ImageWithFallback 
              src="/assets/imagens/blog/melhores-hospedagens/intro.jpg"
              fallbackSrc="https://picsum.photos/seed/pousadas-conclusao/1200/650"
              alt="Conclusão Pousadas e Hotéis em Penedo" 
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
              onClick={() => setSelectedImage("/assets/imagens/blog/melhores-hospedagens/intro.jpg")}
            />
          </div>
        </div>
      </section>

      {/* CTA final section */}
      <section className="py-32 bg-penedo-forest relative overflow-hidden text-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="https://picsum.photos/seed/pousadas-cta/1920/1080?blur=5" className="w-full h-full object-cover" alt="Footer Hospedagem" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 md:mb-8 leading-tight">Quer encontrar a pousada perfeita para a sua viagem?</h2>
          <p className="text-xl text-white/80 mb-6 md:mb-12 font-medium">Chame agora no WhatsApp! Te ajudamos com dicas personalizadas de roteiros e reservas em Penedo.</p>
          <div className="flex justify-center">
            <BlogPostCTA 
              label="Falar no WhatsApp" 
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá!%20Gostaria%20de%20dicas%20sobre%20pousadas%20e%20hospedagem%20em%20Penedo!')} 
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
