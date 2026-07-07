/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Instagram, 
  Facebook, 
  Handshake,
  MessageSquare,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Info,
  Search,
  ChevronUp,
  Wind,
  Coffee,
  ShoppingBag,
  Bus,
  Car,
  Utensils,
  Calendar,
  Mountain,
  Umbrella,
  Heart,
  Camera,
  Map as MapIcon,
  Tent,
  Droplets,
  ExternalLink,
  MessageCircle,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Page, DetailItem } from './types';
import { Carousel } from './components/Carousel';
import { InfoCard } from './components/InfoCard';
import { RestaurantesArticle } from './components/RestaurantesArticle';
import { HospedagemArticle } from './components/HospedagemArticle';
import { shuffleArray } from './utils/shuffle';
import locaisData from './locais.json';
import { 
  pushWhatsappClick, 
  pushInstagramClick, 
  pushPremiumCardClick, 
  pushSearch, 
  pushBusinessPageView, 
  pushScroll, 
  pushPageEngagement, 
  pushPageView 
} from './analytics/events';
import { pushToDataLayer } from './analytics/dataLayer';


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

// Google Analytics Event Tracking Helper (Redirecionado para GTM Data Layer)
const trackEvent = (action: string, category: string, label: string) => {
  // Padronização conforme solicitado: Hospedagem -> Hotel, Gastronomia -> Restaurante, Shopping -> Lojas
  const categoryMap: Record<string, string> = {
    'Hospedagem': 'Hotel',
    'Gastronomia': 'Restaurante',
    'Shopping': 'Lojas',
    'Natureza': 'Atrações',
    'Cultura': 'Atrações'
  };
  
  const finalCategory = categoryMap[category] || category;

  pushToDataLayer({
    event: 'custom_event',
    event_action: action,
    event_category: finalCategory,
    event_label: label,
    page_location: window.location.href,
    page_title: document.title || 'Vem Pra Penedo'
  });
};

const DETAILS_DATA: Record<string, DetailItem[]> = {
  'o-que-fazer': [
    { 
      id: 'cachoeira-deus',
      title: "Cachoeira de Deus", 
      category: "Natureza", 
      image: "/assets/imagens/logos/logo-cachoeira-deus.jpg",
      description: "Uma das mais belas e famosas quedas d'água de Penedo.",
      fullInfo: "A Cachoeira de Deus é um dos pontos turísticos mais visitados. Com uma queda de aproximadamente 15 metros, forma um poço profundo e gelado, ideal para banhos revigorantes. O acesso é feito por uma trilha leve de cerca de 10 minutos.",
      location: "Alto Penedo, Itatiaia - RJ",
      hours: "Acesso livre (recomenda-se luz do dia)",
      rating: 4.8,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d2424415-Reviews-Deus_Waterfall-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Trilha+da+Cachoeira+de+Deus+Penedo",
      tags: ["cachoeira", "natureza", "trilha", "banho", "rio", "água", "grátis", "foto", "família", "aventura", "alto penedo"]
    },
    { 
      id: 'clube-finlandia',
      title: "Clube Finlândia - Penedo", 
      category: "Cultura", 
      image: "/assets/imagens/logos/logo-clube-finlandia.jpg",
      description: "O centro de cultura finlandesa no Brasil que celebra a riqueza das tradições.",
      fullInfo: "Bem-vindo ao Clube Finlândia, fundado em 1943, o centro de cultura finlandesa no Brasil que celebra até hoje a riqueza das tradições deste país distante. Somos mais do que um clube; somos uma comunidade que preserva e compartilha a vibrante herança finlandesa, incluindo a incrível história da chegada dos finlandeses ao Brasil em 1929. Junte-se a nós e embarque em uma jornada repleta de descobertas e experiências únicas, explorando nossa história, gastronomia, arte, música, dança e alegria, enquanto celebramos a identidade finlandesa no Brasil.",
      location: "Av. das Mangueiras, 2601",
      hours: "Consulte horários de eventos",
      rating: 4.9,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d2424404-Reviews-Clube_Finlandia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Clube+Finlandia+Penedo",
      tags: ["cultura", "finlândia", "história", "dança", "música", "tradição", "clube", "eventos", "centro"]
    },
    { 
      id: 'lelu-museu',
      title: "Lelu Museu (Museu de Brinquedos)", 
      category: "Cultura", 
      image: "/assets/imagens/logos/logo-lelu-museu.jpg",
      description: "Um incrível acervo com mais de 3.000 brinquedos clássicos e históricos.",
      fullInfo: "O Lelumuseo (Museu de Brinquedos em finlandês) é um espaço de 400m² que abriga cerca de 3.200 peças que marcaram gerações entre as décadas de 50 e 2000. O acervo inclui desde bonecas e carrinhos até bicicletas e velocípedes, sendo uma homenagem à cultura finlandesa e à nostalgia da infância.",
      location: "Penedo, Itatiaia - RJ",
      hours: "Consulte horários sazonais",
      rating: 4.9,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d23853110-Reviews-Lellumuseo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Lelumuseo+Museu+de+Brinquedos+Penedo",
      tags: ["museu", "brinquedos", "crianças", "família", "nostalgia", "história", "cultura", "finlândia", "coleção"]
    },
    { 
      id: 'museu-finlandes',
      title: "Museu Finlandês Dona Eva", 
      category: "Cultura", 
      image: "/assets/imagens/logos/logo-museu-finlandes.jpg",
      description: "O principal acervo histórico da colonização finlandesa em Penedo.",
      fullInfo: "Fundado em 1982 por Eva Hilden, o museu preserva a história dos imigrantes finlandeses que chegaram em 1929 em busca de um 'Éden Tropical'. O acervo diversificado inclui desde objetos pessoais das primeiras famílias até obras de arte e artesanato que narram a trajetória da única colônia finlandesa no Brasil. É uma narrativa viva da dedicação de Dona Eva em manter viva a cultura de sua terra natal.",
      location: "Rua das Velas, Penedo",
      hours: "Consulte horários de funcionamento",
      rating: 4.8,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d2424412-Reviews-Museu_Finlandes_Dona_Eva-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Museu+Finlandes+Dona+Eva+Penedo",
      tags: ["museu", "história", "cultura", "finlândia", "imigração", "arte", "exposição", "educação", "centro"]
    },
    { 
      id: 'pequena-finlandia',
      title: "Pequena Finlândia", 
      category: "Cultura", 
      image: "/assets/imagens/logos/logo-pequena-finlandia.jpg",
      description: "O coração comercial e cultural da vila, com arquitetura típica.",
      fullInfo: "Inaugurada em 1993, a Pequena Finlândia é um shopping a céu aberto que reproduz uma vila finlandesa. Lá você encontra a Casa do Papai Noel, lojas de artesanato, chocolates e sorveterias famosas.",
      location: "Rua das Velas, Penedo",
      hours: "10:00 - 22:00",
      rating: 4.7,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d4706334-Reviews-Pequena_Finlandia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Pequena+Finlandia+Penedo",
      tags: ["papai noel", "compras", "artesanato", "chocolate", "finlândia", "centro", "turismo", "família", "crianças", "arquitetura", "sorvete"]
    },
    { 
      id: 'poco-esmeraldas',
      title: "Poço das Esmeraldas", 
      category: "Natureza", 
      image: "/assets/imagens/logos/logo-poco-das-esmeraldas.jpg",
      description: "Um poço de águas verdes e cristalinas, perfeito para um mergulho.",
      fullInfo: "O Poço das Esmeraldas é conhecido pela cor vibrante de suas águas, que lembram a pedra preciosa. É um local tranquilo, ideal para quem busca contato direto com a natureza e um banho refrescante em águas límpidas.",
      location: "Alto Penedo, Itatiaia - RJ",
      hours: "Acesso livre",
      rating: 4.6,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d10687386-Reviews-Poco_das_Esmeraldas-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Poço+das+Esmeraldas+Penedo",
      tags: ["natureza", "banho", "rio", "água cristalina", "mergulho", "tranquilidade", "foto", "alto penedo"]
    },
    { 
      id: 'tres-cachoeiras',
      title: "Três Cachoeiras", 
      category: "Natureza", 
      image: "/assets/imagens/logos/logo-tres-cachoeiras.jpg",
      description: "Conjunto de três quedas próximas de fácil acesso.",
      fullInfo: "Localizadas bem próximas ao centro, as Três Cachoeiras são ideais para quem não quer caminhar muito. O local é muito procurado por famílias e possui infraestrutura de quiosques ao redor.",
      location: "Av. das Três Cachoeiras, Penedo",
      hours: "Acesso livre",
      rating: 4.5,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d2424428-Reviews-Tres_Cachoeiras-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["cachoeira", "natureza", "fácil acesso", "família", "centro", "rio", "banho", "quiosque", "turismo"]
    },
    { 
      id: 'expedicao-raizes',
      title: "Expedição Raízes da Mantiqueira", 
      category: "Aventura", 
      isPremium: true,
      image: "/assets/imagens/logos/logo-expedicao-raizes.jpg",
      description: "Passeios 4x4 em Penedo, trilhas e cachoeiras exclusivas. Prêmio TripAdvisor Travellers' Choice 2026.",
      fullInfo: "Empresa credenciada Ministério do turismo Cadastur realizando Turismo Legal. Guia credenciado Mtur Cadastur. Nosso compromisso é proporcionar a conectividade com a natureza de maneira sustentável. Não vendemos apenas um serviço proporcionamos experiências.",
      descricao_longa: "Embarque inesquecível pelo coração de Penedo. Com nossos passeios off-road 4x4, você terá acesso a trilhas escondidas e cachoeiras exclusivas que poucos têm a chance de conhecer. Somos guiados por profissionais apaixonados e garantimos a máxima segurança através do Turismo Legal, certificados pelo Cadastur. Mais do que vender passeios, nossa missão na Expedição Raízes da Mantiqueira é proporcionar uma verdadeira conexão sustentável com a natureza, entregando as experiências enriquecedoras e autênticas que nos garantiram o Prêmio TripAdvisor Travellers' Choice 2026.",
      location: "Rua das velas, 100",
      hours: "Agendamento prévio",
      rating: 5.0,
      whatsapp: "24999116542",
      link_whatsapp: "https://wa.me/5524999116542",
      instagram: "https://www.instagram.com/expedicaoraizesdamantiqueira/",
      link_instagram: "https://www.instagram.com/expedicaoraizesdamantiqueira/",
      link_maps: "https://www.google.com/maps/search/?api=1&query=Expedi%C3%A7%C3%A3o+Ra%C3%ADzes+da+Mantiqueira+Penedo",
      link_video: "https://www.instagram.com/reel/DTawltXkhlC/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d23280155-Reviews-Expedicao_Raizes_da_Mantiqueira-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      galeria: [
        "/assets/imagens/premium/expedicao-raizes/galeria-1.jpg",
        "/assets/imagens/premium/expedicao-raizes/galeria-2.jpg",
        "/assets/imagens/premium/expedicao-raizes/galeria-3.jpg",
        "/assets/imagens/premium/expedicao-raizes/galeria-4.jpg",
        "/assets/imagens/premium/expedicao-raizes/galeria-5.jpg",
        "/assets/imagens/premium/expedicao-raizes/galeria-6.jpg"
      ],
      tags: ["4x4", "passeios", "trilhas", "cachoeiras", "aventura", "natureza", "ecoturismo", "família", "guia"]
    },
    { 
      id: 'aguia-de-penedo',
      title: "Águia de Penedo", 
      category: "Aventura", 
      image: "/assets/imagens/logos/logo-aguia-de-penedo.png",
      description: "Passeios de Quadriciclo 100% Off-Road e trilha incrível dentro de uma propriedade particular.",
      fullInfo: "O Mundo do Off-Road é diferente de todo tipo de aventura que você já viu. Nosso objetivo é proporcionar aventura aos participantes. Para isso preparamos uma trilha incrível, uma trilha dentro de uma propriedade particular, trilha 100% ecológica. Visitamos a cachoeira da LONTRA, única que vocês não têm acesso de carro. Quadriciclos 4x4 Honda. Passeio duração média 2 horas incluindo treinamento e parada para mergulho. Parada para foto com vista da Montanha Serra da Índia.",
      location: "R. das Velas, 154, Penedo",
      hours: "Seg a Dom: 08h, 10h, 12h, 14h, 16h (pré agendada)",
      rating: 5.0,
      whatsapp: "24998156112",
      instagram: "https://www.instagram.com/aguia_depenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d8821570-Reviews-Aguia_de_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["quadriciclo", "off-road", "aventura", "trilha", "natureza", "cachoeira da lontra", "passeios", "família", "4x4"]
    },
    { 
      id: 'rota-dos-passeios',
      title: "Rota dos Passeios", 
      category: "Turismo", 
      image: "/assets/imagens/logos/logo-rota-dos-passeios.png",
      description: "Empresa de Turismo e Transporte (Cadastur). Passeios de Buggy, Jipe 4x4, city tour e transfers.",
      fullInfo: "Realizamos passeios de Buggy e Jipe pelas cachoeiras da região, passeios a cavalo, aluguel de bicicletas, voo de parapente, montanhismo, quadriciclo, city tour Penedo, Parque Nacional do Itatiaia, Visconde de Mauá e Serrinha do Alambari. Também realizamos serviços de Transfer nas regiões e RJ/SP.",
      location: "Av. das Mangueiras, 1857, Penedo",
      mapUrl: "https://www.google.com/maps/place/Rota+dos+Passeios/@-22.4398781,-44.5345729,15z/data=!3m1!4b1!4m6!3m5!1s0x9e7996d35e2351:0x77e98cc13406c748!8m2!3d-22.4398983!4d-44.5242946!16s%2Fg%2F11hzhq4t7v?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D",
      hours: "Consultar horários",
      rating: 5.0,
      whatsapp: "24999863331",
      instagram: "https://www.instagram.com/rotadospasseiospenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d18378498-Reviews-Rota_dos_Passeios-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["buggy", "jipe", "4x4", "city tour", "transfer", "passeios", "bicicletas", "parapente", "turismo", "aventura", "família"]
    },
    { 
      id: 'trilhando-penedo',
      title: "Trilhando Penedo Ecoturismo", 
      category: "Ecoturismo", 
      image: "/assets/imagens/logos/logo-trilhando-penedo.jpg",
      description: "Traveller's Choice especialista em turismo de aventura e passeios off-road.",
      fullInfo: "Especialista em turismo de aventura e passeios off-road. Empresa Traveller's Choice, Guia Cadastur, sempre proporcionando experiences inesquecíveis.",
      location: "Av. das Mangueiras, Penedo",
      hours: "Agendamento prévio",
      rating: 5.0,
      whatsapp: "24999596544",
      instagram: "https://www.instagram.com/trilhando_penedo_ecotur",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d15154790-Reviews-Trilhando_Penedo_Ecoturismo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["off-road", "aventura", "ecoturismo", "trilhas", "passeios", "guia", "natureza"]
    }
  ],
  'onde-ficar': [
    {
      id: 'hotel-bertell',
      title: "Hotel Bertell",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-bertell.jpg",
      description: "Tradição finlandesa à beira do Rio das Pedras.",
      fullInfo: "Fundado pelos pioneiros finlandeses e situado à beira das curvas mais bonitas do Rio das Pedras, conservando toda sua beleza natural. Possui 15 Chalés, 05 Apartamentos e 06 Suítes totalmente equipadas. Oferece Academia, Salão de Jogos, Brinquedoteca, Cozinha do Bebê, SPA (Sauna e Hidro), Piscina Adulto e Infantil, Área Verde e Parque Infantil. Seu pet é super bem-vindo (pequeno porte).",
      location: "R. Harry Bertel, 47",
      rating: 4.8,
      whatsapp: "24998163679",
      instagram: "https://www.instagram.com/hotelbertell/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d1832392-Reviews-Hotel_Bertell-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/bertell-ltda.pt-br.html",
      tags: ["piscina", "sauna", "rio", "natureza", "pet friendly", "academia", "salão de jogos", "spa", "hidromassagem", "família", "romântico", "tranquilidade"]
    },
    {
      id: 'hotel-britannia',
      title: "Hotel Britânia",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-britannia.jpg",
      description: "Tradição e temática britânica no coração de Penedo.",
      fullInfo: "O Hotel Britannia é um hotel tradicional de Penedo, localizado no centro da cidade, a 8 minutos de caminhada da famosa Casa do Papai Noel. Possui uma temática única, inspirada no requinte britânico, com referências à cultura inglesa, como a sala dos Beatles e o famoso chá da tarde servido no hotel. Os quartos possuem decoração inspiradora para que você se sinta um verdadeiro lorde inglês.",
      location: "Av. Casa das Pedras, 1240",
      rating: 4.7,
      whatsapp: "21967553210",
      instagram: "https://www.instagram.com/hotel.britannia/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2305191-Reviews-Hotel_Britannia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/dom-britannia.pt-br.html",
      tags: ["britânico", "temático", "centro", "piscina", "chá da tarde", "acolhedor", "estilo clássico"]
    },
    {
      id: 'hotel-casa-encantada',
      title: "Hotel Casa Encantada",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-casa-encantada.jpg",
      description: "Charme colonial e tranquilidade no centro de Penedo.",
      fullInfo: "Situado no Centro de Penedo, o Hotel Casa Encantada é ideal para quem quer aproveitar as atrações a pé. Com estilo colonial, oferece piscina, banheira de hidromassagem externa (custo adicional) e vista para o rio. Localizado em rua tranquila, permite relaxar ao som do Rio das Pedras e canto dos pássaros. Oferece buffet de café da manhã, Wi-Fi e estacionamento gratuitos.",
      location: "Av. da Finlândia, 70",
      rating: 4.7,
      whatsapp: "24992519189",
      instagram: "https://www.instagram.com/hotelcasaencantadapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2627602-Reviews-Casa_Encantada_Hotel_Suites-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/casa-encantada.pt-br.html",
      tags: ["colonial", "centro", "piscina", "hidromassagem", "rio", "aconchegante", "família", "casal"]
    },
    {
      id: 'hotel-daniela',
      title: "Hotel Daniela",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-daniela.jpg",
      description: "Simplicidade, capricho e tradição familiar desde 1972.",
      fullInfo: "Fundado em 1972 por um casal que trocou a agitação do Rio pela paz do campo, o Hotel Daniela mantém os princípios de simplicidade e capricho. Localizado em uma linda casa de campo com jardim cortado pelo Ribeirão das Pedras. Oferece um ambiente familiar e acolhedor, ideal para quem busca descanso com bom custo-benefício.",
      location: "R. Santa Rita, 1",
      rating: 4.5,
      whatsapp: "24992649464",
      instagram: "https://www.instagram.com/hoteldanielapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d3961604-Reviews-Hotel_Daniela-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/daniela.pt-br.html",
      tags: ["familiar", "simplicidade", "custo-benefício", "piscina", "histórico", "tranquilidade", "rio"]
    },
    {
      id: 'hotel-girassol',
      title: "Hotel Girassol",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-girassol.png",
      description: "Conforto e lazer para toda a família com excelente estrutura.",
      fullInfo: "Situado em Penedo, o Hotel Girassol dispõe de banheira de hidromassagem e piscina ao ar livre. Oferece restaurante e bar no local, WiFi gratuito em todas as áreas e estacionamento privativo. Com ambiente familiar, dispõe de lounge compartilhado e tênis de mesa. Consolidado como uma opção segura e confortável para estadias curtas ou prolongadas.",
      location: "Av. Casa das Pedras, 766",
      rating: 4.6,
      whatsapp: "24981259155",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d3314343-Reviews-Hotel_Girassol-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/girassol.pt-br.html",
      tags: ["família", "piscina", "hidromassagem", "conforto", "limpeza", "tênis de mesa", "bar", "restaurante"]
    },
    {
      id: 'hotel-rio-penedo',
      title: "Hotel Rio Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-rio-penedo.jpg",
      description: "Homenagem à Cidade Maravilhosa e à Colônia Finlandesa.",
      fullInfo: "Com o objetivo de bem servir, oferece o conforto do seu lar em um ambiente exuberante pela natureza. Próximo a florestas, flores, pássaros e cachoeiras, além dos melhores restaurantes da região. Ideal para conhecer as belezas naturais de Penedo no Parque Nacional de Itatiaia.",
      location: "R. Harry Bertel, 110",
      rating: 4.6,
      whatsapp: "24988347410",
      instagram: "https://www.instagram.com/hotelriopenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d3174160-Reviews-Rio_Penedo_Hotel-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/rio-penedo.pt-br.html",
      tags: ["piscina", "natureza", "família", "custo-benefício", "acolhedor", "área kids", "tranquilidade"]
    },
    {
      id: 'hotel-do-sino',
      title: "Hotel do Sino",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-do-sino.jpg",
      description: "Hotel tradicional com ampla área de lazer e salas de convenções.",
      fullInfo: "O Hotel do Sino oferece 30 apartamentos e 8 chalés confortáveis com ar condicionado, TV e frigobar. Conta com duas piscinas, sauna seca, sala de ginástica e salão de jogos. Possui salas para convenções e estacionamento privativo. Une o charme da natureza com o conforto de um dos hotéis mais tradicionais de Penedo, ideal para lazer ou eventos.",
      location: "Av. Brasil, 455",
      rating: 4.6,
      whatsapp: "24993033315",
      instagram: "https://www.instagram.com/hoteldosinopenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d4512016-Reviews-Hotel_Do_Sino-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/do-sino.pt-br.html",
      tags: ["tradicional", "piscina", "centro", "sauna", "convenções", "estacionamento", "conforto"]
    },
    {
      id: 'hotel-terras-finlandia',
      title: "Hotel Terras da Finlândia",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-terras-finlandia.jpg",
      description: "Ideal para casais, no coração de Penedo.",
      fullInfo: "Localizado estrategicamente no centro, permite acesso a pé a restaurantes e shoppings (1 minuto do Shopping do Papai Noel). Arquitetura temática europeia inspirada na colonização finlandesa. Oferece piscina, sauna, espaço verde e área kids. Perfeito para lua de mel e renovação de votos.",
      location: "Av. das Mangueiras, 1815",
      rating: 4.7,
      whatsapp: "24988552225",
      instagram: "https://www.instagram.com/hotelterrasdafinlandia/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d4326748-Reviews-Hotel_Terras_da_Finlandia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/terras-da-finlandia.pt-br.html",
      tags: ["piscina", "sauna", "centro", "temático", "finlandês", "romântico", "lua de mel", "família", "área kids"]
    },
    {
      id: 'hotel-titanic',
      title: "Hotel Titanic",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-hotel-titanic.jpg",
      description: "Sofisticação e grandes momentos na entrada de Penedo.",
      fullInfo: "Localizado na entrada de Penedo, próximo a pontos turísticos e gastronômicos. Hotel de alto padrão com proposta romântica e familiar. Oferece piscina adulto e infantil, sauna, área verde e espaço para descanso. Destaque para limpeza e atendimento.",
      location: "Avenida Nova Penedo, s/n - Nova Penedo",
      rating: 4.8,
      whatsapp: "24935008242",
      instagram: "https://www.instagram.com/hoteltitanicpenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d25259440-Reviews-Hotel_Titanic_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/titanic-penedo.pt-br.html",
      tags: ["piscina", "sauna", "sofisticado", "romântico", "família", "limpeza", "atendimento", "entrada de penedo"]
    },
    {
      id: 'pousada-aurora-mantiqueira',
      title: "Pousada Aurora da Mantiqueira",
      category: "Hospedagem",
      isPremium: true,
      image: "/assets/imagens/logos/logo-pousada-aurora-mantiqueira.jpg",
      description: "A pousada mais bem avaliada de Penedo (Nota 9,8). Refúgio dos sonhos a apenas 1,2km do centro com café artesanal and alma familiar.",
      descricao_longa: "Nascida do sonho de Sandro e sua família de oferecer um refúgio de paz na serra, a Pousada Aurora da Mantiqueira combina silêncio e natureza a apenas 1,2km do centro. Com nota 9,8 no Booking.com e mais de 100 avaliações 5 estrelas, somos o destino perfeito para casais in a viagem romântica, famílias que buscam desacelerar e viajantes que não abrem mão de uma estadia pet friendly com seus cães.",
      fullInfo: "Localizada estrategicamente perto dos principais atrativos (como a Pequena Finlândia, Casa do Papai Noel, Fábrica de Chocolate e centrinho), a pousada proporciona o equilíbrio ideal entre tranquilidade e conveniência. Oferecemos piscina ao ar livre com vista panorâmica das montanhas, jardim preservado e estacionamento privativo grátis. Nossas acomodações contam com ar-condicionado, TV de tela plana, e opções exclusivas com varanda privativa. Um dos maiores destaques da experiência é o nosso café da manhã artesanal, preparado com carinho a partir de autênticas receitas de família.",
      location: "R. Francisco José de Barros, 220",
      rating: 4.8,
      whatsapp: "24992576384",
      instagram: "https://www.instagram.com/pousadaauroradamantiqueira/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d21035987-Reviews-Pousada_Aurora_da_Mantiqueira-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-aurora-da-mantiqueira.pt-br.html",
      galeria: [
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-1.jpg",
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-2.jpg",
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-3.jpg",
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-4.jpg",
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-5.jpg",
        "/assets/imagens/premium/pousada-aurora-da-mantiqueira/galeria-6.jpg"
      ],
      tags: ["pousada", "natureza", "vista panorâmica", "serra da mantiqueira", "romântico", "casal", "piscina", "tranquilidade", "café da manhã"],
      link_video: "https://www.instagram.com/reel/DQSV0FDAQf3/"
    },
    {
      id: 'pousada-chez-nous',
      title: "Pousada Chez Nous",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-chez-nous.jpg",
      description: "Charme com influência europeia e hospitalidade familiar desde 1994.",
      fullInfo: "Fundada por Anna Wollens ('Mamie'), vinda da França, a pousada mantém um legado de amor e respeito à natureza. Localizada na Avenida Casa da Pedra, oferece um ambiente harmonioso cercado por vasta área verde. Possui piscina e espaços de convivência aconchegantes. Ideal para famílias que buscam equilíbrio entre preço, conforto e localização.",
      location: "Avenida Casa Da Pedra, 542",
      rating: 4.7,
      whatsapp: "24992148122",
      instagram: "https://www.instagram.com/pousadacheznous/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2553252-Reviews-Pousada_Chez_Nous-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/chez-nous.pt-br.html",
      tags: ["europeu", "francês", "familiar", "história", "natureza", "piscina", "aconchegante", "conforto", "preço"]
    },
    {
      id: 'pousada-lago',
      title: "Pousada do Lago",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-lago.jpg",
      description: "Comodidade e praticidade próxima ao centro, cercada por 19.000m² de natureza.",
      fullInfo: "Localizada próxima ao centro de Penedo, permite passeios a pé para fábricas de chocolate e a Casa do Papai Noel. Possui um belo lago natural, piscina com hidromassagem, salão de jogos, academia e ampla área verde. Combina o silêncio da natureza com a facilidade de acesso ao comércio local. Ideal para famílias e casais.",
      location: "Av. das Mangueiras, 200",
      rating: 4.0,
      whatsapp: "24981142566",
      instagram: "https://www.instagram.com/pousadadolagopenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2304909-Reviews-Pousada_do_Lago-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-do-lago-penedo.pt-br.html",
      tags: ["lago", "piscina", "hidromassagem", "centro", "natureza", "família", "casal", "academia", "salão de jogos", "tranquilidade", "praticidade"]
    },
    {
      id: 'pousada-penedo',
      title: "Pousada Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-penedo.jpg",
      description: "Preservando a essência e tradição finlandesa desde o início.",
      fullInfo: "Conhecida como a casa de Toivo, a Pousada Penedo está situada em um terreno cortado por um rio e cercado por farta vegetação. Mantém vivas as tradições finlandesas, recebendo hóspedes como amigos. Um lugar para voltar no tempo, com decoração do início do século passado e vasto material histórico sobre a colonização finlandesa.",
      location: "Av. da Finlândia, 270",
      rating: 4.6,
      whatsapp: "24999836588",
      instagram: "https://www.instagram.com/pousada_penedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2680265-Reviews-Pousada_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-penedo.pt-br.html",
      tags: ["tradição", "finlandesa", "história", "rio", "natureza", "piscina", "praticidade", "original"]
    },
    {
      id: 'pousada-reserva-penedo',
      title: "Pousada Reserva Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-reserva-penedo.jpg",
      description: "Paz e sossego em meio a 160 metros de margem de rio.",
      fullInfo: "Lugar perfeito para quem busca fugir da agitação urbana e experimentar sensações de paz e liberdade. Oferece fácil acesso a pé ao centro e gastronomia local. Destaque para o café da manhã artesanal e área de lazer com piscina com cascata, sauna a vapor e lounge descontraído. Possui uma belíssima passagem de rio dentro da propriedade.",
      location: "Rua Alberto João Saad, 99",
      rating: 4.8,
      whatsapp: "24981783018",
      instagram: "https://www.instagram.com/pousadareservapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2669276-Reviews-Pousada_Reserva_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-reserva-penedo.pt-br.html",
      tags: ["natureza", "rio", "tranquilidade", "cascata", "piscina", "sauna", "café da manhã", "silêncio"]
    },
    {
      id: 'pousada-santa-fe',
      title: "Pousada Santa Fe de Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-santa-fe.jpg",
      description: "Tranquilidade, aconchego e vista privilegiada da Serra da Mantiqueira.",
      fullInfo: "Localizada no Vale do Ermitão, oferece contato direto com a natureza. Possui 17 suítes, piscina panorâmica com hidromassagem aquecida, salão de jogos, sala de lareira e SPA com massagens. O café da manhã é servido à beira da piscina com vista para a serra. Ideal para casais buscando um clima romântico.",
      location: "Estr. Vale do Ermitão, 490",
      rating: 4.9,
      whatsapp: "24988058755",
      instagram: "https://www.instagram.com/santafepenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2475338-Reviews-Pousada_Santa_Fe_de_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-santa-fe-penedo.pt-br.html",
      tags: ["piscina panorâmica", "hidromassagem", "spa", "massagem", "romântico", "casal", "natureza", "serra da mantiqueira", "vale do ermitão", "aconchego", "tranquilidade"]
    },
    {
      id: 'pousada-do-sol',
      title: "Pousada do Sol de Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-do-sol.jpg",
      description: "Hospedagem familiar com piscina and sauna pertinho do museu.",
      fullInfo: "A Pousada do Sol oferece piscina ao ar livre, sauna, serviço de quarto e Wi-Fi gratuito. Localizada a apenas 9 minutos a pé do Museu Finlandês, é uma opção prática e acolhedora. Os quartos possuem ar-condicionado, TV e alguns contam com varanda privativa. Ideal para quem busca boa localização com custo-benefício.",
      location: "Av. das Mangueiras, 1905",
      rating: 4.6,
      whatsapp: "24988292489",
      instagram: "https://www.instagram.com/pousadadosolpenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d3361473-Reviews-Pousada_Do_Sol_De_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-do-sol-penedo.pt-br.html",
      tags: ["piscina", "sauna", "centro", "familiar", "custo-benefício", "acolhedor"]
    },
    {
      id: 'pousada-terraco',
      title: "Pousada Terraço Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-terraco.jpg",
      description: "Uma das melhores vistas da Serra da Índia com excelente custo-benefício.",
      fullInfo: "Localizada a 200m da Mata Atlântica, oferece tranquilidade e som de cachoeira. Possui decoração rústica, sala de leitura, jogos, exercícios, piscina com hidromassagem coletiva, sauna seca e a vapor. Serve um delicioso café colonial. Muito procurada por casais jovens que buscam boa estrutura com preço acessível.",
      location: "Estr. Vale do Ermitão, 520",
      rating: 4.7,
      whatsapp: "24988492525",
      instagram: "https://www.instagram.com/terraco_penedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2591083-Reviews-Pousada_Terraco_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-terraasso-penedo.pt-br.html",
      tags: ["vista", "serra da índia", "custo-benefício", "piscina", "hidromassagem", "sauna", "rústico", "natureza", "casal", "café colonial"]
    },
    {
      id: 'pousada-villa-luna',
      title: "Pousada Villa Luna",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-pousada-villa-luna.jpg",
      description: "Proposta romântica e boutique no coração de Penedo.",
      fullInfo: "Localizada na avenida principal, a apenas 200m do centro. Oferece um ambiente harmonioso com jardins, redes, árvores frutíferas e observação de aves. Conta com piscina, sauna, massagens relaxantes e acomodações confortáveis com formatos diferenciados. Atendimento personalizado e exclusivo para quem busca tranquilidade e proximidade do centro.",
      location: "Av. das Mangueiras, 1457",
      rating: 4.9,
      whatsapp: "24993173956",
      instagram: "https://www.instagram.com/pousadavillaluna/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d2475396-Reviews-Pousada_Villa_Luna-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-villa-luna.pt-br.html",
      tags: ["boutique", "romântico", "centro", "jardim", "piscina", "sauna", "massagem", "atendimento", "exclusivo", "natureza"]
    },
    {
      id: 'vert-hotel',
      title: "Vert Hotel Penedo",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-vert-hotel.jpg",
      description: "Experiência única de relaxamento e conexão com a natureza.",
      fullInfo: "Hotel boutique e Spa rodeado por exuberante área verde. Oferece piscina aquecida, spa exclusivo, sauna e massagens. Próximo ao centro, mas com total tranquilidade. Foco em bem-estar e experiência premium. Ideal para casais.",
      location: "R. do Lago, 60",
      rating: 4.9,
      whatsapp: "2435120520",
      instagram: "https://www.instagram.com/vert_hotelspa/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d32848923-Reviews-Vert_Hotel_Spa-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/vert-penedo.pt-br.html",
      tags: ["spa", "piscina aquecida", "sauna", "massagem", "boutique", "premium", "natureza", "bem-estar", "romântico", "casal"]
    },
    {
      id: 'vila-francesa-hotel',
      title: "Vila Francesa Hotel",
      category: "Hospedagem",
      image: "/assets/imagens/logos/logo-vila-francesa-hotel.jpg",
      description: "Charme europeu e hospitalidade no coração de Penedo.",
      fullInfo: "Localizado no coração de Penedo, o Vila Francesa Hotel combina tranquilidade com a conveniência de estar na rua principal, a apenas 100m da Vila da Gula. Hotel pet friendly, com área de lazer convidativa e estilo europeu marcante, ideal para fotos e momentos inesquecíveis. Perfeito para casais, famílias e viagens de descanso.",
      location: "Av. Brasil, 653",
      rating: 4.8,
      whatsapp: "24978346350",
      instagram: "https://www.instagram.com/vilafrancesahotel/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d28140936-Reviews-Vila_Francesa_Hotel-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/vila-francesa.pt-br.html",
      tags: ["europeu", "centro", "pet friendly", "piscina", "charme", "fotos", "romântico"]
    },
    {
      id: 'pousada-rainha-da-mata',
      title: "Pousada Rainha da Mata",
      category: "Hospedagem",
      isPremium: true,
      image: "/assets/imagens/logos/logo-pousada-rainha-mata.jpg",
      description: "Paz, sossego e contato exuberante com a natureza a apenas 800m do centro de Penedo.",
      fullInfo: "Localizada a apenas 800m do centro de Penedo, a Pousada Rainha da Mata oferece acesso fácil a pontos como Pequena Finlândia (1km) e Parque Nacional de Itatiaia (6,3km). Com mais de 1.500m² de área verde, piscina com cascata, sauna a vapor e café da manhã artesanal, oferecemos o refúgio ideal para quem busca tranquilidade junto ao som do rio que corta a propriedade e da nossa árvore centenária.",
      location: "Rua Canto Verde, 120, Penedo - RJ",
      rating: 4.8,
      whatsapp: "24993111367",
      instagram: "https://www.instagram.com/pousadarainhadamata/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Hotel_Review-g2427181-d7359137-Reviews-Pousada_Rainha_Da_Mata-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      link_booking: "https://www.booking.com/hotel/br/pousada-rainha-da-mata.pt-br.html",
      galeria: [
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-1.jpg",
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-2.jpg",
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-3.jpg",
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-4.jpg",
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-5.jpg",
        "/assets/imagens/premium/pousada-rainha-da-mata/galeria-6.jpg"
      ],
      tags: ["piscina", "natureza", "rio", "sauna", "centro", "tranquilidade", "café da manhã", "familiar"],
      link_video: "https://www.instagram.com/reel/DR43wyHEQVH/"
    }
  ],
  'gastronomia': [
    {
      id: 'aglio-e-olio',
      title: "Aglio e Olio",
      category: "Italiana",
      image: "/assets/imagens/logos/logo-aglio-e-olio.jpg",
      description: "Massas artesanais e ambiente familiar aconchegante.",
      fullInfo: "Para os amantes da culinária italiana, oferece um ambiente familiar e comida com gostinho de 'feita em casa'. Focado em massas artesanais, nhoques, lasanhas e molhos encorpados.",
      location: "Rua das Velas, 220",
      hours: "Consulte horários",
      rating: 4.5,
      instagram: "https://www.instagram.com/aglioeoliopenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d2424454-Reviews-Aglio_e_Olio-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["massa", "italiana", "nhoque", "lasanha", "vinho", "família", "aconchegante", "climatizado", "jantar", "almoço", "centro"]
    },
    {
      id: 'bazzini-pizzeria',
      title: "Bazzini Pizzeria",
      category: "Pizzaria",
      image: "/assets/imagens/logos/logo-bazzini-pizzeria.jpg",
      description: "Novo conceito em pizzaria com tradição italiana.",
      fullInfo: "Um novo conceito em pizzaria em Penedo no Rio de Janeiro. Ambiente aconchegante, familiar e com tradição italiana. Oferecemos serviço de mesa e opção para levar.",
      location: "Av. das Mangueiras, 1849",
      hours: "Almoço, Jantar",
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Bazzini+Pizzeria+Penedo+Av.+das+Mangueiras+1849",
      instagram: "https://www.instagram.com/bazzinipizzeria/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d27756614-Reviews-Bazzini_Pizzeria-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["pizza", "pizzaria", "italiana", "aconchegante", "familiar", "almoço", "jantar", "para levar", "serviço de mesa"]
    },
    {
      id: 'borbulha-penedo',
      title: "Borbulha de Penedo",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-borbulha-penedo.jpg",
      description: "Ambiente climatizado com tradicional coleção de discos de vinil.",
      fullInfo: "Borbulha de Penedo foi inaugurado em 05 de junho de 2019. Possui vários ambientes, com serviço a la Carte. Ambiente climatizado e com a tradicional coleção de Discos de Vinil.",
      location: "Av. das Mangueiras, 1771",
      hours: "Almoço, Jantar",
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Borbulha+de+Penedo+Av.+das+Mangueiras+1771",
      instagram: "https://www.instagram.com/borbulha.penedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d17648707-Reviews-Borbulha_de_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["a la carte", "climatizado", "vinil", "música", "discos", "almoço", "jantar", "serviço de mesa"]
    },
    {
      id: 'botegare',
      title: "Botegare - Penedo",
      category: "Contemporânea",
      image: "/assets/imagens/logos/logo-botegare.jpg",
      description: "Gastronomia Contemporânea e de fusão com influências europeias.",
      fullInfo: "Restaurante de gastronomia Contemporânea e de fusão. Nosso objetivo e gerar boas experiências sensoriais aos nossos clientes. Nosso cardápio privilegia clássicos da Itália, França, Portugal e Espanha. Nossa parte de fusão, inclui ingredientes brasileiros dando uma nova roupagem aos clássicos. Possuímos uma excelente carta de vinho com mais de 60 rótulos de países diferentes. Nosso preço é de loja! Adega climatizada e aberta a visitação e escolha de nossos clientes. Nosso espaço é um diferencial à parte. Ambiente amplo, aberto onde a estrela é a natureza!",
      location: "Av. Casa das Pedras, 991",
      hours: "Almoço, Jantar, Drinks",
      rating: 5.0,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Botegare+Penedo+Av.+Casa+das+Pedras+991",
      instagram: "https://www.instagram.com/botegarepenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d22954089-Reviews-Botegare_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["contemporânea", "fusão", "vinho", "adega", "natureza", "almoço", "jantar", "drinks", "itália", "frança", "portugal", "espanha", "experiência sensorial", "familiar", "restaurante privativo"]
    },
    {
      id: 'braseiro-gaucho',
      title: "Braseiro Gaúcho",
      category: "Churrasco",
      image: "/assets/imagens/logos/logo-braseiro-gaucho.jpg",
      description: "O melhor do churrasco gaúcho na serra.",
      fullInfo: "A opção ideal para quem não abre mão de um excelente e farto churrasco. Focado em carnes nobres e na tradição gaúcha, com bife de chorizo, picanha e ancho como carros-chefes.",
      location: "Rua das Velas, 76",
      hours: "Consulte horários",
      rating: 4.5,
      instagram: "https://www.instagram.com/braseirogaucho/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d4526259-Reviews-Restaurante_Braseiro-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["churrasco", "carne", "picanha", "chorizo", "ancho", "gaúcho", "farto", "buffet", "almoço", "jantar", "centro"]
    },
    {
      id: 'casa-da-picanha',
      title: "Casa da Picanha",
      category: "Carnes",
      isPremium: true,
      image: "/assets/imagens/logos/logo-casa-da-picanha.jpg",
      description: "Cortes nobres e ambiente familiar. Possuímos 2 unidades para melhor atendê-lo.",
      fullInfo: "Com 2 unidades em Penedo, a Casa da Picanha é a escolha certa para os amantes de carne, sendo um ambiente perfeito para quem viaja em família. Especializada em cortes nobres, com destaque absoluto para a picanha servida na chapa, acompanhada de guarnições tradicionais e fartas.",
      location: "Av. das Mangueiras - Penedo",
      hours: "Consulte horários",
      rating: 4.6,
      whatsapp: "24999999999",
      instagram: "https://www.instagram.com/casadapicanhapenedo_rj/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d4767980-Reviews-Casa_Da_Picanha_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      galeria: [
        "/assets/imagens/premium/casa-da-picanha/galeria-1.jpg",
        "/assets/imagens/premium/casa-da-picanha/galeria-2.jpg",
        "/assets/imagens/premium/casa-da-picanha/galeria-3.jpg",
        "/assets/imagens/premium/casa-da-picanha/galeria-4.jpg",
        "/assets/imagens/premium/casa-da-picanha/galeria-5.jpg",
        "/assets/imagens/premium/casa-da-picanha/galeria-6.jpg"
      ],
      tags: ["picanha", "carne", "chapa", "família", "espaço kids", "almoço", "jantar", "farto", "tradicional", "centro"],
      link_video: "https://www.instagram.com/reel/DZyAR9NDaJH/"
    },
    {
      id: 'casa-do-fritz',
      title: "Casa do Fritz",
      category: "Alemã",
      image: "/assets/imagens/logos/logo-casa-do-fritz.jpg",
      description: "Autêntica experiência germânica e cervejas artesanais.",
      fullInfo: "Um verdadeiro clássico de Penedo para quem busca a autêntica experiência germânica aliada a excelentes cervejas artesanais. Especializado em culinária alemã, os destaques são o joelho de porco (Eisbein), o mix de salsichões, chucrute e as harmonizações com os chopes da própria casa.",
      location: "Av. das Mangueiras, 518 - Penedo",
      hours: "Consulte horários",
      rating: 4.7,
      instagram: "https://www.instagram.com/casadofritz/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d2424437-Reviews-Casa_do_Fritz-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["alemã", "cerveja artesanal", "chopp", "eisbein", "joelho de porco", "salsichão", "chucrute", "música ao vivo", "germânica", "centro"]
    },
    {
      id: 'enoteca-serrana',
      title: "Enoteca Serrana",
      category: "Contemporânea",
      image: "/assets/imagens/logos/logo-enoteca-serrana.jpg",
      description: "Restaurante Contemporâneo com opções vegetarianas.",
      fullInfo: "Restaurante Contemporâneo adequado para vegetarianos e com opções sem glúten. Aceita cartões de crédito: American Express, Mastercard, Visa.",
      location: "Av. Casa das Pedras, 490",
      hours: "Almoço, Jantar",
      rating: 4.8,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Enoteca+Serrana+Penedo+Av.+Casa+das+Pedras+490",
      instagram: "https://www.instagram.com/enotecaserrana/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d9592913-Reviews-Enoteca_Serrana-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["contemporânea", "vegetariano", "sem glúten", "vinho", "enoteca", "almoço", "jantar", "cartão de crédito"]
    },
    {
      id: 'estancia-penedo',
      title: "Estância Penedo",
      category: "Churrasco",
      image: "/assets/imagens/logos/logo-estancia-penedo.jpg",
      description: "Self service a quilo com churrasco e a la carte variado.",
      fullInfo: "No restaurante Estância Penedo trabalhamos com self service a quilo com churrasco e uma enorme variedade de quentes e frios, das 11:30 hr ate as 16:00 hr, após esse horário trabalhamos com a la carte com diversos pratos, como, rodízio de fondue, carnes na brasa, peixes e caldos todos muito bem servidos.",
      location: "Av. das Mangueiras, 1775",
      hours: "11:30 - 16:00 (Buffet), 16:00 - 23:00 (A la carte)",
      rating: 4.7,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Estância+Penedo+Av.+das+Mangueiras+1775",
      instagram: "https://www.instagram.com/estanciapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d8800817-Reviews-Estancia_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["self service", "quilo", "churrasco", "buffet", "a la carte", "fondue", "carnes", "brasa", "peixes", "caldos", "almoço", "jantar", "centro"]
    },
    {
      id: 'jardim-secreto',
      title: "Jardim Secreto",
      category: "Contemporânea",
      image: "/assets/imagens/logos/logo-jardim-secreto.jpg",
      description: "Romantismo e alta gastronomia em ambiente intimista.",
      fullInfo: "Se o foco do seu roteiro é romantismo e alta gastronomia, este é o lugar. O ambiente é intimista e cercado por muita natureza. Culinária contemporânea e bistrô, com destaque para risotos, carnes nobres e peixes requintados.",
      location: "Av. das Mangueiras, 506 - Penedo",
      hours: "Consulte horários",
      rating: 4.9,
      instagram: "https://www.instagram.com/restaurante_jardimsecreto/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d2307509-Reviews-Jardim_Secreto-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["romântico", "alta gastronomia", "contemporânea", "bistrô", "risoto", "peixe", "natureza", "intimista", "jantar", "celebração", "luxo"]
    },
    {
      id: 'jazz-village',
      title: "Jazz Village Penedo",
      category: "Contemporânea",
      image: "/assets/imagens/logos/logo-jazz-village.jpg",
      description: "Música de qualidade e gastronomia sofisticada.",
      fullInfo: "Uma mistura perfeita de música de altíssima qualidade com gastronomia sofisticada, localizado dentro do Hotel Pequena Suécia. Famoso pelas sequências de fondue e pratos que misturam a culinária contemporânea com toques nórdicos.",
      location: "Rua Toivo Suni, 33 - Penedo",
      hours: "Consulte horários",
      rating: 4.8,
      instagram: "https://www.instagram.com/jazzvillagepenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d9582481-Reviews-Restaurante_Jazz_Village-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["jazz", "blues", "música", "fondue", "sofisticado", "nórdico", "contemporânea", "jantar", "hotel", "cultura", "show"]
    },
    {
      id: 'kaiten-sushi',
      title: "Kaiten Sushi",
      category: "Japonesa",
      image: "/assets/imagens/logos/logo-kaiten-sushi.jpg",
      description: "O melhor da culinária japonesa em Penedo.",
      fullInfo: "O Kaiten Sushi oferece uma experiência autêntica da culinária japonesa, com sushis, sashimis e pratos quentes preparados com ingredientes frescos e selecionados.",
      location: "Av. Casa de Pedra, 785",
      hours: "12:00 - 23:30",
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Kaiten+Sushi+Penedo+Av.+Casa+de+Pedra+785",
      instagram: "https://www.instagram.com/kaitensushipenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d12694174-Reviews-Kaiten_Sushi-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["japonesa", "sushi", "sashimi", "temaki", "peixe cru", "oriental", "almoço", "jantar", "centro"]
    },
    {
      id: 'loazo-resto',
      title: "Loazô Restô",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-loazo-resto.jpg",
      description: "Restaurante familiar no Alto Penedo.",
      fullInfo: "O Loazô Restô oferece um ambiente familiar e acolhedor no Alto Penedo. Aceita cartão de crédito e oferece serviços para levar e restaurante privativo.",
      location: "Rua K, Alto Penedo",
      hours: "Almoço, Jantar",
      rating: 5.0,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Loazô+Restô+Penedo+Rua+K+Alto+Penedo",
      instagram: "https://www.instagram.com/loazoresto/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d23360419-Reviews-Loazo_Resto-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["alto penedo", "familiar", "para levar", "restaurante privativo", "serviço de mesa", "almoço", "jantar", "cartão de crédito"]
    },
    {
      id: 'petit-gourmet',
      title: "Petit Gourmet",
      category: "Contemporânea",
      image: "/assets/imagens/logos/logo-petit-gourmet.jpg",
      description: "Ambiente charmoso e sequências de fondue premiadas.",
      fullInfo: "Um ambiente charmoso e acolhedor no centro de Penedo. O cardápio transita entre a culinária contemporânea e os clássicos da serra, com destaque para as sequências de fondue e risotos cremosos.",
      location: "Avenida Brasil, 800",
      hours: "Consulte horários",
      rating: 4.7,
      instagram: "https://www.instagram.com/petitgourmet.penedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d7316373-Reviews-Restaurante_Petit_Gourmet-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["fondue", "contemporânea", "risoto", "vinho", "aconchegante", "charme", "jantar", "centro", "serra", "romântico"]
    },
    {
      id: 'pizza-da-villa',
      title: "Pizza da Villa",
      category: "Pizzaria",
      image: "/assets/imagens/logos/logo-pizza-da-villa.jpg",
      description: "Pizzas de fermentação natural em forno a lenha.",
      fullInfo: "Localizada no coração turístico de Penedo, oferece pizzas com massa de fermentação natural, assadas em forno a lenha, com ingredientes de alta qualidade e sabores exclusivos da região.",
      location: "Av. das mangueiras, 1579",
      hours: "Consulte horários",
      rating: 4.9,
      instagram: "https://www.instagram.com/pizzadavillapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d3607740-Reviews-Pizza_da_Villa-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["pizza", "fermentação natural", "forno a lenha", "artesanal", "jantar", "descontraído", "moderno", "centro", "família", "amigos"]
    },
    {
      id: 'querencia',
      title: "Querência",
      category: "Carnes",
      image: "/assets/imagens/logos/logo-querencia.jpg",
      description: "Picanha na pedra, bacalhau e fondues em ambiente rústico.",
      fullInfo: "Pratos como picanha na pedra e bacalhau, além de fondues e vinhos, em espaço rústico e familiar com varanda.",
      location: "Av. das Mangueiras, 2510",
      hours: "12:00 - 23:00",
      rating: 4.7,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante+Querência+Penedo+Av.+das+Mangueiras+2510",
      instagram: "https://www.instagram.com/restaurantequerencia/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d8394054-Reviews-Querencia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["picanha", "pedra", "bacalhau", "fondue", "vinho", "rústico", "familiar", "varanda", "almoço", "jantar", "centro"]
    },
    {
      id: 'rei-das-trutas',
      title: "Rei das Trutas",
      category: "Peixes",
      image: "/assets/imagens/logos/logo-rei-das-trutas.jpg",
      description: "O peixe símbolo de Penedo em sua melhor forma.",
      fullInfo: "Como a truta é o ingrediente símbolo de Penedo, este restaurante é parada obrigatória. Oferece o peixe em dezenas de preparos: com amêndoas, alcaparras, molho de maracujá e muito mais.",
      location: "Av. das Mangueiras, 20 - Penedo",
      hours: "Consulte horários",
      rating: 4.7,
      instagram: "https://www.instagram.com/reidastrutas/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d3823178-Reviews-Rei_das_Trutas-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["truta", "peixe", "frutos do mar", "tradicional", "almoço", "jantar", "centro", "família", "clássico"]
    },
    {
      id: 'restaurante-finlandes',
      title: "Restaurante Korvapuusti",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-restaurante-finlandes.jpg",
      description: "O melhor da culinária nórdica e trutas.",
      fullInfo: "Especializado em trutas e pratos típicos finlandeses, o Korvapuusti é uma parada obrigatória para quem quer conhecer a história através do paladar.",
      location: "Rua das Velas, 101",
      hours: "12:00 - 23:00",
      rating: 4.0,
      instagram: "https://www.instagram.com/korvapuustipenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d6028779-Reviews-Korvappusti-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["finlandês", "nórdico", "truta", "típico", "buffet", "almoço", "jantar", "centro", "história", "cultura"]
    },
    {
      id: 'truta-viva',
      title: "Truta Viva",
      category: "Experiência",
      image: "/assets/imagens/logos/logo-truta-viva.jpg",
      description: "Pescaria e peixes frescos em meio à natureza.",
      fullInfo: "Mais do que um restaurante, é uma verdadeira experiência ecológica. O cliente pode pescar a própria truta nos lagos da propriedade, e ela é preparada na hora! Peixes fresquíssimos com tempero caseiro.",
      location: "Alto Penedo",
      hours: "Consulte horários",
      rating: 4.5,
      instagram: "https://www.instagram.com/restaurantetrutaviva/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d2424446-Reviews-Truta_Viva-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["pescaria", "pesque e pague", "truta", "fresco", "natureza", "experiência", "ecológico", "família", "crianças", "alto penedo", "almoço"]
    },
    {
      id: 'zero-a-zero',
      title: "Zero a Zero",
      category: "Choperia",
      image: "/assets/imagens/logos/logo-zero-a-zero.jpg",
      description: "Seu novo ponto de encontro em Penedo com ambiente sofisticado.",
      fullInfo: "Restaurante e Choperia Zero a Zero, seu novo ponto de encontro em Penedo-RJ. Com uma estrutura única, ambiente sofisticado e agradável. Cardápio variado com diversas opções de petiscos, pratos de carnes, massas, peixes, aves, fondues, e muito mais. Conheça também nossa variedade de cervejas, chopes, e vinhos. Somos a casa oficial do happy hour!",
      location: "Rua das Velas, 120",
      hours: "Almoço, Jantar",
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Zero+a+Zero+Penedo+Rua+das+Velas+120",
      instagram: "https://www.instagram.com/zeroazerochoperia/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d15007643-Reviews-Zero_a_Zero-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["choperia", "chopp", "cerveja", "happy hour", "petiscos", "fondue", "sofisticado", "almoço", "jantar", "centro", "ponto de encontro"]
    },
    {
      id: 'tonttulakki-suklaat',
      title: "Tonttulakki Suklaat",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-tonttulakki-suklaat.jpg",
      description: "Chocolates artesanais com o verdadeiro sabor finlandês.",
      fullInfo: "Chocolates artesanais com o verdadeiro sabor finlandês.",
      location: "Rua das velas 100 – Penedo",
      hours: "Consulte horários",
      rating: 4.8,
      instagram: "https://www.instagram.com/chocolatestonttulakki/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2348871-d5647708-Reviews-Tonttulakki-Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["chocolate", "artesanal", "finlandês", "doces", "sobremesa", "gastronomia", "centro"]
    },
    {
      id: 'lugano-penedo',
      title: "Lugano Penedo",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-lugano-penedo.jpg",
      description: "A tradição do chocolate de Gramado agora em Penedo.",
      fullInfo: "A tradição do chocolate de Gramado agora em Penedo.",
      location: "Av. das Mangueiras, 1581 – Penedo",
      hours: "Consulte horários",
      rating: 4.7,
      instagram: "https://www.instagram.com/chocolatelugano.penedo",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d28156070-Reviews-Lugano_Gramado_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["chocolate", "gramado", "artesanal", "doces", "sobremesa", "gastronomia", "café", "centro"]
    },
    {
      id: 'lolita-penedo',
      title: "Lolita Penedo",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-lolita-penedo.jpg",
      description: "Cafeteria charmosa com doces e sobremesas inesquecíveis.",
      fullInfo: "Cafeteria charmosa com doces e sobremesas inesquecíveis.",
      location: "Avenida das Mangueiras, 1645, Loja 2, Penedo",
      hours: "Consulte horários",
      rating: 4.7,
      instagram: "https://www.instagram.com/lolitapenedo/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d23122914-Reviews-Lolita_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["cafeteria", "doces", "sobremesas", "café", "charmoso", "gastronomia", "centro"]
    },
    {
      id: 'kahvila-cafe',
      title: "Kahvila Café",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-kahvila-cafe.jpg",
      description: "Ambiente acolhedor para o seu café da tarde.",
      fullInfo: "Ambiente acolhedor para o seu café da tarde.",
      location: "Av. das Mangueiras, 1815 - Loja 1, Penedo",
      hours: "Consulte horários",
      rating: 4.6,
      instagram: "https://www.instagram.com/kahvilacafe.br/",
      tags: ["café", "cafeteria", "acolhedor", "café da tarde", "gastronomia", "centro"]
    },
    {
      id: 'santa-claus-burger',
      title: "Santa Claus Burger",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-santa-claus-burger.jpg",
      description: "Hamburgueria de excelência ao lado da Pequena Finlândia. Sabor e qualidade com nota 4.8!",
      fullInfo: "Localizada no coração de Penedo, a poucos passos da Casa do Papai Noel, o Santa Claus Burger é uma das hamburguerias mais bem avaliadas da região. Com um ambiente agradável (acessível para cadeirantes e com estacionamento gratuito), é o lugar perfeito para famílias e grupos. Eles oferecem opções para comer no local, delivery e retirada, além de um cardápio incrível de sobremesas e lanches que agradam adultos e crianças.",
      is_premium: false,
      slug: "santa-claus-burger",
      tag_destaque: "Top Avaliação",
      descricao_longa: "Localizada no coração de Penedo, a poucos passos da Casa do Papai Noel, o Santa Claus Burger é uma das hamburguerias mais bem avaliadas da região. Com um ambiente agradável (acessível para cadeirantes e com estacionamento gratuito), é o lugar perfeito para famílias e grupos. Eles oferecem opções para comer no local, delivery e retirada, além de um cardápio incrível de sobremesas e lanches que agradam adultos e crianças.",
      link_whatsapp: "https://wa.me/5524993017228",
      instagram: "https://www.instagram.com/santaclausburger",
      link_instagram: "https://www.instagram.com/santaclausburger",
      link_maps: "https://maps.google.com/?cid=17037218314129758382",
      mapUrl: "https://maps.google.com/?cid=17037218314129758382",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d24100050-Reviews-Santa_Claus_Burger-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.8,
      tags: ["hambúrguer", "hamburgueria", "artesanal", "papai noel", "centro", "sobremesas", "delivery", "família", "kids", "acessível"]
    },
    {
      id: 'maria-cuisine',
      title: "Maria Cuisine de Famille",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-maria-cuisine.jpg",
      description: "Alta gastronomia, ambiente acolhedor e carta de vinhos selecionada na principal avenida de Penedo.",
      fullInfo: "Localizado na Av. das Mangueiras, o Maria Cuisine de Famille é sinônimo de excelência em Penedo, ostentando uma avaliação quase perfeita (4.9 estrelas). O restaurante se destaca por oferecer pratos refinados de dar água na boca, excelentes opções vegetarianas, coquetéis artesanais e uma ótima carta de vinhos. O ambiente é acolhedor e impecável, ideal para jantares românticos a dois ou celebrações em família. Eles aceitam reservas e possuem estacionamento próprio gratuito no local.",
      is_premium: false,
      slug: "maria-cuisine",
      tag_destaque: "Excelente Avaliação",
      descricao_longa: "Localizado na Av. das Mangueiras, o Maria Cuisine de Famille é sinônimo de excelência em Penedo, ostentando uma avaliação quase perfeita (4.9 estrelas). O restaurante se destaca por oferecer pratos refinados de dar água na boca, excelentes opções vegetarianas, coquetéis artesanais e uma ótima carta de vinhos. O ambiente é acolhedor e impecável, ideal para jantares românticos a dois ou celebrações em família. Eles aceitam reservas e possuem estacionamento próprio gratuito no local.",
      link_whatsapp: "https://wa.me/5524993194229",
      instagram: "https://www.instagram.com/mariacuisinedefamille/",
      link_instagram: "https://www.instagram.com/mariacuisinedefamille/",
      link_maps: "https://maps.google.com/?cid=11898708662588849032",
      mapUrl: "https://maps.google.com/?cid=11898708662588849032",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2348871-d32885364-Reviews-Maria_Cuisine_De_Famille-Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.9,
      tags: ["alta gastronomia", "vinho", "romântico", "sofisticado", "vegetariano", "coquetéis", "reservas", "estacionamento", "av. das mangueiras", "almoço", "jantar"]
    },
    {
      id: 'vanilla-patisserie',
      title: "Vanilla Pâtisserie",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-vanilla-patisserie.jpg",
      description: "Doces finos, artesanais e sobremesas irresistíveis. A parada perfeita para o seu café da tarde em Penedo.",
      fullInfo: "Localizada de forma charmosa no subsolo do Maria Cuisine, na movimentada Av. das Mangueiras, a Vanilla Pâtisserie é um verdadeiro pedacinho da França em Penedo. Com uma avaliação de excelência (4.8 estrelas), o local encanta pelos doces finos, tortas, sobremesas delicadas e cafés deliciosos. É o ambiente perfeito para aquela pausa relaxante durante o seu passeio pela cidade. O espaço conta com ótimo atendimento e aceita diversas formas de pagamento, incluindo cartões e aproximação (NFC). Funciona de terça a domingo!",
      is_premium: false,
      slug: "vanilla-patisserie",
      tag_destaque: "Confeitaria Fina",
      descricao_longa: "Localizada de forma charmosa no subsolo do Maria Cuisine, na movimentada Av. das Mangueiras, a Vanilla Pâtisserie é um verdadeiro pedacinho da França em Penedo. Com uma avaliação de excelência (4.8 estrelas), o local encanta pelos doces finos, tortas, sobremesas delicadas e cafés deliciosos. É o ambiente perfeito para aquela pausa relaxante durante o seu passeio pela cidade. O espaço conta com ótimo atendimento e aceita diversas formas de pagamento, incluindo cartões e aproximação (NFC). Funciona de terça a domingo!",
      instagram: "https://www.instagram.com/vanilla.penedo/?hl=pt",
      link_instagram: "https://www.instagram.com/vanilla.penedo/?hl=pt",
      link_maps: "https://maps.google.com/?cid=16059561874423453573",
      mapUrl: "https://maps.google.com/?cid=16059561874423453573",
      rating: 4.8,
      tags: ["confeitaria", "doces finos", "cafeteria", "café", "sobremesa", "tortas", "subsolo", "frança", "gastronomia", "chique"]
    },
    {
      id: 'delicias-da-carol',
      title: "Delicias da Carol",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-delicias-da-carol.jpg",
      description: "Cafeteria charmosa e super bem avaliada na principal avenida de Penedo. Doces, cafés e muito sabor!",
      fullInfo: "Localizada na movimentada Av. das Mangueiras, a Delicias da Carol é o refúgio perfeito para os amantes de um bom café. Com uma avaliação impressionante de 4.9 estrelas, o espaço é famoso por seu atendimento acolhedor, doces divinos e ambiente familiar (ótimo para ir com crianças). Além dos tradicionais cafés, eles também servem vinhos para relaxar no fim de tarde. O local conta com entrada com acessibilidade, aceita pagamentos via cartão e aproximação (NFC), e funciona todos os dias da semana (com horário estendido até às 23h aos sábados!).",
      is_premium: false,
      slug: "delicias-da-carol",
      tag_destaque: "Top Avaliação",
      descricao_longa: "Localizada na movimentada Av. das Mangueiras, a Delicias da Carol é o refúgio perfeito para os amantes de um bom café. Com uma avaliação impressionante de 4.9 estrelas, o espaço é famoso por seu atendimento acolhedor, doces divinos e ambiente familiar (ótimo para ir com crianças). Além dos tradicionais cafés, eles também servem vinhos para relaxar no fim de tarde. O local conta com entrada com acessibilidade, aceita pagamentos via cartão e aproximação (NFC), e funciona todos os dias da semana (com horário estendido até às 23h aos sábados!).",
      link_whatsapp: "https://wa.me/5524999716592",
      instagram: "https://www.instagram.com/deliciascarolpenedo/",
      link_instagram: "https://www.instagram.com/deliciascarolpenedo/",
      link_maps: "https://maps.google.com/?cid=15927698586743302151",
      mapUrl: "https://maps.google.com/?cid=15927698586743302151",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d15143777-Reviews-Delicias_da_Carol-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.9,
      tags: ["cafeteria", "café", "doces", "vinhos", "familiar", "kids", "acessível", "nfc", "gastronomia", "av. das mangueiras"]
    },
    {
      id: 'fue-gelateria',
      title: "Fuê Gelateria",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-fue-gelateria.jpg",
      description: "Gelatos artesanais deliciosos e cafés especiais no coração da Pequena Finlândia!",
      fullInfo: "Localizada na charmosa Rua das Velas, bem no centro da Pequena Finlândia, a Fuê Gelateria é parada obrigatória para se refrescar e adoçar o passeio. Com quase mil avaliações positivas, o local é famoso por seus gelatos cremosos e artesanais, mas também serve ótimos cafés. O espaço é perfeito para famílias e crianças, conta com Wi-Fi gratuito e entrada acessível para cadeirantes. Funcionam todos os dias da semana, com horários estendidos até as 23h aos sábados. Aceitam todos os cartões e pagamentos por aproximação (NFC)!",
      is_premium: false,
      slug: "fue-gelateria",
      tag_destaque: "Imperdível",
      descricao_longa: "Localizada na charmosa Rua das Velas, bem no centro da Pequena Finlândia, a Fuê Gelateria é parada obrigatória para se refrescar e adoçar o passeio. Com quase mil avaliações positivas, o local é famoso por seus gelatos cremosos e artesanais, mas também serve ótimos cafés. O espaço é perfeito para famílias e crianças, conta com Wi-Fi gratuito e entrada acessível para cadeirantes. Funcionam todos os dias da semana, com horários estendidos até as 23h aos sábados. Aceitam todos os cartões e pagamentos por aproximação (NFC)!",
      link_whatsapp: "https://wa.me/5524992494399",
      instagram: "https://www.instagram.com/fuegelatoechocolate/",
      link_instagram: "https://www.instagram.com/fuegelatoechocolate/",
      link_maps: "https://maps.google.com/?cid=7155249969189648547",
      mapUrl: "https://maps.google.com/?cid=7155249969189648547",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2348871-d7004291-Reviews-Fue_Gelateria_Escola-Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.8,
      tags: ["gelateria", "gelatos", "sorvete", "café", "pequena finlândia", "centro", "crianças", "família", "wi-fi", "acessível", "nfc", "gastronomia"]
    },
    {
      id: 'cafe-finlandes-penedo',
      title: "Café Finlandês Penedo",
      category: "Gastronomia",
      image: "/assets/imagens/logos/logo-cafe-finlandes-penedo.jpg",
      description: "O autêntico sabor de Penedo! Cafés, doces, refeições completas e ambiente Pet Friendly na Av. das Mangueiras.",
      fullInfo: "Localizado no fervo da Av. das Mangueiras (nº 1645), o Café Finlandês Penedo é um dos locais mais tradicionais e amados da cidade (com mais de 1.200 avaliações!). Muito mais que uma cafeteria, o espaço oferece um cardápio completo que vai do café da manhã até o jantar, incluindo deliciosas sobremesas, fondues, vinhos e drinks. O ambiente é super acolhedor, conta com agradáveis mesas ao ar livre, é totalmente acessível para cadeirantes e é Pet Friendly (seu cachorrinho é muito bem-vindo!). Aceitam reservas e funcionam todos os dias, das 08h30 às 22h.",
      is_premium: false,
      slug: "cafe-finlandes-penedo",
      tag_destaque: "Tradição & Sabor",
      descricao_longa: "Localizado no fervo da Av. das Mangueiras (nº 1645), o Café Finlandês Penedo é um dos locais mais tradicionais e amados da cidade (com mais de 1.200 avaliações!). Muito mais que uma cafeteria, o espaço oferece um cardápio completo que vai do café da manhã até o jantar, incluindo deliciosas sobremesas, fondues, vinhos e drinks. O ambiente é super acolhedor, conta com agradáveis mesas ao ar livre, é totalmente acessível para cadeirantes e é Pet Friendly (seu cachorrinho é muito bem-vindo!). Aceitam reservas e funcionam todos os dias, das 08h30 às 22h.",
      link_whatsapp: "https://wa.me/5524998634222",
      instagram: "https://www.instagram.com/cafefinlandes/",
      link_instagram: "https://www.instagram.com/cafefinlandes/",
      link_maps: "https://maps.google.com/?cid=2866118961007667073",
      mapUrl: "https://maps.google.com/?cid=2866118961007667073",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Restaurant_Review-g2427181-d2425884-Reviews-Cafe_Finlandes-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.7,
      tags: ["cafeteria", "café", "almoço", "jantar", "doces", "fondue", "vinhos", "pet friendly", "acessível", "av. das mangueiras", "reservas", "gastronomia"]
    }
  ],
  'compras': [
    {
      id: 'pequena-finlandia-shopping',
      title: "Pequena Finlândia",
      category: "Shopping",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/eb/db/12/caption.jpg?w=1000&h=-1&s=1",
      description: "O shopping a céu aberto que é o coração da vila finlandesa.",
      fullInfo: "O histórico de Penedo é homenageado no shopping a céu aberto Pequena Finlândia, que reúne lojas e restaurantes em casas inspiradas na arquitetura do país escandinavo. Ali também há uma Casa do Papai Noel Oficial, onde a magia do Natal vive o ano todo. Casinhas coloridas de madeira guardam lojas que vendem artesanatos, souvenirs e chocolates famosos. O local oferece arquitetura típica, lojas variadas e gastronomia inspirada na culinária finlandesa.",
      location: "R. das Velas, 100",
      rating: 4.8,
      instagram: "https://www.instagram.com/pequenafinlandia.oficial/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d4706334-Reviews-Pequena_Finlandia-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["papai noel", "natal", "arquitetura", "finlândia", "compras", "artesanato", "turismo", "casa do papai noel"]
    },
    {
      id: 'shopping-vale-duendes',
      title: "Shopping Vale dos Duendes",
      category: "Shopping",
      image: "https://portalpenedo.com.br/wp-content/uploads/2025/05/SHOPPING-VALE-DOS-DOENDES-PENEDO-5-1024x1024.jpg",
      description: "O shopping mais completo de Penedo com diversos detalhes mágicos.",
      fullInfo: "Inspirado na mitologia dos duendes, o shopping é construído em formato de U e em seu centro há um jardim com muitas árvores, flores e uma passarela com sombrinhas coloridas que encantam os turistas. No jardim há a casa dos duendes, com esculturas e elementos temáticos. O Shopping Vale dos Duendes, no coração de Penedo, mistura compras, diversão e a magia da Pequena Finlândia. Encontre chocolates artesanais, cachaças regionais e souvenirs que contam a história da região.",
      location: "Av. das Mangueiras, 1876",
      rating: 4.7,
      instagram: "https://www.instagram.com/vale_dos_duendes_penedorj/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d4508491-Reviews-Shopping_Vale_Dos_Duendes-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["duendes", "temático", "jardim", "sombrinhas", "chocolates", "cachaça", "lúdico", "compras"]
    },
    {
      id: 'shopping-roda-dagua',
      title: "Shopping Roda D'água",
      category: "Shopping",
      image: "https://www.voltologo.net/wp-content/uploads/2021/10/o-que-fazer-em-penedo-em-3-dias.jpg",
      description: "Galeria com elevador panorâmico e ambiente pet friendly.",
      fullInfo: "Possuindo 2 andares, contando com elevador panorâmico, ambientes acessíveis e pet friendly, tem uma ampla variedade de lojas tais como bijuterias, restaurante, cafeteria, imobiliária, lembrancinhas e presentes, lojas de vestuário, brinquedos, sorveterias, fotos no azulejo, artesanais, geek e salão de beleza. Estrategicamente localizado bem no coração de Penedo, ao lado da Pequena Finlândia.",
      location: "Av. das Mangueiras, 1755",
      rating: 4.6,
      instagram: "https://www.instagram.com/shoppingrodadaguaoficial/",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d10034633-Reviews-Shopping_Roda_D_agua-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["pet friendly", "acessível", "elevador", "variedade", "centro", "compras", "moda", "geek"]
    },
    {
      id: 'shopping-azul',
      title: "Shopping Azul",
      category: "Shopping",
      image: "https://media-cdn.tripadvisor.com/media/photo-s/14/cc/96/82/entrada.jpg",
      description: "Shopping central com produtos artesanais, gastronômicos e regionais.",
      fullInfo: "O Shopping Azul, localizado no coração comercial de Penedo, é reconhecido pelo seu ambiente simples e acolhedor. O espaço reúne diversas lojas especializadas em produtos típicos, desde artesanatos e decorações regionais (como móveis da Arte da Nossa Terra) até a gastronomia local, com pastinhas de truta, queijos, licores e doces. Além disso, oferece opções de vestuário, acessórios, presentes variados e uma área de alimentação com sorveterias, cafeterias e lanchonetes, sendo um ponto de parada prático para quem busca lembranças autênticas da região.",
      location: "Av. das Mangueiras, 1636",
      rating: 4.5,
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d15143761-Reviews-Shopping_Azul-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["compras", "artesanato", "gastronomia", "presentes", "centro", "produtos típicos", "região"]
    },
    {
      id: 'shopping-do-esquilo',
      title: "Shopping do Esquilo",
      category: "Shopping",
      image: "https://visitepenedo.com.br/wp-content/uploads/2024/04/shoppingesquilo-scaled.jpg",
      description: "Centro comercial tradicional na entrada de Penedo, ideal para compras e lazer tranquilo.",
      fullInfo: "O Shopping do Esquilo é um dos centros comerciais mais tradicionais de Penedo, estrategicamente localizado na entrada do distrito. Conhecido por ser uma parada tranquila e completa, o local oferece uma grande variedade de produtos e serviços. Entre os destaques estão a decoração e artesanato regional, a famosa loja Astral Exothéryca voltada para artigos esotéricos, e opções de moda infantil e outlet multimarcas. Na gastronomia, conta com restaurante a quilo, lanchonete, sorveteria e cafeteria artesanal. Dispõe de estacionamento gratuito, banheiros acessíveis e fraldário, sendo um excelente lugar para adquirir lembrancinhas e presentes autênticos.",
      location: "Av. Dr. Arnaldo Marzoto - Jardim Martineli",
      rating: 4.5,
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Shopping+do+Esquilo+Penedo+Av.+Dr.+Arnaldo+Marzoto+Jardim+Martineli+Itatiaia+RJ+27580-000",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d18344322-Reviews-Shopping_do_Esquilo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      tags: ["esquilo", "compras", "tradicional", "entrada", "artesanato", "esotérico", "moda", "gastronomia", "estacionamento", "família"]
    },
    {
      id: 'armazem-da-vila',
      title: "Armazém da Vila",
      category: "Compras",
      image: "/assets/imagens/logos/logo-armazem-da-vila.jpg",
      description: "Loja charmosa localizada no coração da Pequena Finlândia. Perfeita para suas compras em Penedo.",
      fullInfo: "O Armazém da Vila está estrategicamente localizado na Rua das Velas, dentro do icônico shopping Pequena Finlândia (pertinho da Casa do Papai Noel). É uma parada obrigatória no roteiro de quem deseja levar um pedacinho de Penedo para casa! O espaço é acessível para cadeirantes, possui ótimo atendimento (nota 4.5) e funciona todos os dias da semana, com horário estendido aos finais de semana para sua comodidade. A melhor Pasta de Truta da região 🧡\n🔸 + de 50 sabores\n🔸Fabricação Própria\n📍Penedo e Maringá - RJ",
      is_premium: false,
      slug: "armazem-da-vila",
      tag_destaque: "Ótima Opção",
      descricao_longa: "O Armazém da Vila está estrategicamente localizado na Rua das Velas, dentro do icônico shopping Pequena Finlândia (pertinho da Casa do Papai Noel). É uma parada obrigatória no roteiro de quem deseja levar um pedacinho de Penedo para casa! O espaço é acessível para cadeirantes, possui ótimo atendimento (nota 4.5) e funciona todos os dias da semana, com horário estendido aos finais de semana para sua comodidade. A melhor Pasta de Truta da região 🧡\n🔸 + de 50 sabores\n🔸Fabricação Própria\n📍Penedo e Maringá - RJ",
      link_whatsapp: "https://wa.me/5524992206446",
      instagram: "https://www.instagram.com/armazemdavilapenedo",
      link_instagram: "https://www.instagram.com/armazemdavilapenedo",
      link_maps: "https://maps.google.com/?cid=11204016888187024292",
      mapUrl: "https://maps.google.com/?cid=11204016888187024292",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d11747373-Reviews-Armazem_da_Vila-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.5,
      tags: ["pasta de truta", "armazém", "pequena finlândia", "centro", "artesanato", "compras", "sabores", "fabricação própria", "turismo"]
    },
    {
      id: 'geek-penedo',
      title: "Geek Penedo",
      category: "Compras",
      image: "/assets/imagens/logos/logo-geek-penedo.jpg",
      description: "O paraíso dos colecionáveis e presentes criativos! A melhor loja nerd e geek de Penedo.",
      fullInfo: "Localizada na movimentada Av. das Mangueiras, bem pertinho da Casa do Papai Noel, a Geek Penedo é parada obrigatória para os fãs de cultura pop, animes, filmes e séries. É uma excelente opção para encontrar presentes super criativos e lembranças únicas na cidade. A loja oferece ótimo atendimento e aceita diversas formas de pagamento, incluindo cartões e aproximação (NFC). Eles funcionam de quinta a segunda-feira, com horários estendidos até mais tarde nos finais de semana!",
      is_premium: false,
      slug: "geek-penedo",
      tag_destaque: "Cultura Pop e Geek",
      descricao_longa: "Localizada na movimentada Av. das Mangueiras, bem pertinho da Casa do Papai Noel, a Geek Penedo é parada obrigatória para os fãs de cultura pop, animes, filmes e séries. É uma excelente opção para encontrar presentes super criativos e lembranças únicas na cidade. A loja oferece ótimo atendimento e aceita diversas formas de pagamento, incluindo cartões e aproximação (NFC). Eles funcionam de quinta a segunda-feira, com horários estendidos até mais tarde nos finais de semana!",
      link_instagram: "https://www.instagram.com/geek_penedo/",
      instagram: "https://www.instagram.com/geek_penedo/",
      link_maps: "https://maps.google.com/?cid=7913696677775624844",
      mapUrl: "https://maps.google.com/?cid=7913696677775624844",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d23808167-Reviews-Geek_Penedo-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.8,
      tags: ["geek", "nerd", "colecionáveis", "animes", "cultura pop", "filmes", "séries", "presentes", "av. das mangueiras", "compras", "nfc"]
    },
    {
      id: 'astral-exotheryca',
      title: "Astral Exothéryca",
      category: "Compras",
      image: "/assets/imagens/logos/logo-astral-exotheryca.jpg",
      description: "Loja mágica e mística na entrada de Penedo. Encontre cristais, incensos e presentes especiais.",
      fullInfo: "Localizada logo na entrada de Penedo, a Astral Exothéryca é uma loja encantadora e super bem avaliada pelos visitantes. O espaço é totalmente dedicado a artigos esotéricos, cristais, incensos, peças indianas, decoração e produtos místicos. É o lugar perfeito para renovar as energias e encontrar presentes com muito significado. A loja oferece estacionamento acessível e aceita pagamentos via cartão e aproximação (NFC). Aberta de quarta a segunda, das 11h às 19h!",
      is_premium: false,
      slug: "astral-exotheryca",
      tag_destaque: "Energia e Bem-estar",
      descricao_longa: "Localizada logo na entrada de Penedo, a Astral Exothéryca é uma loja encantadora e super bem avaliada pelos visitantes. O espaço é totalmente dedicado a artigos esotéricos, cristais, incensos, peças indianas, decoração e produtos místicos. É o lugar perfeito para renovar as energias e encontrar presentes com muito significado. A loja oferece estacionamento acessível e aceita pagamentos via cartão e aproximação (NFC). Aberta de quarta a segunda, das 11h às 19h!",
      link_whatsapp: "https://wa.me/5524981556773",
      instagram: "https://www.instagram.com/astralexotheryca/",
      link_instagram: "https://www.instagram.com/astralexotheryca/",
      link_maps: "https://maps.google.com/?cid=1293510098541823076",
      mapUrl: "https://maps.google.com/?cid=1293510098541823076",
      tripadvisorUrl: "https://www.tripadvisor.com.br/Attraction_Review-g2427181-d13792072-Reviews-Astral_Exotheryca-Penedo_Itatiaia_State_of_Rio_de_Janeiro.html",
      rating: 4.7,
      tags: ["místico", "esotérico", "cristais", "incensos", "decoração", "peças indianas", "bem-estar", "compras", "entrada", "estacionamento"]
    },
    {
      id: 'via-lactea-balas',
      title: "Via-Láctea Loja das Balas",
      category: "Compras",
      image: "/assets/imagens/logos/logo-via-lactea-balas.jpg",
      description: "O paraíso das guloseimas na Pequena Finlândia! Uma infinidade de balas, chocolates e doces a granel.",
      fullInfo: "Localizada na charmosa Rua das Velas, bem dentro da Pequena Finlândia, a Via-Láctea Loja das Balas é o verdadeiro paraíso para crianças e adultos. Com excelente avaliação dos visitantes, a loja oferece uma variedade incrível de balas, doces importados, chocolates e guloseimas a granel para você montar o seu próprio mix. O espaço é acessível para cadeirantes, possui ótimo atendimento e funciona todos os dias, com horário estendido até as 22h às sextas e sábados. Aceita cartões e pagamentos por aproximação (NFC). Uma parada obrigatória e doce no seu roteiro!",
      is_premium: false,
      slug: "via-lactea-balas",
      tag_destaque: "Paraíso dos Doces",
      descricao_longa: "Localizada na charmosa Rua das Velas, bem dentro da Pequena Finlândia, a Via-Láctea Loja das Balas é o verdadeiro paraíso para crianças e adultos. Com excelente avaliação dos visitantes, a loja oferece uma variedade incrível de balas, doces importados, chocolates e guloseimas a granel para você montar o seu próprio mix. O espaço é acessível para cadeirantes, possui ótimo atendimento e funciona todos os dias, com horário estendido até as 22h às sextas e sábados. Aceita cartões e pagamentos por aproximação (NFC). Uma parada obrigatória e doce no seu roteiro!",
      instagram: "https://www.instagram.com/vialacteabalas/",
      link_instagram: "https://www.instagram.com/vialacteabalas/",
      link_maps: "https://maps.google.com/?cid=7311349378174178394",
      mapUrl: "https://maps.google.com/?cid=7311349378174178394",
      rating: 4.6,
      tags: ["balas", "doces", "guloseimas", "chocolates", "a granel", "importados", "pequena finlândia", "kids", "crianças", "compras", "acessível"]
    },
    {
      id: 'arte-da-nossa-terra',
      title: "Arte da Nossa Terra",
      category: "Compras",
      image: "/assets/imagens/logos/logo-arte-da-nossa-terra.jpg",
      description: "Loja charmosa na Rua das Velas. Encontre as melhores lembrancinhas e artesanatos locais de Penedo!",
      fullInfo: "A \"Arte da Nossa Terra\" é uma loja de presentes encantadora localizada na famosa Rua das Velas, bem coladinha na Pequena Finlândia e na Casa do Papai Noel. É o local perfeito para você encontrar aquela lembrancinha especial, artigos de decoração e produtos de artesanato para levar como recordação de Penedo. Eles oferecem ótimo atendimento, aceitam pagamentos via cartões de crédito, débito e aproximação (NFC). A loja funciona de quinta a segunda-feira, com horário estendido até as 22h aos sábados para sua maior comodidade!",
      is_premium: false,
      slug: "arte-da-nossa-terra",
      tag_destaque: "Artesanato e Presentes",
      descricao_longa: "A \"Arte da Nossa Terra\" é uma loja de presentes encantadora localizada na famosa Rua das Velas, bem coladinha na Pequena Finlândia e na Casa do Papai Noel. É o local perfeito para você encontrar aquela lembrancinha especial, artigos de decoração e produtos de artesanato para levar como recordação de Penedo. Eles oferecem ótimo atendimento, aceitam pagamentos via cartões de crédito, débito e aproximação (NFC). A loja funciona de quinta a segunda-feira, com horário estendido até as 22h aos sábados para sua maior comodidade!",
      link_whatsapp: "https://wa.me/5524992275712",
      instagram: "https://www.instagram.com/artedanossaterra/",
      link_instagram: "https://www.instagram.com/artedanossaterra/",
      link_maps: "https://maps.google.com/?cid=9047201911561872295",
      mapUrl: "https://maps.google.com/?cid=9047201911561872295",
      rating: 4.5,
      tags: ["presentes", "lembrancinhas", "artesanato", "decoração", "rua das velas", "pequena finlândia", "centro", "compras", "nfc"]
    },
    {
      id: 'reserva-da-mata',
      title: "Reserva Da Mata",
      category: "Compras",
      image: "/assets/imagens/logos/logo-reserva-da-mata.jpg",
      description: "Loja de roupas e acessórios com muito estilo, com localização privilegiada na Av. das Mangueiras.",
      fullInfo: "Localizada no coração da Avenida das Mangueiras (bem em frente à Pequena Finlândia e ao lado da Casa do Fritz), a Reserva Da Mata é uma excelente loja de moda e vestuário em Penedo. Com ótima avaliação dos visitantes (4.6 estrelas), a loja oferece peças cheias de estilo, conforto e bom gosto, sendo uma parada perfeita para quem adora renovar o guarda-roupa ou comprar presentes durante a viagem. O espaço conta com excelente atendimento e aceita diversas formas de pagamento, incluindo cartões de débito e aproximação (NFC).",
      is_premium: false,
      slug: "reserva-da-mata",
      tag_destaque: "Moda e Estilo",
      descricao_longa: "Localizada no coração da Avenida das Mangueiras (bem em frente à Pequena Finlândia e ao lado da Casa do Fritz), a Reserva Da Mata é uma excelente loja de moda e vestuário em Penedo. Com ótima avaliação dos visitantes (4.6 estrelas), a loja oferece peças cheias de estilo, conforto e bom gosto, sendo uma parada perfeita para quem adora renovar o guarda-roupa ou comprar presentes durante a viagem. O espaço conta com excelente atendimento e aceita diversas formas de pagamento, incluindo cartões de débito e aproximação (NFC).",
      link_whatsapp: "https://wa.me/552433513066",
      instagram: "https://www.instagram.com/reservadamata/",
      link_instagram: "https://www.instagram.com/reservadamata/",
      link_maps: "https://maps.google.com/?cid=6753522909305314682",
      mapUrl: "https://maps.google.com/?cid=6753522909305314682",
      rating: 4.6,
      tags: ["moda", "vestuário", "roupas", "estilo", "presentes", "av. das mangueiras", "compras", "nfc", "atendimento"]
    },
    {
      id: 'meu-sonho',
      title: "Meu Sonho",
      category: "Compras",
      image: "/assets/imagens/logos/logo-meu-sonho.jpg",
      description: "Loja encantadora no Shopping Vale dos Duendes, ideal para presentes e lembranças de Penedo.",
      fullInfo: "Localizada no coração de Penedo, dentro do Shopping Vale dos Duendes (na movimentada Av. das Mangueiras), a loja \"Meu Sonho\" faz jus ao nome. O espaço é perfeito para quem busca opções de presentes, artigos locais e lembrancinhas encantadoras. Com uma localização privilegiada perto da Casa do Papai Noel, a loja abre todos os dias da semana e conta com horário de funcionamento estendido até as 22h aos sábados. Eles aceitam pagamentos via cartões de crédito, débito e aproximação (NFC).",
      is_premium: false,
      slug: "meu-sonho",
      tag_destaque: "Lembranças e Presentes",
      descricao_longa: "Localizada no coração de Penedo, dentro do Shopping Vale dos Duendes (na movimentada Av. das Mangueiras), a loja \"Meu Sonho\" faz jus ao nome. O espaço é perfeito para quem busca opções de presentes, artigos locais e lembrancinhas encantadoras. Com uma localização privilegiada perto da Casa do Papai Noel, a loja abre todos os dias da semana e conta com horário de funcionamento estendido até as 22h aos sábados. Eles aceitam pagamentos via cartões de crédito, débito e aproximação (NFC).",
      link_whatsapp: "https://wa.me/5524998485245",
      instagram: "https://www.instagram.com/loja.meusonho/",
      link_instagram: "https://www.instagram.com/loja.meusonho/",
      link_maps: "https://maps.google.com/?cid=3640453365322855656",
      mapUrl: "https://maps.google.com/?cid=3640453365322855656",
      rating: 4.5,
      tags: ["presentes", "lembrancinhas", "vale dos duendes", "shopping", "compras", "av. das mangueiras", "nfc"]
    },
    {
      id: 'artevelas',
      title: "Artevelas",
      category: "Compras",
      image: "/assets/imagens/logos/logo-artevelas.jpg",
      description: "Loja especializada em velas artesanais e perfumadas na Av. das Mangueiras. O presente perfeito!",
      fullInfo: "Localizada na movimentada Av. das Mangueiras, bem pertinho da Pequena Finlândia, a Artevelas é uma loja super tradicional de Penedo. O espaço é especializado na venda de velas artesanais, aromáticas, decorativas e artigos charmosos para a casa. É o lugar perfeito para encontrar um presente especial e perfumado para levar de lembrança da viagem! A loja funciona todos os dias da semana, com horários estendidos até as 22h nas sextas e sábados para sua comodidade. Aceitam diversas formas de pagamento, incluindo cartões e aproximação (NFC).",
      is_premium: false,
      slug: "artevelas",
      tag_destaque: "Decoração e Aromas",
      descricao_longa: "Localizada na movimentada Av. das Mangueiras, bem pertinho da Pequena Finlândia, a Artevelas é uma loja super tradicional de Penedo. O espaço é especializado na venda de velas artesanais, aromáticas, decorativas e artigos charmosos para a casa. É o lugar perfeito para encontrar um presente especial e perfumado para levar de lembrança da viagem! A loja funciona todos os dias da semana, com horários estendidos até as 22h nas sextas e sábados para sua comodidade. Aceitam diversas formas de pagamento, incluindo cartões e aproximação (NFC).",
      link_whatsapp: "https://wa.me/5521999167676",
      instagram: "https://www.instagram.com/artevelaspenedo/",
      link_instagram: "https://www.instagram.com/artevelaspenedo/",
      link_maps: "https://maps.google.com/?cid=17080737747191518978",
      mapUrl: "https://maps.google.com/?cid=17080737747191518978",
      rating: 4.5,
      tags: ["velas", "velas artesanais", "velas perfumadas", "decoração", "casa", "aromas", "presentes", "av. das mangueiras", "compras", "nfc"]
    },
    {
      id: 'raio-de-luz-decoracoes',
      title: "Raio de Luz - Tapeçarias e Decorações",
      category: "Compras",
      image: "/assets/imagens/logos/logo-raio-de-luz-decoracoes.jpg",
      description: "Loja especializada em belíssimas tapeçarias, móveis e artigos de decoração na Av. das Mangueiras.",
      fullInfo: "Localizada na movimentada Av. das Mangueiras (bem em frente ao Café Finlandês e pertinho da Pequena Finlândia), a Raio de Luz é a loja ideal para quem busca renovar o ambiente de casa. Com excelente avaliação dos clientes (4.5 estrelas), o espaço oferece uma curadoria incrível de tapeçarias exclusivas, móveis charmosos e artigos finos de decoração. É o lugar perfeito para comprar peças únicas e levar um pouco da elegância de Penedo para o seu lar. Aceitam diversas formas de pagamento, como cartões de crédito, débito e aproximação (NFC).",
      is_premium: false,
      slug: "raio-de-luz-decoracoes",
      tag_destaque: "Casa e Decoração",
      descricao_longa: "Localizada na movimentada Av. das Mangueiras (bem em frente ao Café Finlandês e pertinho da Pequena Finlândia), a Raio de Luz é a loja ideal para quem busca renovar o ambiente de casa. Com excelente avaliação dos clientes (4.5 estrelas), o espaço oferece uma curadoria incrível de tapeçarias exclusivas, móveis charmosos e artigos finos de decoração. É o lugar perfeito para comprar peças únicas e levar um pouco da elegância de Penedo para o seu lar. Aceitam diversas formas de pagamento, como cartões de crédito, débito e aproximação (NFC).",
      instagram: "https://www.instagram.com/raiodeluz_penedo/",
      link_instagram: "https://www.instagram.com/raiodeluz_penedo/",
      link_maps: "https://maps.google.com/?cid=3706962587581718413",
      mapUrl: "https://maps.google.com/?cid=3706962587581718413",
      rating: 4.5,
      tags: ["tapeçaria", "decoração", "móveis", "casa", "artigos finos", "av. das mangueiras", "compras", "nfc"]
    }
  ],
  'blog': [
    {
      id: 'penedo-guia',
      title: "Penedo, RJ: Guia Completo com O Que Fazer, Onde Ir e Dicas Imperdíveis",
      category: "Destaque",
      image: "/assets/imagens/blog/penedo-guia/capa.jpg",
      description: "Descubra tudo sobre Penedo RJ: atrações, cachoeiras, gastronomia e dicas completas.",
      fullInfo: "Descubra tudo sobre Penedo RJ: atrações, cachoeiras, gastronomia e dicas completas para sua viagem.",
      tags: ["guia", "penedo", "dicas", "viagem"],
      date: "20/06/2026"
    },
    {
      id: 'cachoeiras-penedo',
      title: "Cachoeiras em Penedo RJ: As Melhores para Visitar",
      category: "Natureza",
      image: "/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg",
      description: "Um guia completo pelas águas cristalinas de Penedo. Descubra os melhores poços e quedas.",
      fullInfo: "Explore as melhores cachoeiras de Penedo RJ. Dicas de acesso, segurança e roteiros para relaxar.",
      tags: ["cachoeiras", "natureza", "penedo", "rio"],
      date: "21/06/2026"
    },
    {
      id: 'restaurantes',
      title: "Melhores restaurantes em Penedo",
      category: "Gastronomia",
      image: "/assets/imagens/blog/melhores-restaurantes/intro.jpg",
      description: "Onde comer bem na cidade: das trutas famosas aos cafés coloniais.",
      fullInfo: "Onde comer bem na cidade: das trutas famosas aos cafés coloniais.",
      tags: ["restaurantes", "gastronomia", "comida"],
      date: "22/06/2026"
    },
    {
      id: 'melhores-hospedagens',
      title: "Onde se Hospedar em Penedo: 5 Pousadas e Hotéis Encantadores",
      category: "Hospedagem",
      image: "/assets/imagens/blog/melhores-hospedagens/intro.jpg",
      description: "Um guia de hospedagem em Penedo com as melhores pousadas e chalés. Lareiras aconchegantes, hidromassagem e vistas incríveis.",
      fullInfo: "Descubra as pousadas e hotéis mais charmosos e recomendados de Penedo para uma estadia inesquecível.",
      tags: ["hospedagem", "pousadas", "hotéis", "romântico"],
      date: "23/06/2026"
    }
  ]
};

const FEATURED_ITEMS: DetailItem[] = [
  ...locaisData['onde-ficar'] || [],
  ...locaisData['gastronomia'] || [],
  ...locaisData['compras'] || []
].filter((item: any) => item.is_premium).slice(0, 12);

interface PartnerHeaderProps {
  item: DetailItem;
  size?: 'small' | 'large';
}

function PartnerHeader({ item, size = 'large' }: PartnerHeaderProps) {
  const containerSize = size === 'large' 
    ? "w-14 h-14 md:w-20 md:h-20" 
    : "w-10 h-10 md:w-14 md:h-14";
  
  const textSize = size === 'large'
    ? "text-4xl md:text-6xl font-black text-penedo-forest tracking-tighter leading-none drop-shadow-sm text-left"
    : "text-xl md:text-2xl font-black text-penedo-forest tracking-tighter leading-none drop-shadow-sm text-left line-clamp-2";

  const HeadingTag = size === 'large' ? 'h1' : 'h3';

  return (
    <div className="flex items-center gap-4 text-left">
      <div className={`${containerSize} rounded-full border-2 border-penedo-gold shadow-md shrink-0 bg-white overflow-hidden flex items-center justify-center`}>
        <img 
          src={`/assets/imagens/logos/logo-${item.id}.jpg`} 
          alt={`Logo ${item.title}`} 
          className="w-full h-full object-cover" 
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
      <HeadingTag className={textSize}>
        {item.title}
      </HeadingTag>
    </div>
  );
}
function BackgroundLayer() {
  const decorations = [
    // Esquerda
    {
      src: '/assets/imagens/backgrounds/leaf-01.svg',
      className: 'top-[12%] left-[-2%] md:left-[2%] w-20 h-20 md:w-32 md:h-32 animate-float-slow-1',
      style: { transform: 'rotate(15deg)', opacity: 0.04 }
    },
    {
      src: '/assets/imagens/backgrounds/pine-01.svg',
      className: 'top-[32%] left-[4%] w-18 h-18 md:w-28 md:h-28 animate-float-slow-2',
      style: { transform: 'rotate(-10deg)', opacity: 0.05 }
    },
    {
      src: '/assets/imagens/backgrounds/leaf-02.svg',
      className: 'top-[52%] left-[-1%] md:left-[3%] w-16 h-16 md:w-24 md:h-24 animate-float-slow-3',
      style: { transform: 'rotate(20deg)', opacity: 0.04 }
    },
    {
      src: '/assets/imagens/backgrounds/mountain-01.svg',
      className: 'top-[72%] left-[-3%] md:left-[1%] w-24 h-24 md:w-36 md:h-36 animate-float-slow-1',
      style: { transform: 'rotate(5deg)', opacity: 0.03 }
    },
    {
      src: '/assets/imagens/backgrounds/leaf-03.svg',
      className: 'top-[88%] left-[3%] w-16 h-16 md:w-26 md:h-26 animate-float-slow-2',
      style: { transform: 'rotate(-15deg)', opacity: 0.04 }
    },
    
    // Direita
    {
      src: '/assets/imagens/backgrounds/cabin.svg',
      className: 'top-[18%] right-[-2%] md:right-[2%] w-18 h-18 md:w-28 md:h-28 animate-float-slow-2',
      style: { transform: 'rotate(-5deg)', opacity: 0.04 }
    },
    {
      src: '/assets/imagens/backgrounds/coffee.svg',
      className: 'top-[38%] right-[4%] w-16 h-16 md:w-24 md:h-24 animate-float-slow-3',
      style: { transform: 'rotate(12deg)', opacity: 0.04 }
    },
    {
      src: '/assets/imagens/backgrounds/compass.svg',
      className: 'top-[58%] right-[-2%] md:right-[3%] w-20 h-20 md:w-30 md:h-30 animate-float-slow-1',
      style: { transform: 'rotate(-15deg)', opacity: 0.04 }
    },
    {
      src: '/assets/imagens/backgrounds/chocolate.svg',
      className: 'top-[78%] right-[1%] w-18 h-18 md:w-28 md:h-28 animate-float-slow-2',
      style: { transform: 'rotate(8deg)', opacity: 0.03 }
    },
    {
      src: '/assets/imagens/backgrounds/snowflake.svg',
      className: 'top-[90%] right-[3%] w-14 h-14 md:w-22 md:h-22 animate-float-slow-3',
      style: { transform: 'rotate(15deg)', opacity: 0.04 }
    }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden select-none bg-transparent">
      {decorations.map((dec, i) => (
        <img
          key={i}
          src={dec.src}
          className={`absolute ${dec.className}`}
          style={dec.style}
          loading="lazy"
          alt="Decorativo"
        />
      ))}
    </div>
  );
}
function PremiumCarousel({ onNavigatePremium }: { onNavigatePremium: (slug: string) => void }) {
  const premiumItems = React.useMemo(() => {
    const allowedCategories = ['onde-ficar', 'gastronomia', 'compras'];
    const filteredPremium = allowedCategories.flatMap(cat => (locaisData as any)[cat] || [])
      .filter((item: any) => item.is_premium);
      
    const detailsPremium = Object.values(DETAILS_DATA).flat()
      .filter((item: any) => item.is_premium || item.isPremium);
      
    const allPremium = [...filteredPremium, ...detailsPremium];
    
    // De-duplicate by id or slug
    const uniquePremiumMap = new Map();
    allPremium.forEach((item: any) => {
      const key = item.title;
      if (!uniquePremiumMap.has(key)) {
        uniquePremiumMap.set(key, item);
      }
    });
    
    const uniquePremium = Array.from(uniquePremiumMap.values());
      
    // Always shuffle and slice to max 12
    return uniquePremium
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);
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
            <motion.a
              href={`#/detalhe/${(item as any).slug || item.id}`}
              onClick={(e) => {
                e.preventDefault();
                pushPremiumCardClick({
                  business_id: item.id,
                  business_name: item.title,
                  business_category: item.category
                }, index + 1);
                ((item as any).slug || item.id) && onNavigatePremium((item as any).slug || item.id);
              }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full group cursor-pointer block"
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
                  className={`relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                    ['Hotel Girassol', 'Águia de Penedo', 'Rota dos Passeios', 'Trilhando Penedo Ecoturismo'].includes(item.title)
                      ? 'object-contain object-center'
                      : 'object-cover'
                  }`}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-penedo-gold text-black font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg">
                    {item.tag_destaque || (item as any).tag_destaque || "Destaque"}
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
            </motion.a>
          )}
        />
      </div>
    </section>
  );
}

function FeaturedCard(props: { item: DetailItem, onClick: () => void }) {
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
      {(item.isPremium || (item as any).is_premium) && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-penedo-gold text-black font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            {item.tag_destaque || (item as any).tag_destaque || "Destaque"}
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
          className={`relative z-10 w-full h-full transition-transform duration-1000 group-hover:scale-110 ${
            item.id === 'hotel-girassol'
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

const parseHash = (): { page: Page; premiumSlug: string | null; blogArticle: string | null } => {
  const hash = window.location.hash || '#/';
  
  if (hash === '#/' || hash === '#') {
    return { page: 'home', premiumSlug: null, blogArticle: null };
  }
  
  if (hash.startsWith('#/detalhe/')) {
    const slug = hash.replace('#/detalhe/', '');
    return { page: 'premium-detail', premiumSlug: slug, blogArticle: null };
  }
  
  if (hash.startsWith('#/blog/artigo/')) {
    const slug = hash.replace('#/blog/artigo/', '');
    return { page: 'blog', premiumSlug: null, blogArticle: slug };
  }
  
  if (hash === '#/blog') {
    return { page: 'blog', premiumSlug: null, blogArticle: null };
  }
  
  const pageName = hash.replace('#/', '') as Page;
  const validPages: Page[] = ['home', 'o-que-fazer', 'onde-ficar', 'gastronomia', 'compras', 'blog', 'contato', 'premium-detail'];
  if (validPages.includes(pageName)) {
    return { page: pageName, premiumSlug: null, blogArticle: null };
  }
  
  return { page: 'home', premiumSlug: null, blogArticle: null };
};

const updateHash = (page: Page, premiumSlug: string | null, blogArticle: string | null) => {
  let hash = '';
  if (page === 'home') {
    hash = '#/';
  } else if (page === 'premium-detail' && premiumSlug) {
    hash = `#/detalhe/${premiumSlug}`;
  } else if (page === 'blog') {
    if (blogArticle) {
      hash = `#/blog/artigo/${blogArticle}`;
    } else {
      hash = `#/blog`;
    }
  } else {
    hash = `#/${page}`;
  }
  
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => parseHash().page);
  const [selectedPremiumSlug, setSelectedPremiumSlug] = useState<string | null>(() => parseHash().premiumSlug);
  const [activeBlogArticle, setActiveBlogArticle] = useState<string | null>(() => parseHash().blogArticle);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [homeRefreshKey, setHomeRefreshKey] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    if (!localStorage.getItem('cookie-consent')) {
      setShowCookies(true);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to browser Back/Forward navigation (hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash();
      setCurrentPage(route.page);
      setSelectedPremiumSlug(route.premiumSlug);
      setActiveBlogArticle(route.blogArticle);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize state changes to URL hash
  useEffect(() => {
    updateHash(currentPage, selectedPremiumSlug, activeBlogArticle);
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  // Efeito robusto para garantir que a página sempre suba ao topo em trocas de página ou artigos
  useEffect(() => {
    // Força o scroll instantâneo ignorando qualquer animação suave do CSS
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      document.documentElement.style.scrollBehavior = 'smooth';
    };
  }, [currentPage, activeBlogArticle]);

  // 1. GTM SPA page_view tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      const pagePath = window.location.hash || '#/';
      const pageTitle = document.title || 'Vem Pra Penedo';
      pushPageView(pagePath, pageTitle);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  // 2. GTM page_scroll tracking
  useEffect(() => {
    const triggered = { '25': false, '50': false, '75': false, '100': false };
    const activeSlug = selectedPremiumSlug;

    const handleScrollDepth = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPct = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 100];
      
      thresholds.forEach(t => {
        const key = t.toString() as '25' | '50' | '75' | '100';
        if (scrollPct >= t && !triggered[key]) {
          triggered[key] = true;
          pushScroll(t, activeSlug);
        }
      });
    };

    window.addEventListener('scroll', handleScrollDepth);
    return () => window.removeEventListener('scroll', handleScrollDepth);
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  // 3. GTM page_engagement tracking
  useEffect(() => {
    const activeSlug = selectedPremiumSlug;
    const timers = [
      setTimeout(() => pushPageEngagement(30, activeSlug), 30000),
      setTimeout(() => pushPageEngagement(60, activeSlug), 60000),
      setTimeout(() => pushPageEngagement(120, activeSlug), 120000)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  const navigate = (page: Page, premiumSlug: string | null = null) => {
    setActiveBlogArticle(null);
    
    if (page !== 'premium-detail') {
      setSelectedPremiumSlug(null);
    }

    if (page === 'home') {
      setHomeRefreshKey(prev => prev + 1);
    }
    
    setCurrentPage(page);
    setSelectedPremiumSlug(premiumSlug);
    setIsMenuOpen(false);
    
    // Always scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenDetail = (item: DetailItem) => {
    const isPremium = item.isPremium || (item as any).is_premium;
    if (isPremium) {
      navigate('premium-detail', item.slug || item.id);
    } else {
      setSelectedItem(item);
    }
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowCookies(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Layer decorativa de fundo */}
      <BackgroundLayer />

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || currentPage !== 'home' || isMenuOpen
          ? 'bg-penedo-forest/95 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <a 
                href="#/" 
                onClick={(e) => { e.preventDefault(); navigate('home'); }} 
                className="transition-colors group cursor-pointer"
              >
                <img 
                  src="/assets/imagens/Logo.jpg" 
                  alt="Vem Pra Penedo Logo" 
                  className="h-12 w-12 object-cover rounded-full shadow-md"
                  referrerPolicy="no-referrer"
                />
              </a>
              <div className="flex flex-col items-center selection:bg-transparent">
                <a 
                  href="#/" 
                  onClick={(e) => { e.preventDefault(); navigate('home'); }}
                  className="text-2xl font-bold tracking-tighter leading-none mb-1 text-white select-none cursor-pointer hover:text-white"
                >
                  VEM PRA PENEDO
                </a>
                <span className="text-[#FFC107] text-[12px] font-bold tracking-wider drop-shadow-sm select-none">
                  onde a magia acontece
                </span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'home', label: 'Início' },
                { id: 'o-que-fazer', label: 'O Que Fazer' },
                { id: 'onde-ficar', label: 'Onde Ficar' },
                { id: 'gastronomia', label: 'Gastronomia' },
                { id: 'compras', label: 'Compras' },
                { id: 'blog', label: 'Blog' },
                { id: 'contato', label: 'Contato' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.id === 'home' ? '#/' : `#/${item.id}`}
                  onClick={(e) => { e.preventDefault(); navigate(item.id as Page); }}
                  className="font-medium text-sm transition-colors text-white/90 hover:text-white cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden transition-colors text-white"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-penedo-forest border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {[
                  { id: 'home', label: 'Início' },
                  { id: 'o-que-fazer', label: 'O Que Fazer' },
                  { id: 'onde-ficar', label: 'Onde Ficar' },
                  { id: 'gastronomia', label: 'Gastronomia' },
                  { id: 'compras', label: 'Compras' },
                  { id: 'blog', label: 'Blog' },
                  { id: 'contato', label: 'Contato' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={item.id === 'home' ? '#/' : `#/${item.id}`}
                    onClick={(e) => { e.preventDefault(); navigate(item.id as Page); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-white/90 font-medium hover:bg-penedo-emerald/20 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-0 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key={`home-${homeRefreshKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage 
                onNavigate={navigate} 
                onOpenDetail={handleOpenDetail} 
                onSelectArticle={setActiveBlogArticle}
                onNavigatePremium={(slug) => navigate('premium-detail', slug)}
              />
            </motion.div>
          )}
          {currentPage === 'o-que-fazer' && (
            <motion.div 
              key="what-to-do"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WhatToDoPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
            </motion.div>
          )}
          {currentPage === 'onde-ficar' && (
            <motion.div 
              key="where-to-stay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WhereToStayPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
            </motion.div>
          )}
          {currentPage === 'gastronomia' && (
            <motion.div 
              key="gastronomy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GastronomyPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
            </motion.div>
          )}
          {currentPage === 'compras' && (
            <motion.div 
              key="shopping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ShoppingPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
            </motion.div>
          )}
          {currentPage === 'contato' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ContactPage />
            </motion.div>
          )}
          {currentPage === 'blog' && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlogPage onOpenDetail={handleOpenDetail} onNavigate={navigate} activeArticle={activeBlogArticle} onSelectArticle={setActiveBlogArticle} />
            </motion.div>
          )}
          {currentPage === 'premium-detail' && (
            <motion.div 
              key={`premium-${selectedPremiumSlug}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PremiumDetailPage slug={selectedPremiumSlug!} onNavigate={navigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-penedo-forest text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img 
                src="/assets/imagens/Logo.jpg" 
                alt="Vem Pra Penedo Logo" 
                className="h-16 w-16 object-cover rounded-full bg-white p-1"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold leading-none mb-1">VEM PRA PENEDO</span>
                <span className="text-[#FFC107] text-[12px] font-bold tracking-wider drop-shadow-sm">onde a magia acontece</span>
              </div>
            </div>
            <p className="text-white/60">O portal oficial para quem busca viver o melhor de Penedo.</p>
          </div>
          <div>
            <h4 className="font-bold text-penedo-gold mb-6 text-lg">Links Rápidos</h4>
            <ul className="space-y-2 text-white/50">
              <li><a href="#/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white transition-colors cursor-pointer">Início</a></li>
              <li><a href="#/o-que-fazer" onClick={(e) => { e.preventDefault(); navigate('o-que-fazer'); }} className="hover:text-white transition-colors cursor-pointer">O Que Fazer</a></li>
              <li><a href="#/onde-ficar" onClick={(e) => { e.preventDefault(); navigate('onde-ficar'); }} className="hover:text-white transition-colors cursor-pointer">Onde Ficar</a></li>
              <li><a href="#/gastronomia" onClick={(e) => { e.preventDefault(); navigate('gastronomia'); }} className="hover:text-white transition-colors cursor-pointer">Gastronomia</a></li>
              <li><a href="#/compras" onClick={(e) => { e.preventDefault(); navigate('compras'); }} className="hover:text-white transition-colors cursor-pointer">Compras</a></li>
              <li><a href="#/blog" onClick={(e) => { e.preventDefault(); navigate('blog'); }} className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
              <li><a href="#/contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="hover:text-white transition-colors cursor-pointer">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-penedo-gold mb-6 text-lg">Siga-nos</h4>
            <div className="flex gap-4 mb-4">
              <a href="https://www.instagram.com/vemprapenedo/" target="_blank" rel="noopener noreferrer" 
                onClick={() => trackEvent('instagram_click', 'Instagram', 'Footer')}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform text-white"
                style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@vemprapenedo" target="_blank" rel="noopener noreferrer" 
                onClick={() => trackEvent('tiktok_click', 'TikTok', 'Footer')}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.2 2.27 2.02 3.75 2.36v3.91a11.55 11.55 0 0 1-5.32-1.39v6.17c.05 1.5-.32 2.99-1.07 4.29-.75 1.3-1.85 2.36-3.17 3.03-1.32.67-2.81.98-4.28.9-1.47-.08-2.91-.6-4.13-1.5a8.7 8.7 0 0 1-2.61-3.61C.31 16.92.15 15.35.73 13.88c.58-1.47 1.6-2.73 2.91-3.6 1.31-.87 2.87-1.31 4.45-1.25.12 0 .23.01.35.03v4.06c-.12-.03-.25-.05-.37-.05-1.12-.03-2.22.42-2.98 1.23-.76.81-1.08 1.93-.89 3.02.19 1.1.92 2.02 1.94 2.51.15.07.31.13.48.17.65.17 1.34.1 1.95-.2.61-.31 1.08-.82 1.34-1.45.21-.51.3-1.05.27-1.6V0h2.33z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/vemprapenedo" target="_blank" rel="noopener noreferrer" 
                onClick={() => trackEvent('facebook_click', 'Facebook', 'Footer')}
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform">
                <Facebook size={20} />
              </a>
              <a href="https://wa.me/5524992087767" target="_blank" rel="noopener noreferrer" 
                onClick={() => trackEvent('whatsapp_click', 'WhatsApp', 'Footer')}
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer">
              <Mail size={16} />
              <a href="mailto:contato@vemprapenedo.com.br" onClick={() => trackEvent('email_click', 'Email', 'Footer')} className="text-sm font-medium">contato@vemprapenedo.com.br</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Vem Pra Penedo. Todos os direitos reservados.
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookies && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100]"
          >
            <div className="bg-white rounded-3xl shadow-2xl border p-6">
              <h4 className="font-bold text-penedo-graphite">Privacidade e Cookies</h4>
              <p className="text-sm text-gray-500 my-4">Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política.</p>
              <div className="flex gap-3">
                <button onClick={acceptCookies} className="flex-grow py-3 bg-penedo-emerald text-white font-bold rounded-2xl text-sm hover:bg-penedo-forest transition-colors">Aceitar</button>
                <button onClick={() => setShowCookies(false)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-200 transition-colors">Recusar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: DetailItem | null, onClose: () => void }) {
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

  const whatsappUrl = `https://wa.me/55${item.whatsapp || '24992087767'}?text=${encodeURIComponent(getWhatsAppMessage())}`;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative h-64 sm:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
            {/* Blurred Background Layer for Contained Images */}
            {['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-girassol', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe'].includes(item.id) && (
              <div 
                className="absolute inset-0 z-0 opacity-40 scale-110 blur-xl"
                style={{ 
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}
            <img 
              src={item.image} 
              className={`relative z-10 w-full h-full ${
                item.id === 'hotel-girassol'
                  ? 'object-contain object-center p-4'
                  : ['pequena-finlandia', 'pequena-finlandia-shopping', 'lelu-museu', 'hotel-bertell', 'hotel-britannia', 'hotel-daniela', 'hotel-rio-penedo', 'hotel-do-sino', 'hotel-titanic', 'pousada-aurora-mantiqueira', 'pousada-chez-nous', 'pousada-penedo', 'pousada-reserva-penedo', 'pousada-terraco', 'pousada-villa-luna', 'pousada-rainha-da-mata', 'vila-francesa-hotel', 'aglio-e-olio', 'bazzini-pizzeria', 'borbulha-penedo', 'botegare', 'braseiro-gaucho', 'casa-da-picanha', 'casa-do-fritz', 'enoteca-serrana', 'estancia-penedo', 'kaiten-sushi', 'loazo-resto', 'petit-gourmet', 'pizza-da-villa', 'querencia', 'rei-das-trutas', 'restaurante-finlandes', 'truta-viva', 'zero-a-zero', 'tonttulakki-suklaat', 'lugano-penedo', 'lolita-penedo', 'kahvila-cafe'].includes(item.id) 
                    ? 'object-contain object-top p-4' 
                    : 'object-cover'
              }`} 
              alt={item.title} 
              referrerPolicy="no-referrer" 
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
              <span className="inline-block px-3 py-1 rounded-full bg-penedo-gold text-[10px] font-bold uppercase tracking-wider mb-2">
                {item.category}
              </span>
              <h2 className="text-3xl font-bold">{item.title}</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {item.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-penedo-emerald" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.hours && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-penedo-emerald" />
                  <span>{item.hours}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                {item.rating && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-penedo-gold fill-penedo-gold" />
                    <span className="font-bold text-penedo-graphite">{item.rating}</span>
                  </div>
                )}
                {item.tripadvisorUrl && (
                  <div className="flex items-center gap-2">
                    <a href={item.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="text-penedo-emerald hover:underline font-semibold flex items-center gap-1">
                      <span>Ver no Tripadvisor</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg">
                {item.fullInfo}
              </p>
            </div>
            
            <div className="pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a 
                href={item.link_maps || item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' ' + (item.location || 'Penedo Itatiaia RJ'))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('map_location', item.category, item.title)}
                className="py-4 bg-penedo-forest text-white font-bold rounded-2xl hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm h-full"
              >
                <MapPin size={18} /> Como Chegar
              </a>
              {(() => {
                const isPremium = item.isPremium || (item as any).is_premium;
                const isHospedagem = item.category === 'Hospedagem';
                const fallbackBookingUrl = 'https://www.booking.com/searchresults.pt-br.html?label=pt-br-booking-desktop-9_uvqir24qvA6x6xGiDvCQS652796015463%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp1031722%3Ali%3Adec%3Adm&gclid=Cj0KCQjwxvjRBhC2ARIsAI7KJa1ZHtRerJPfgkFeXecwrxjO7CkOzHPB6Gy0PC6H1ul-Q0ltXy90nk0aAiq6EALw_wcB&aid=2311236&dest_id=900048364&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&order=class';
                const bookingUrl = item.link_booking || fallbackBookingUrl;

                if (isHospedagem) {
                  if (isPremium) {
                    return (
                      <>
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
                          className="py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#128C7E] shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-sm transform active:scale-95 h-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                          </svg> WhatsApp
                        </a>
                        <a 
                          href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => pushInstagramClick({
                            business_id: item.id,
                            business_name: item.title,
                            business_category: item.category,
                            is_premium: !!(item.isPremium || item.is_premium)
                          })}
                          className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm h-full"
                          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                        >
                          <Instagram size={16} /> Instagram
                        </a>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <a 
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent('booking_lead', item.category, item.title)}
                          className="py-2 px-3 bg-[#003580] text-white font-bold rounded-2xl hover:bg-[#002252] shadow-lg shadow-blue-900/20 transition-all flex flex-col items-center justify-center gap-0.5 text-xs transform active:scale-95 h-full"
                        >
                          <div className="flex items-center gap-1.5">
                            <Calendar size={18} />
                            <span>Reservar na</span>
                          </div>
                          <span className="font-extrabold text-[13px] tracking-tight">Booking.com</span>
                        </a>
                        <a 
                          href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => pushInstagramClick({
                            business_id: item.id,
                            business_name: item.title,
                            business_category: item.category,
                            is_premium: !!(item.isPremium || item.is_premium)
                          })}
                          className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm h-full"
                          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                        >
                          <Instagram size={16} /> Instagram
                        </a>
                      </>
                    );
                  }
                } else {
                  return (
                    <>
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
                        className="py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#128C7E] shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-sm transform active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg> WhatsApp
                      </a>
                      <a 
                        href={item.instagram || item.link_instagram || "https://www.instagram.com/vemprapenedo/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => pushInstagramClick({
                          business_id: item.id,
                          business_name: item.title,
                          business_category: item.category,
                          is_premium: !!(item.isPremium || item.is_premium)
                        })}
                        className="py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                        style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                      >
                        <Instagram size={16} /> Instagram
                      </a>
                    </>
                  );
                }
              })()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getVideoEmbedData(url: string): { url: string; platform: 'youtube' | 'instagram' | 'unknown' } {
  if (!url) return { url: '', platform: 'unknown' };
  const cleanUrl = url.trim();

  // Instagram
  const igMatch = cleanUrl.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  if (igMatch && igMatch[1]) {
    return {
      url: `https://www.instagram.com/p/${igMatch[1]}/embed/`,
      platform: 'instagram'
    };
  }

  // YouTube
  if (cleanUrl.includes('/embed/')) {
    return { url: cleanUrl, platform: 'youtube' };
  }
  let videoId = '';
  const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    videoId = shortsMatch[1];
  } else {
    const vMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      videoId = vMatch[1];
    } else {
      const beMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (beMatch && beMatch[1]) {
        videoId = beMatch[1];
      } else {
        const vPathMatch = cleanUrl.match(/\/v\/([a-zA-Z0-9_-]{11})/);
        if (vPathMatch && vPathMatch[1]) {
          videoId = vPathMatch[1];
        }
      }
    }
  }
  if (videoId) {
    return { url: `https://www.youtube.com/embed/${videoId}`, platform: 'youtube' };
  }
  return { url: cleanUrl, platform: 'unknown' };
}

function PremiumDetailPage({ slug, onNavigate }: { slug: string, onNavigate: (page: Page) => void }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

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
  const mapsUrl = item.link_maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.title + ' Penedo RJ')}`;

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
            
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('map_location', item.category, item.title)}
              className="flex items-center justify-center gap-2 py-3 bg-penedo-forest text-white font-bold rounded-xl hover:bg-black transition-all text-sm shadow-md"
            >
              <MapPin size={18} /> Como Chegar
            </a>
          </>
        )}
      </div>
    );
  };

  const resolvedCoverImage = React.useMemo(() => {
    const isPremium = item.isPremium || item.is_premium;
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
  }, [item]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.category === 'Hospedagem' ? "LodgingBusiness" : item.category === 'Gastronomia' ? "FoodEstablishment" : "TouristAttraction",
    "name": item.title,
    "image": galleryImages.length > 0 ? galleryImages : [resolvedCoverImage],
    "description": item.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": item.location || "Penedo",
      "addressLocality": "Itatiaia",
      "addressRegion": "RJ",
      "addressCountry": "BR"
    },
    "telephone": item.whatsapp,
    "url": window.location.href,
  };

  return (
    <div
      className="bg-white min-h-screen pb-40 md:pb-20 relative"
    >
      <Helmet>
        <title>{item.title} - Vem Pra Penedo</title>
        <meta name="description" content={item.description} />
        <meta property="og:title" content={`${item.title} - Vem Pra Penedo`} />
        <meta property="og:description" content={item.description} />
        <meta property="og:image" content={resolvedCoverImage} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      {/* Header / Gallery */}
      <section className="pt-10 md:pt-20 md:pt-32 pb-6 md:pb-12 bg-penedo-mint/10">
        <div className="max-w-6xl mx-auto px-4">
          <button 
            onClick={() => onNavigate('home')}
            className="mb-4 md:mb-8 flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all"
          >
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          
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
                  alt={`${item.title} ${idx + 1}`} 
                  loading={idx > 2 ? "lazy" : "eager"} 
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
                            className="absolute w-full h-[calc(100%+140px)] -top-[50px] left-0 border-none scale-[1.01]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <iframe
                            src={videoData.url}
                            title={`Vídeo - ${item.title}`}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
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

      {/* Sticky Mobile Buttons */}
      <ActionButtons sticky />
    </div>
  );
}

function SearchPromo({ onSearch, query, minimal = false }: { onSearch: (q: string) => void, query: string, minimal?: boolean }) {
  return (
    <section className={`search-promo ${minimal ? 'search-promo-minimal' : ''}`}>
      <div className="search-promo-content">
        {!minimal && (
          <>
            <h2 className="promo-title">Descubra o Melhor de Penedo!</h2>
            <p className="promo-description">
              Encontre facilmente as pousadas mais charmosas, hotéis aconchegantes e os restaurantes
              com a culinária mais saborosa de Penedo e região. Sua aventura começa aqui!
            </p>
          </>
        )}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por pousadas, hotéis, restaurantes..." 
            className="search-input"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button type="button" className="search-button">
            <Search size={20} />
          </button>
        </div>
        {!minimal && (
          <p className="promo-tip">
            *Dica: Digite o nome ou uma palavra-chave para resultados rápidos!
          </p>
        )}
      </div>
    </section>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className="fixed bottom-8 right-8 z-[90] p-4 bg-penedo-emerald text-white rounded-full shadow-2xl shadow-penedo-emerald/30 hover:bg-penedo-forest border-2 border-white/20 transition-all flex items-center justify-center group cursor-pointer"
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} className="group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function HomePage({ 
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://avozdacidade.com/wp/wp-content/uploads/2021/03/Portal-de-Informa%C3%A7%C3%B5es-Turisticas-de-Penedo-Divulga%C3%A7%C3%A3o-PMI.jpeg" 
            className="w-full h-full object-cover" 
            alt="Penedo"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 mb-6 rounded-full bg-penedo-gold/20 border border-penedo-gold/30 text-penedo-gold text-sm font-semibold tracking-widest uppercase"
          >
            Descubra o Paraíso
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            A Magia de <span className="text-penedo-gold drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">Penedo</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Entre a natureza exuberante e o charme da colonização finlandesa, encontre o seu refúgio perfeito na Serra da Mantiqueira.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="#/gastronomia"
              onClick={(e) => { e.preventDefault(); onNavigate('gastronomia'); }} 
              className="px-8 py-4 bg-penedo-emerald hover:bg-penedo-forest text-white rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explorar Agora <ArrowRight size={20} />
            </a>
            <a 
              href="#/compras"
              onClick={(e) => { e.preventDefault(); onNavigate('compras'); }} 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              Onde Comprar
            </a>
          </motion.div>
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
          <Carousel 
            title="O Que Fazer"
            subtitle="Descubra as melhores atrações e passeios."
            items={shuffledOQueFazer}
            renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
            onNavigate={() => onNavigate('o-que-fazer')}
          />

          {/* Onde Ficar Section */}
          <Carousel 
            title="Onde Ficar"
            subtitle="Pousadas e hotéis para o seu descanso."
            items={shuffledOndeFicar}
            renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
            onNavigate={() => onNavigate('onde-ficar')}
          />

          {/* Gastronomia Section */}
          <Carousel 
            title="Gastronomia"
            subtitle="Os melhores sabores de Penedo."
            items={shuffledGastronomia}
            renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
            onNavigate={() => onNavigate('gastronomia')}
          />

          {/* Compras Section */}
          <Carousel 
            title="Compras & Lojas"
            subtitle="Artesanato e produtos exclusivos."
            items={shuffledCompras}
            renderItem={(item) => <InfoCard item={item} onOpen={onOpenDetail} />}
            onNavigate={() => onNavigate('compras')}
          />

          {/* Blog Section */}
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
    </>
  )}
</motion.div>
);
}

function FeatureCard({ title, description, image, onClick }: { title: string, description: string, image: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img src={image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={title} referrerPolicy="no-referrer" />
      </div>
      <div className="p-6 text-left">
        <h3 className="text-xl font-bold mb-2 text-penedo-forest">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button className="text-penedo-gold font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          Ver mais <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}


function WhatToDoPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DETAILS_DATA['o-que-fazer'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = (a as any).is_premium || a.isPremium ? 1 : 0;
    const bPremium = (b as any).is_premium || b.isPremium ? 1 : 0;
    if (aPremium !== bPremium) return bPremium - aPremium;
    return a.title.localeCompare(b.title);
  });

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredItems.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
            <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">O Que Fazer</span>
          </div>
        </div>
      </div>
<header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/assets/imagens/penedo_sightseeing.jpg" className="w-full h-full object-cover" alt="Background" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">O Que Fazer em <span className="text-penedo-gold">Penedo</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">
            Descubra cachoeiras cristalinas, trilhas deslumbrantes e o charme único da Pequena Finlândia. 
            O melhor do lazer e da cultura em um só lugar para você aproveitar.
          </p>
        </div>
      </header>

      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-20">
            <p className="text-gray-500 text-xl">Nenhum resultado encontrado para "{searchQuery}"</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function WhereToStayPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = DETAILS_DATA['onde-ficar'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = (a as any).is_premium || a.isPremium ? 1 : 0;
    const bPremium = (b as any).is_premium || b.isPremium ? 1 : 0;
    if (aPremium !== bPremium) return bPremium - aPremium;
    return a.title.localeCompare(b.title);
  });

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredItems.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
            <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">Onde Ficar</span>
          </div>
        </div>
      </div>
<header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1920&h=1080" className="w-full h-full object-cover" alt="Background" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Onde <span className="text-penedo-gold">Ficar</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">
            Das pousadas românticas aos hotéis fazenda com lazer completo. Encontre o refúgio 
            perfeito para recarregar as energias com o ar puro da Serra da Mantiqueira.
          </p>
        </div>
      </header>
      
      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-20">
            <p className="text-gray-500 text-xl">Nenhum resultado encontrado para "{searchQuery}"</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function GastronomyPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DETAILS_DATA['gastronomia'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = (a as any).is_premium || a.isPremium ? 1 : 0;
    const bPremium = (b as any).is_premium || b.isPremium ? 1 : 0;
    if (aPremium !== bPremium) return bPremium - aPremium;
    return a.title.localeCompare(b.title);
  });

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredItems.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
            <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">Gastronomia</span>
          </div>
        </div>
      </div>
<header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1920&h=1080" className="w-full h-full object-cover" alt="Background" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Gastronomia em <span className="text-penedo-gold">Penedo</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">
            Uma jornada gastronômica que une fondues aconchegantes, trutas frescas e o legado 
            dos imigrantes finlandeses. Sabores inesquecíveis esperam por você.
          </p>
        </div>
      </header>

      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-20">
            <p className="text-gray-500 text-xl">Nenhum resultado encontrado para "{searchQuery}"</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function ShoppingPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DETAILS_DATA['compras'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = (a as any).is_premium || a.isPremium ? 1 : 0;
    const bPremium = (b as any).is_premium || b.isPremium ? 1 : 0;
    if (aPremium !== bPremium) return bPremium - aPremium;
    return a.title.localeCompare(b.title);
  });

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      pushSearch(searchQuery, filteredItems.length);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filteredItems.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
            <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={onGoBack} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">Compras</span>
          </div>
        </div>
      </div>
<header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1920&h=1080" className="w-full h-full object-cover" alt="Background" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Compras em <span className="text-penedo-gold">Penedo</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">
            Leve um pedaço de Penedo com você. Explore lojas de chocolates artesanais, 
            decorações exclusivas e artesanatos locais de alta qualidade.
          </p>
        </div>
      </header>

      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <InfoCard key={item.id} item={item} onOpen={onOpenDetail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-20">
            <p className="text-gray-500 text-xl">Nenhum resultado encontrado para "{searchQuery}"</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/seed/contact/1920/1080" className="w-full h-full object-cover" alt="Background" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Fale <span className="text-penedo-gold">Conosco</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">Estamos aqui para ajudar você a planejar sua viagem.</p>
        </div>
      </header>
      <section className="py-10 md:py-24 bg-white max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-4 md:mb-8 text-penedo-forest">Canais de Atendimento</h2>
            <div className="space-y-6">
              <ContactCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                } 
                label="WhatsApp" 
                value="24 992087767" 
                href="https://wa.me/5524992087767" 
                color="bg-[#25D366]"
              />
              <ContactCard 
                icon={<Mail size={24} />} 
                label="E-mail" 
                value="contato@vemprapenedo.com.br" 
                href="mailto:contato@vemprapenedo.com.br" 
                color="bg-penedo-emerald"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 md:mb-8 text-penedo-forest">Redes Sociais</h2>
            <div className="space-y-6">
              <ContactCard 
                icon={<Instagram size={20} />} 
                label="Instagram" 
                value="@vemprapenedo" 
                href="https://www.instagram.com/vemprapenedo/" 
                customStyle={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
              />
              <ContactCard 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.2 2.27 2.02 3.75 2.36v3.91a11.55 11.55 0 0 1-5.32-1.39v6.17c.05 1.5-.32 2.99-1.07 4.29-.75 1.3-1.85 2.36-3.17 3.03-1.32.67-2.81.98-4.28.9-1.47-.08-2.91-.6-4.13-1.5a8.7 8.7 0 0 1-2.61-3.61C.31 16.92.15 15.35.73 13.88c.58-1.47 1.6-2.73 2.91-3.6 1.31-.87 2.87-1.31 4.45-1.25.12 0 .23.01.35.03v4.06c-.12-.03-.25-.05-.37-.05-1.12-.03-2.22.42-2.98 1.23-.76.81-1.08 1.93-.89 3.02.19 1.1.92 2.02 1.94 2.51.15.07.31.13.48.17.65.17 1.34.1 1.95-.2.61-.31 1.08-.82 1.34-1.45.21-.51.3-1.05.27-1.6V0h2.33z" />
                  </svg>
                } 
                label="TikTok" 
                value="@vemprapenedo" 
                href="https://www.tiktok.com/@vemprapenedo" 
                color="bg-black"
              />
              <ContactCard 
                icon={<Facebook size={24} />} 
                label="Facebook" 
                value="Vem Pra Penedo" 
                href="https://www.facebook.com/vemprapenedo" 
                color="bg-[#1877F2]"
              />
            </div>
          </div>
        </div>

        {/* Parcerias */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-24 p-12 rounded-[3rem] bg-penedo-forest text-white text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-penedo-gold text-penedo-forest mb-6 shadow-xl">
              <Handshake size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Seja um Parceiro</h2>
            <p className="text-white/80 text-lg mb-6 md:mb-10 max-w-2xl mx-auto">Tem um negócio em Penedo? Junte-se a nós para promover o melhor da nossa região para milhares de visitantes.</p>
            <a 
              href="https://wa.me/5524992087767" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-penedo-gold text-penedo-forest font-bold rounded-full hover:bg-white transition-all inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/.svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg> Quero ser parceiro
            </a>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

function ContactCard({ icon, label, value, href, color, customStyle }: { icon: React.ReactNode, label: string, value: string, href: string, color?: string, customStyle?: React.CSSProperties }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-penedo-emerald hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center transition-transform group-hover:scale-110 ${color || ''}`} style={customStyle}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="font-bold text-penedo-graphite">{value}</p>
      </div>
    </a>
  );
}

function BlogPage({ onOpenDetail, onNavigate, activeArticle, onSelectArticle }: { onOpenDetail: (item: DetailItem) => void, onNavigate: (page: Page) => void, activeArticle: string | null, onSelectArticle: (id: string | null) => void }) {
  const scrollToAnchor = (id: string) => {
    // Timeout para garantir que o DOM esteja pronto e evitar conflitos com transições do motion
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 140; // Espaço para o menu sticky superior
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const SectionHeader = ({ title, subtitle, icon: Icon, dark = false }: { title: string, subtitle?: string, icon?: any, dark?: boolean }) => (
    <div className="mb-6 md:mb-10">
      <div className={`flex items-center ${Icon ? 'gap-4' : 'gap-0'} mb-4`}>
        {Icon && <div className="p-3 bg-penedo-mint rounded-2xl text-penedo-forest shrink-0"><Icon size={24} /></div>}
        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter ${dark ? 'text-white' : 'text-penedo-forest'}`}>
          {title}
        </h2>
      </div>
      {subtitle && <p className={`${dark ? 'text-white/80' : 'text-gray-500'} text-lg max-w-2xl leading-relaxed`}>{subtitle}</p>}
      <div className="h-1.5 w-32 bg-penedo-gold mt-6 rounded-full"></div>
    </div>
  );

  const TipBox = ({ children, className = "", fullHeight = false, imageUrl, fit = "cover" }: { children?: React.ReactNode, className?: string, fullHeight?: boolean, imageUrl?: string, fit?: 'cover' | 'contain' }) => (
    <div className={`flex flex-col items-center ${fullHeight ? 'h-full' : 'my-8'} ${className}`}>
      <div className={`bg-white p-3 ${children ? 'pb-6' : 'pb-3'} shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 rounded-xl transform rotate-1 hover:rotate-0 transition-all duration-700 w-full group ${fullHeight ? 'h-full flex flex-col' : (children ? 'max-w-xs' : 'max-w-[260px]')}`}>
        {/* Photo Area */}
        <div className={`bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-3 relative overflow-hidden ${fullHeight ? 'flex-1' : 'aspect-square'} ${children ? 'mb-4' : 'mb-0'}`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Penedo" 
              className={`w-full h-full ${fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://picsum.photos/seed/${imageUrl.split('/').pop()}/800/800`;
              }}
            />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-penedo-mint/40 flex items-center justify-center text-penedo-emerald transform group-hover:scale-110 transition-transform duration-500">
                <Camera size={24} />
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Moldura de Foto</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </>
          )}
          
          {/* Decorative Corner Tabs */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gray-200"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gray-200"></div>
        </div>
        
        {/* Content Area */}
        {children && (
          <div className="px-3 text-center mt-4">
            <div className="text-penedo-forest font-medium italic text-sm leading-relaxed">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const handleSelectArticle = (id: string | null) => {
    onSelectArticle(id);
  };

  if (activeArticle === 'cachoeiras-penedo') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
        <Helmet>
          <title>Cachoeiras em Penedo RJ: As Melhores para Visitar - Vem Pra Penedo</title>
          <meta name="description" content="Explore as melhores cachoeiras em Penedo RJ. Guia completo com Três Cachoeiras, Cachoeira de Deus e dicas exclusivas para sua aventura." />
          <meta property="og:title" content="Cachoeiras em Penedo RJ: As Melhores para Visitar - Vem Pra Penedo" />
          <meta property="og:description" content="Explore as melhores cachoeiras em Penedo RJ. Guia completo com Três Cachoeiras, Cachoeira de Deus e dicas exclusivas para sua aventura." />
          <meta property="og:image" content="/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg" />
          <meta property="og:type" content="article" />
        </Helmet>
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <button onClick={() => handleSelectArticle(null)} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer">
              <ArrowRight className="rotate-180" size={20} /> Voltar para o Blog
            </button>
            <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
              Lendo: <span className="text-penedo-forest">Cachoeiras em Penedo RJ</span>
            </div>
          </div>
        </div>

        {/* 1. HEADER / HERO */}
        <header className="relative pt-10 md:pt-20 md:pt-32 pb-8 md:pb-16 md:pt-40 md:pb-24 bg-penedo-forest text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
            <img 
              src="/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg" 
              className="w-full h-full object-cover" 
              alt="cachoeiras em Penedo RJ natureza e tranquilidade" 
              referrerPolicy="no-referrer"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/waterfall/1920/1080"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-penedo-forest/60 via-transparent to-penedo-forest"></div>
          </div>
          <div className="relative z-10 px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 bg-penedo-gold text-penedo-forest text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl"
            >
              Natureza & Aventura
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
            >
              Cachoeiras em <span className="text-penedo-gold italic">Penedo RJ</span>: As Melhores para Visitar
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Um guia completo para refrescar o corpo e a alma nas águas mais cristalinas da Serra da Mantiqueira.
            </motion.p>
          </div>
        </header>

        {/* 2. INTRODUÇÃO */}
        <section className="py-8 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-xl prose-penedo max-w-none">
              <h2 className="text-3xl font-black text-penedo-forest mb-4 md:mb-8 flex items-center gap-3">
                <span className="text-2xl">🌿</span> Introdução
              </h2>
              <div className="text-gray-600 space-y-6 text-lg leading-relaxed">
                <p>
                  Se você está buscando contato com a natureza, água limpa e momentos de tranquilidade, explorar as <strong>cachoeiras em Penedo RJ</strong> é uma das melhores experiências da região. Cercada pela Serra da Mantiqueira, Penedo oferece cenários perfeitos para relaxar, se refrescar e fugir da rotina — tudo isso com aquele clima de paz que só a natureza proporciona.
                </p>
                <p>
                  Seja para um mergulho revigorante ou apenas para apreciar o som da água correndo, as cachoeiras daqui encantam visitantes o ano inteiro.
                </p>
              </div>

              {/* IMAGEM 1 */}
              <div className="my-16 group overflow-hidden rounded-3xl shadow-2xl border-8 border-white">
                <img 
                  src="/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg" 
                  alt="cachoeiras em Penedo RJ natureza e tranquilidade" 
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/penedo-nature/1200/600"; }}
                />
              </div>

              {/* 3. PRINCIPAIS CACHOEIRAS */}
              <h2 className="text-3xl font-black text-penedo-forest mb-6 md:mb-12 mt-10 md:mt-20 flex items-center gap-3">
                <span className="text-2xl">💧</span> Principais cachoeiras
              </h2>

              <div className="space-y-24">
                {/* Três Cachoeiras */}
                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-4 md:mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-penedo-emerald text-white flex items-center justify-center shrink-0 shadow-lg shadow-penedo-emerald/30">
                      <Mountain size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-penedo-forest mb-2">🌊 Três Cachoeiras</h3>
                      <p className="text-penedo-emerald font-bold tracking-widest text-xs uppercase">Acesso fácil • Familiar</p>
                    </div>
                  </div>
                  <div className="text-gray-600 space-y-4 mb-4 md:mb-8">
                    <p>Uma das mais acessíveis e populares de Penedo. O caminho é curto e fácil, ideal para quem quer curtir sem fazer grandes trilhas.</p>
                    <p>Perfeita para banho, com águas claras e quedas suaves — ótima para ir com família.</p>
                  </div>
                  {/* IMAGEM 2 */}
                  <div className="overflow-hidden rounded-2xl group shadow-lg">
                    <img 
                      src="/assets/imagens/blog/cachoeiras-penedo/tres-cachoeiras.jpg" 
                      alt="Três Cachoeiras em Penedo RJ banho fácil acesso" 
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/tres-cachoeiras/1000/600"; }}
                    />
                  </div>
                </div>

                {/* Cachoeira de Deus */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 border-2 border-penedo-mint shadow-xl">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-4 md:mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-penedo-gold text-penedo-forest flex items-center justify-center shrink-0 shadow-lg shadow-penedo-gold/30">
                      <Star size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-penedo-forest mb-2">🌊 Cachoeira de Deus</h3>
                      <p className="text-penedo-gold font-bold tracking-widest text-xs uppercase">Cartão Postal • Imponente</p>
                    </div>
                  </div>
                  <div className="text-gray-600 space-y-4 mb-4 md:mb-8">
                    <p>A mais famosa e imponente da região. Com uma queda d’água alta e um visual impressionante, é parada obrigatória para quem visita Penedo.</p>
                    <p>O acesso exige uma pequena trilha, mas a recompensa vale cada passo.</p>
                  </div>
                  {/* IMAGEM 3 */}
                  <div className="overflow-hidden rounded-2xl group shadow-lg">
                    <img 
                      src="/assets/imagens/blog/cachoeiras-penedo/Cachoeira-de-Deus.jpg" 
                      alt="Cachoeira de Deus Penedo RJ maior cachoeira da região" 
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/cachoeira-deus/1000/600"; }}
                    />
                  </div>
                </div>

                {/* Poço das Esmeraldas */}
                <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-4 md:mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-penedo-mint text-penedo-forest flex items-center justify-center shrink-0 shadow-lg">
                      <Droplets size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-penedo-forest mb-2">🌊 Poço das Esmeraldas</h3>
                      <p className="text-penedo-emerald font-bold tracking-widest text-xs uppercase">Tranquilidade • Águas Verdes</p>
                    </div>
                  </div>
                  <div className="text-gray-600 space-y-4 mb-4 md:mb-8">
                    <p>Mais reservado e tranquilo, esse é o lugar ideal para quem busca sossego.</p>
                    <p>A água com tom esverdeado dá nome ao local e cria um cenário perfeito para relaxar longe do movimento.</p>
                  </div>
                  {/* IMAGEM 4 */}
                  <div className="overflow-hidden rounded-2xl group shadow-lg">
                    <img 
                      src="/assets/imagens/blog/cachoeiras-penedo/poco-das-esmeraldas.jpg" 
                      alt="Poço das Esmeraldas Penedo RJ água verde tranquila" 
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/esmeraldas/1000/600"; }}
                    />
                  </div>
                </div>

                {/* Dica Extra: Poço do Céu */}
                <div className="relative overflow-hidden bg-penedo-forest text-white rounded-[3rem] p-10 md:p-16 shadow-2xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-penedo-gold/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-penedo-gold mb-4 md:mb-8 flex items-center gap-3">
                      <span className="text-2xl">✨</span> Dica Extra: Poço do Céu – Serrinha do Alambari
                    </h3>
                    <div className="text-white/80 space-y-6 text-lg mb-6 md:mb-10">
                      <p>Um verdadeiro paraíso escondido! Fica um pouco afastado do centro de Penedo, mas é considerado um dos lugares mais bonitos da região.</p>
                      <p>Água cristalina, natureza preservada e uma vibe única — perfeito para quem quer algo mais exclusivo.</p>
                    </div>
                    {/* IMAGEM DICA EXTRA */}
                    <div className="overflow-hidden rounded-2xl group shadow-lg mb-6 md:mb-10">
                      <img 
                        src="/assets/imagens/blog/cachoeiras-penedo/poco-do-ceu.jpg" 
                        alt="Poço do Céu Serrinha do Alambari RJ paraíso escondido" 
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://picsum.photos/seed/poco-ceu/1000/600"; }}
                      />
                    </div>
                    <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <p className="text-penedo-gold font-bold flex items-center gap-2">
                        <Info size={20} /> 💡 Dica: Chegue cedo para aproveitar as cachoeiras mais vazias e com água mais limpa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. DICAS ADICIONAIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-16 md:mt-32">
                <div className="p-10 bg-penedo-mint/20 rounded-3xl border border-penedo-mint shadow-sm h-full">
                  <h2 className="text-2xl font-black text-penedo-forest mb-6 flex items-center gap-3">
                    <span className="text-xl">🥾</span> Dicas para visitar
                  </h2>
                  <ul className="space-y-4 text-gray-700 font-medium">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-penedo-gold rounded-full" /> Use tênis ou calçado adequado para trilhas</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-penedo-gold rounded-full" /> Leve água e lanches leves</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-penedo-gold rounded-full" /> Tenha atenção com pedras escorregadias</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-penedo-gold rounded-full" /> Respeite a natureza (não deixe lixo)</li>
                  </ul>
                </div>

                <div className="p-10 bg-orange-50 rounded-3xl border border-orange-100 shadow-sm h-full">
                  <h2 className="text-2xl font-black text-penedo-forest mb-6 flex items-center gap-3">
                    <span className="text-xl">☀️</span> Melhor horário
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-medium mb-4">
                    O melhor período para visitar as <strong>cachoeiras em Penedo RJ</strong> é pela <strong>manhã ou início da tarde</strong>.
                  </p>
                  <p className="text-gray-600 text-sm italic border-l-2 border-orange-200 pl-4">
                    Além de aproveitar melhor a luz natural, você evita locais muito cheios e garante uma experiência mais tranquila.
                  </p>
                </div>
              </div>

              {/* 5. SEGURANÇA */}
              <div className="mt-16 p-10 bg-red-50 rounded-[3rem] border border-red-100 text-left">
                <h2 className="text-2xl font-black text-red-700 mb-6 flex items-center gap-3">
                  <span className="text-xl">⚠️</span> Segurança
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                  <div className="text-red-900/80 font-bold bg-white/50 p-4 rounded-2xl">Evite visitas em dias de chuva forte</div>
                  <div className="text-red-900/80 font-bold bg-white/50 p-4 rounded-2xl">Fique atento ao nível da água</div>
                  <div className="text-red-900/80 font-bold bg-white/50 p-4 rounded-2xl">Nunca subestime a correnteza</div>
                </div>
              </div>

              {/* 6. CONCLUSÃO / EXPLORE MAIS */}
              <section className="mt-16 md:mt-32 text-center">
                <h2 className="text-3xl font-black text-penedo-forest mb-4 md:mb-8 flex items-center justify-center gap-3">
                  <span className="text-2xl">📍</span> Explore mais de Penedo
                </h2>
                <p className="text-gray-600 mb-6 md:mb-12 text-xl max-w-2xl mx-auto">
                  Quer aproveitar ao máximo sua viagem e descobrir todos os segredos da Finlândia Brasileira?
                </p>
                <p className="text-gray-400 text-sm mb-8 italic">Publicado em 21/06/2026.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <button 
                    onClick={() => handleSelectArticle('penedo-guia')}
                    className="w-full sm:w-auto px-10 py-5 bg-penedo-emerald text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-penedo-forest transition-all shadow-xl shadow-penedo-emerald/30 transform hover:-translate-y-1"
                  >
                    Ver roteiro completo de Penedo
                  </button>
                  <button 
                    onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá,%20vim%20do%20site%20Vem%20Pra%20Penedo%20e%20gostaria%20de%20mais%20informações!')}
                    className="w-full sm:w-auto px-10 py-5 bg-white text-penedo-emerald border-2 border-penedo-emerald rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-penedo-mint transition-all shadow-lg transform hover:-translate-y-1"
                  >
                    Falar no WhatsApp
                  </button>
                </div>
              </section>

            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-10 md:py-24 bg-penedo-forest relative overflow-hidden text-white border-t border-white/10">
          <div className="absolute inset-0 z-0 opacity-10">
            <img src="https://picsum.photos/seed/penedo-water/1920/1080?blur=5" className="w-full h-full object-cover" alt="Footer" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight">Tornamos sua visita inesquecível</h2>
            <p className="text-lg text-white/70 mb-6 md:mb-10 max-w-xl mx-auto">Descubra os melhores passeios, restaurantes e experiências em um só lugar.</p>
            <div className="flex justify-center">
              <BlogPostCTA 
                label="Falar com Especialista" 
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá,%20vim%20do%20site%20Vem%20Pra%20Penedo%20e%20gostaria%20de%20mais%20informações!')} 
                primary={true} 
              />
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  if (activeArticle === 'penedo-guia') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
        <Helmet>
          <title>Guia Completo: O Que Fazer em Penedo RJ - Vem Pra Penedo</title>
          <meta name="description" content="Descubra os encantos da Finlândia Brasileira. Um destino mágico na Serra da Mantiqueira com cachoeiras, gastronomia e muita cultura." />
          <meta property="og:title" content="Guia Completo: O Que Fazer em Penedo RJ - Vem Pra Penedo" />
          <meta property="og:description" content="Descubra os encantos da Finlândia Brasileira. Um destino mágico na Serra da Mantiqueira com cachoeiras, gastronomia e muita cultura." />
          <meta property="og:image" content="/assets/imagens/blog/penedo-guia/capa.jpg" />
          <meta property="og:type" content="article" />
        </Helmet>
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4">
          <div className="max-w-7xl mx-auto px-4">
            <button onClick={() => handleSelectArticle(null)} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer">
              <ArrowRight className="rotate-180" size={20} /> Voltar para o Blog
            </button>
          </div>
        </div>
        {/* Full Guia Content */}
        <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img src="/assets/imagens/blog/penedo-guia/capa.jpg" className="w-full h-full object-cover" alt="Penedo RJ" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 px-4 max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              Guia Completo: <span className="text-penedo-gold">O Que Fazer em Penedo</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm"
            >
              Descubra os encantos da Finlândia Brasileira. Um destino mágico na Serra da Mantiqueira esperando por você.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <BlogPostCTA label="Ver hospedagens em Penedo" onClick={() => scrollToAnchor('onde-se-hospedar')} />
            </motion.div>
          </div>
        </header>

        {/* 2. INTRODUÇÃO */}
        <section className="py-8 md:py-16 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-xl prose-penedo max-w-none">
              <p className="text-2xl text-penedo-forest font-serif italic mb-6 md:mb-10 leading-relaxed border-l-4 border-penedo-gold pl-8 text-left">
                Bem-vindo a Penedo, RJ! Este charmoso recanto serrano, aninhado em Itatiaia, é o refúgio perfeito para quem busca tranquilidade, natureza exuberante e um toque de cultura europeia.
              </p>
              <div className="text-gray-600 space-y-6 text-left">
                <p>
                  Conhecida como a <strong>"Finlândia Brasileira"</strong>, Penedo encanta com sua arquitetura diferenciada, o clima ameno de serra e uma atmosfera acolhedora que convida ao relaxamento.
                </p>
                <p>
                  Prepare-se para descobrir as maravilhas que fazem de Penedo um destino tão especial para casais, famílias e amantes da natureza.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ONDE FICA E COMO CHEGAR */}
        <section className="py-8 md:py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader title="Onde Fica e Como Chegar" icon={MapIcon} />
            <p className="text-gray-600 mb-6 md:mb-10 leading-relaxed">Chegar a <strong>Penedo, RJ</strong>, é mais fácil do que você imagina, seja vindo do Rio de Janeiro ou de São Paulo. A cidade está estrategicamente localizada para oferecer fácil acesso.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-stretch h-full">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-penedo-emerald/10 text-penedo-emerald flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-penedo-forest mb-1">Distância</h4>
                    <p className="text-gray-500 text-sm">Penedo fica a aproximadamente 180 km do Rio de Janeiro e 280 km de São Paulo.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-penedo-emerald/10 text-penedo-emerald flex items-center justify-center shrink-0">
                    <Car size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-penedo-forest mb-1">Acesso de Carro</h4>
                    <p className="text-gray-500 text-sm">O principal acesso é pela Rodovia Presidente Dutra (BR-116). Pegue a saída 311 (Itatiaia/Penedo).</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-penedo-emerald/10 text-penedo-emerald flex items-center justify-center shrink-0">
                    <Bus size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-penedo-forest mb-1">Acesso de Ônibus</h4>
                    <p className="text-gray-500 text-sm">Pegue ônibus até Resende ou Itatiaia e utilize táxis, aplicativos ou ônibus locais para o centrinho de Penedo.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center h-full">
                <TipBox className="w-full" imageUrl="/assets/imagens/blog/penedo-guia/guia-penedo-1.png">
                  Pequena Finlândia
                </TipBox>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRINCIPAIS PONTOS TURÍSTICOS */}
        <section id="pontos-turisticos" className="py-8 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Principais Pontos Turísticos" icon={Camera} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { id: "card-casa-do-papai-noel", title: "Casa do Papai Noel", desc: "Um lugar mágico que funciona o ano todo, onde a magia do Natal se encontra com a arquitetura europeia." },
                { id: "card-pequena-finlandia", title: "Pequena Finlândia", desc: "Construções coloridas, lojas de artesanato e chocolaterias que remetem à Finlândia." },
                { id: "card-museu-finlandes", title: "Museu Finlandês", desc: "Acervo de Dona Eva que conta a história da colonização com fotos, objetos e documentos." }
              ].map((p, i) => (
                <motion.div 
                  key={i} 
                  id={p.id}
                  whileHover={{ y: -8 }}
                  className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 hover:border-penedo-gold transition-all group scroll-mt-24 md:scroll-mt-32"
                >
                  <h4 className="text-xl font-bold text-penedo-forest mb-3 group-hover:text-penedo-gold">{p.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PASSEIOS IMPERDÍVEIS */}
        <section id="passeios" className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Passeios Imperdíveis" icon={Star} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-stretch h-full">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>Em <strong>Penedo, RJ</strong>, há sempre algo novo para explorar, seja você um aventureiro ou alguém que prefere um ritmo mais tranquilo:</p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-penedo-gold rounded-full" /> 
                    <span><strong><button type="button" onClick={() => scrollToAnchor('secao-cachoeiras')} className="hover:text-penedo-gold transition-colors cursor-pointer outline-none border-b border-dotted border-penedo-gold/30">Trilhas e Cachoeiras</button></strong>: Explore trilhas que levam a mirantes e quedas escondidas.</span>
                  </li>
                  <li className="flex items-center gap-3">
<div className="w-2 h-2 bg-penedo-gold rounded-full" /> 
                    <span><strong>Cafés e Chocolaterias:</strong> Saboreie chocolates artesanais com receitas tradicionais finlandesas.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-penedo-gold rounded-full" /> 
                    <span><strong>Caminhada no Centrinho:</strong> Descubra lojas charmosas e encontre souvenirs únicos a pé.</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-stretch justify-center h-full">
                <TipBox fullHeight fit="contain" className="h-full w-full" imageUrl="/assets/imagens/blog/penedo-guia/guia-penedo-2.png">
                  Fonte: Restaurante Jardim Secreto
                </TipBox>
              </div>
            </div>
          </div>
        </section>

        {/* 6. O QUE FAZER EM PENEDO EM 1 DIA */}
        <section id="roteiro-1-dia" className="py-8 md:py-16 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader title="Roteiro: O que fazer em 1 Dia" icon={Clock} />
            <div className="space-y-6">
              {[
                { time: "Manhã", plan: <>Comece pela <button type="button" onClick={() => scrollToAnchor('card-pequena-finlandia')} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Pequena Finlândia</button> e a <button type="button" onClick={() => scrollToAnchor('card-casa-do-papai-noel')} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Casa do Papai Noel</button>. Aproveite para tomar um café da manhã reforçado em uma das padarias locais.</> },
                { time: "Tarde", plan: <>Visite as <button type="button" onClick={() => scrollToAnchor('desc-tres-cachoeiras')} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Três Cachoeiras</button> para um contato revigorante com a natureza. Se tiver tempo, almoce por lá apreciando a vista.</> },
                { time: "Noite", plan: "Jante em um dos restaurantes típicos da região e aproveite para comprar chocolates artesanais e souvenirs." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start p-8 bg-penedo-mint/20 rounded-3xl border border-penedo-emerald/10 hover:border-penedo-gold transition-colors">
                  <span className="px-4 py-1 rounded-full bg-penedo-gold text-penedo-forest font-black text-sm uppercase tracking-widest shadow-sm">{step.time}</span>
                  <p className="text-penedo-forest font-medium leading-relaxed">{step.plan}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. O QUE FAZER EM PENEDO EM 2 DIAS */}
        <section id="roteiro-2-dias" className="py-10 md:py-24 bg-penedo-forest text-white">
          <div className="max-w-5xl mx-auto px-4">
            <SectionHeader title="Roteiro: 2 Dias em Penedo" dark={true} />
            <div className="grid grid-cols-1 gap-6 md:gap-12">
              <div className="p-10 bg-white/10 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-penedo-gold">Dia 1: Imersão Cultural</h3>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p><strong className="text-penedo-gold">Manhã:</strong> Chegue cedo e explore as lojas da <button type="button" onClick={() => scrollToAnchor('card-pequena-finlandia')} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Pequena Finlândia</button>. Almoce por lá.</p>
                  <p><strong className="text-penedo-gold">Tarde:</strong> Visite a <button type="button" onClick={() => scrollToAnchor('card-casa-do-papai-noel')} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Casa do Papai Noel</button> e o <button type="button" onClick={() => scrollToAnchor('card-museu-finlandes')} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Museu Finlandês</button> para mergulhar na história local.</p>
                  <p><strong className="text-penedo-gold">Noite:</strong> Desfrute de um jantar romântico em um dos renomados restaurantes de Penedo.</p>
                </div>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-penedo-gold">Dia 2: Aventura e Natureza</h3>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p><strong className="text-penedo-gold">Manhã:</strong> Dedique-se às cachoeiras. Visite as <button type="button" onClick={() => scrollToAnchor('desc-tres-cachoeiras')} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Três Cachoeiras</button> ou faça a trilha até a <button type="button" onClick={() => scrollToAnchor('desc-cachoeira-de-deus')} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Cachoeira de Deus</button>.</p>
                  <p><strong className="text-penedo-gold">Tarde:</strong> Almoce com vista para a serra e aproveite para comprar lembrancinhas no artesanato local.</p>
                  <p><strong className="text-penedo-gold">Noite:</strong> Despeça-se com um fondue ou jantar descontraído saboreando as delícias locais.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. CACHOEIRAS EM PENEDO */}
        <section id="secao-cachoeiras" className="py-8 md:py-16 bg-white scroll-mt-24 md:scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Cachoeiras em Penedo" icon={Mountain} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
              {[
                { id: "desc-tres-cachoeiras", name: "Três Cachoeiras", info: "O complexo mais famoso, com fácil acesso e ótima estrutura para visitantes." },
                { id: "desc-cachoeira-de-deus", name: "Cachoeira de Deus", info: "Imponente queda que forma uma piscina natural. O acesso exige uma pequena trilha." },
                { id: "desc-rio-palmital", name: "Rio Palmital", info: "Oferece trechos com pequenas quedas e corredeiras ideais para um banho em meio à mata." }
              ].map((c, i) => (
                <div key={i} id={c.id} className="p-8 rounded-[2.5rem] bg-gray-50 border border-transparent hover:border-penedo-gold transition-all duration-300 hover:shadow-xl group scroll-mt-24 md:scroll-mt-32">
                  <h4 className="text-xl font-black text-penedo-forest mb-4 group-hover:text-penedo-emerald transition-colors">{c.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{c.info}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. GASTRONOMIA EM PENEDO */}
        <section id="gastronomia" className="py-8 md:py-16 bg-gray-50 text-center scroll-mt-24 md:scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Gastronomia: Onde Comer" icon={Utensils} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left mb-6 md:mb-12">
              {[
                { id: "rest-rei-das-trutas", name: "Rei das Trutas", desc: "Especializado em trutas frescas, preparadas de diversas formas. Um clássico de Penedo." },
                { id: "rest-casa-do-fritz", name: "Casa do Fritz", desc: "Oferece pratos da culinária alemã e finlandesa, em um ambiente aconchegante." },
                { id: "rest-petit-gourmet", name: "Petit Gourmet", desc: "Um charmoso café e bistrô com doces, salgados e pratos leves." }
              ].map((res, i) => (
                <div key={i} id={res.id} className="p-8 bg-white rounded-[2.5rem] border border-transparent hover:border-penedo-gold transition-all duration-300 hover:shadow-xl group scroll-mt-24 md:scroll-mt-32">
                  <h4 className="text-xl font-black text-penedo-forest mb-4 group-hover:text-penedo-emerald transition-colors">{res.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{res.desc}</p>
                </div>
              ))}
            </div>
            <BlogPostCTA label="Ver mais restaurantes" onClick={() => onNavigate('gastronomia')} primary={true} />
          </div>
        </section>

        {/* 10. ONDE SE HOSPEDAR */}
        <section id="onde-se-hospedar" className="py-8 md:py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Onde se Hospedar" icon={Heart} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-stretch h-full">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>Penedo, RJ, oferece uma variedade de opções de hospedagem para todos os estilos:</p>
                <ul className="space-y-3">
                  <li><strong><button type="button" onClick={() => scrollToAnchor('onde-se-hospedar')} className="hover:text-penedo-gold hover:underline transition-all cursor-pointer font-bold outline-none decoration-penedo-gold border-b border-dotted">Pousadas Românticas</button></strong>: Ideais para casais, muitas com lareira e hidromassagem.</li>
                  <li><strong>Chalés com Lareira:</strong> Perfeitos para o inverno, proporcionam ambiente acolhedor.</li>
                  <li><strong>Hotéis no Centro:</strong> Fornecendo praticidade e fácil acesso às principais atrações.</li>
                </ul>
              </div>
              <div className="flex items-stretch justify-center h-full">
                <TipBox fullHeight className="h-full w-full" imageUrl="/assets/imagens/blog/penedo-guia/guia-penedo-3.png" />
              </div>
            </div>
          </div>
        </section>

        {/* 11. MELHOR ÉPOCA PARA VISITAR */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SectionHeader title="Melhor Época para Visitar" icon={Calendar} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-penedo-emerald text-xl mb-3">Maio e Setembro</h4>
                <p className="text-gray-600 text-lg">Considerados os melhores meses: clima ameno, agradável e ideal para passeios ao ar livre.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-penedo-emerald text-xl mb-3">Junho a Agosto</h4>
                <p className="text-gray-600 text-lg">A época mais charmosa. O frio convida a desfrutar das lareiras, fondues e chocolates quentes.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-penedo-emerald text-xl mb-3">Evitar: Novembro a Março</h4>
                <p className="text-gray-600 text-lg">Período de verão com maior incidência de chuvas, o que pode atrapalhar as cachoeiras.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 12. LOJINHAS E SHOPPINGS */}
        <section id="shoppings" className="py-8 md:py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader title="Compras e Shoppings" icon={ShoppingBag} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 text-left">
              {[
                { id: "vale-dos-duendes", name: "Vale dos Duendes", desc: "Um complexo com diversas lojinhas de artesanato, presentes e produtos regionais." }, 
                { id: "shopping-esquilo", name: "Shopping do Esquilo", desc: "Mais um local com variedade de lojas, ideal para encontrar lembrancinhas e itens exclusivos." }, 
                { id: "shopping-azul", name: "Shopping Azul", desc: "Um espaço com lojas de roupas, artesanato e gastronomia." }, 
                { id: "shopping-roda-agua", name: "Shopping Roda d’Água", desc: "Lojas variadas e um ambiente agradável para passear." }, 
                { id: "shopping-rio-pedras", name: "Shopping Rio das Pedras", desc: "Opções de compras e alimentação." }
              ].map((shop, i) => (
                <div key={i} id={shop.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-penedo-gold transition-all duration-300 hover:shadow-xl group scroll-mt-24 md:scroll-mt-32">
                  <h4 className="text-xl font-black text-penedo-forest mb-4 group-hover:text-penedo-emerald transition-colors">{shop.name}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{shop.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. CONCLUSÃO */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <SectionHeader title="Conclusão" />
            <div className="prose prose-xl prose-penedo max-w-none text-gray-600 mb-4 md:mb-8 text-left">
              <p>Penedo, RJ, é um destino que realmente encanta e oferece experiências únicas para todos os tipos de viajantes. Seja para uma escapada romântica a dois, férias em família com muita diversão na natureza ou até mesmo um bate-volta para recarregar as energias, este pedacinho da Finlândia na serra fluminense tem tudo para tornar sua viagem inesquecível.</p>
              <p>Com sua atmosfera acolhedora, paisagens deslumbrantes e uma gastronomia de dar água na boca, <strong>Penedo RJ</strong> espera por você!</p>
              <p className="text-gray-400 text-sm mt-6 italic">Publicado em 20/06/2026.</p>
            </div>
          </div>
        </section>

        {/* 14. CTA FINAL */}
        <section className="py-32 bg-penedo-forest relative overflow-hidden text-white">
          <div className="absolute inset-0 z-0 opacity-10">
            <img src="https://picsum.photos/seed/penedo-cta/1920/1080?blur=5" className="w-full h-full object-cover" alt="Footer" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 md:mb-8 leading-tight">Pronto para viver a sua próxima aventura em Penedo?</h2>
            <p className="text-xl text-white/80 mb-6 md:mb-12 font-medium">Fale conosco pelo WhatsApp agora mesmo e tire todas as suas dúvidas sobre o destino!</p>
            <div className="flex justify-center">
              <BlogPostCTA 
                label="Falar no WhatsApp" 
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20Penedo!')} 
                primary={true} 
              />
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  if (activeArticle === 'restaurantes') {
    return <RestaurantesArticle handleSelectArticle={handleSelectArticle} />;
  }

  if (activeArticle === 'melhores-hospedagens') {
    return <HospedagemArticle handleSelectArticle={handleSelectArticle} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white">
      <Helmet>
        <title>Blog Penedo RJ - Dicas e Roteiros | Vem Pra Penedo</title>
        <meta name="description" content="Acompanhe o blog Vem Pra Penedo. Dicas exclusivas, roteiros completos, os melhores restaurantes e onde se hospedar na Finlândia Brasileira." />
        <meta property="og:title" content="Blog Penedo RJ - Dicas e Roteiros | Vem Pra Penedo" />
        <meta property="og:description" content="Acompanhe o blog Vem Pra Penedo. Dicas exclusivas, roteiros completos, os melhores restaurantes e onde se hospedar na Finlândia Brasileira." />
        <meta property="og:image" content="/assets/imagens/blog/penedo_blog_header.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </button>
          <div className="hidden md:block text-xs font-black text-gray-400 uppercase tracking-widest">
            Navegando: <span className="text-penedo-forest">Blog</span>
          </div>
        </div>
      </div>
      <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/assets/imagens/blog/penedo_blog_header.jpg" className="w-full h-full object-cover" alt="Blog Portal" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog de <span className="text-penedo-gold">Penedo RJ</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">Dicas, roteiros e os melhores lugares para visitar em Penedo</p>
        </div>
      </header>

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {DETAILS_DATA['blog'].map((post) => (
            <motion.div 
              key={post.id} 
              whileHover={{ y: -12 }}
              onClick={() => {
                if (post.id === 'penedo-guia' || post.id === 'cachoeiras-penedo' || post.id === 'restaurantes' || post.id === 'melhores-hospedagens') {
                  handleSelectArticle(post.id);
                } else {
                  onNavigate('onde-ficar');
                }
              }}
              className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col h-full group cursor-pointer"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} referrerPolicy="no-referrer" />
                <div className="absolute bottom-4 left-6">
                  <span className="bg-penedo-forest/80 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg border border-white/20">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-10 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-penedo-forest mb-4 tracking-tighter leading-tight group-hover:text-penedo-emerald transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 md:mb-8">
                    {post.description}
                    {post.date && ` Publicado em ${post.date}.`}
                  </p>
                </div>
                <div className="w-full py-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-penedo-emerald font-black text-xs uppercase tracking-widest group-hover:bg-penedo-emerald group-hover:text-white transition-all shadow-sm">
                  Ler artigo completo <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-10 md:py-24 bg-penedo-forest relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Quer anunciar aqui?</h2>
          <p className="text-penedo-gold/80 mb-6 md:mb-12 text-lg font-medium italic">Seja um parceiro do Vem Pra Penedo e alcance milhares de turistas.</p>
          <BlogPostCTA label="Falar sobre parcerias" onClick={() => onNavigate('contato')} primary={true} />
        </div>
      </section>
    </motion.div>
  );
}

