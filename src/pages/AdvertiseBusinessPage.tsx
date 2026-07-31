import React from 'react';
import {
  ArrowUpRight,
  BedDouble,
  BriefcaseBusiness,
  MapPinned,
  MessageCircle,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { getOfficialWhatsAppUrl } from '../config/contact';

const PARTNER_MESSAGE = 'Olá, conheci o Vem Pra Penedo pelo Google e quero saber como divulgar meu negócio.';
const PARTNER_WHATSAPP_URL = getOfficialWhatsAppUrl(PARTNER_MESSAGE);

const benefits = [
  {
    image: '/assets/imagens/Divulgue seu negocio/Posicionamento em destaque.png',
    alt: 'Exemplo de posicionamento em destaque no Vem Pra Penedo',
    imagePosition: 'center center',
    title: 'Posicionamento em destaque',
    description: 'Sua marca aparece em áreas estratégicas do portal e nas categorias mais relevantes para o turista.',
  },
  {
    image: '/assets/imagens/Divulgue seu negocio/Página exclusiva.png',
    alt: 'Exemplo de página exclusiva de parceiro',
    imagePosition: 'center top',
    title: 'Página exclusiva',
    description: 'Apresente seu negócio com fotos, informações, descrição personalizada e uma identidade alinhada à sua marca.',
  },
  {
    image: '/assets/imagens/Divulgue seu negocio/Conexão direta.png',
    alt: 'Exemplo de botões para contato direto',
    imagePosition: 'center top',
    title: 'Conexão direta',
    description: 'Direcione o visitante para conversar pelo WhatsApp, conhecer seu Instagram e traçar a rota pelo Google Maps.',
  },
  {
    image: '/assets/imagens/Divulgue seu negocio/Vídeo promocional.png',
    alt: 'Exemplo de vídeo promocional para parceiro',
    imagePosition: 'left top',
    title: 'Vídeo promocional',
    description: 'Um vídeo bem apresentado aproxima o visitante da sua marca, mostra sua experiência de forma envolvente e aumenta a confiança para entrar em contato.',
  },
];

const audiences = [
  { icon: BedDouble, label: 'Hotéis e pousadas' },
  { icon: UtensilsCrossed, label: 'Restaurantes e cafeterias' },
  { icon: MapPinned, label: 'Passeios e experiências' },
  { icon: Store, label: 'Lojas e produtos locais' },
  { icon: BriefcaseBusiness, label: 'Serviços voltados ao turismo' },
];

const steps = [
  ['1', 'Conte sobre seu negócio', 'Entre em contato e apresente o que torna sua marca especial.'],
  ['2', 'Definimos a melhor apresentação', 'Organizamos os elementos que valorizam sua presença no portal.'],
  ['3', 'Sua marca ganha visibilidade', 'Seu negócio passa a estar mais próximo de quem busca experiências em Penedo.'],
];

type CtaLocation = 'hero' | 'final_cta';

const trackPartnerWhatsApp = (ctaLocation: CtaLocation) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'partner_whatsapp_click', cta_location: ctaLocation });
};

function PartnerWhatsAppButton({ location, children, className }: { location: CtaLocation; children: React.ReactNode; className: string }) {
  return (
    <a href={PARTNER_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-gtm="partner_whatsapp" onClick={() => trackPartnerWhatsApp(location)} className={className}>
      <MessageCircle size={20} aria-hidden="true" />
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}

export function AdvertiseBusinessPage() {
  return (
    <div className="bg-[#f8fbf8] text-penedo-graphite">
      <section className="relative isolate overflow-hidden bg-penedo-forest pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
        <img src="/assets/imagens/Divulgue seu negocio/Hero.png" alt="Paisagem de Penedo ao pôr do sol" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-penedo-forest via-penedo-forest/90 to-penedo-forest/50" />
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-penedo-gold/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="max-w-3xl">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">Destaque seu negócio para quem visita Penedo</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">O Vem Pra Penedo conecta turistas a hospedagens, restaurantes, lojas, passeios e experiências na Serra da Mantiqueira. Fortaleça sua presença digital e faça parte de um portal criado para quem deseja descobrir o melhor da região.</p>
            <PartnerWhatsAppButton location="hero" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-penedo-gold px-6 py-3 text-center text-sm font-extrabold text-penedo-forest shadow-xl shadow-black/20 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-7 sm:text-base">Quero divulgar meu negócio</PartnerWhatsAppButton>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-penedo-emerald">Parceria que apresenta</p><h2 className="mt-3 text-3xl font-black tracking-tight text-penedo-forest sm:text-4xl">Mais presença para a sua marca</h2></div><div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{benefits.map(({ image, alt, imagePosition, title, description }) => <article key={title} className="group h-full overflow-hidden rounded-[1.75rem] border border-penedo-forest/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="aspect-[1/2] overflow-hidden bg-white"><img src={image} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: imagePosition }} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" /></div><div className="mt-3 border-t-4 border-penedo-gold bg-[#f8fbf8] p-6"><h3 className="text-xl font-bold text-penedo-forest">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p></div></article>)}</div></div></section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl rounded-[2rem] bg-[#edf7f0] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-penedo-emerald">Para quem é</p><h2 className="mt-3 text-3xl font-black tracking-tight text-penedo-forest sm:text-4xl">Seu negócio faz parte da experiência em Penedo?</h2><p className="mt-5 max-w-xl leading-relaxed text-slate-600">Se o seu negócio ajuda a tornar a viagem para Penedo ainda mais especial, ele pode fazer parte do Vem Pra Penedo.</p></div><ul className="grid gap-3 sm:grid-cols-2" aria-label="Tipos de negócios parceiros">{audiences.map(({ icon: Icon, label }) => <li key={label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-sm font-bold text-penedo-forest shadow-sm"><Icon className="shrink-0 text-penedo-emerald" size={22} aria-hidden="true" />{label}</li>)}</ul></div></div></section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.16em] text-penedo-emerald">Como funciona</p><h2 className="mt-3 text-3xl font-black tracking-tight text-penedo-forest sm:text-4xl">Uma parceria pensada para destacar o que sua marca tem de melhor</h2></div><ol className="mt-12 grid gap-6 md:grid-cols-3">{steps.map(([number, title, description]) => <li key={number} className="relative rounded-[1.75rem] border border-penedo-forest/10 bg-white p-7 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-penedo-forest text-lg font-black text-white">{number}</span><h3 className="mt-6 text-xl font-bold text-penedo-forest">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p></li>)}</ol></div></section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-penedo-forest lg:grid-cols-2"><div className="relative min-h-72 lg:min-h-full"><img src="/assets/imagens/Divulgue seu negocio/Final.png" alt="Turista descobrindo os parceiros de Penedo" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-penedo-forest/25" /></div><div className="p-8 text-white sm:p-12 lg:p-16"><p className="text-sm font-bold uppercase tracking-[0.16em] text-penedo-gold">A jornada do visitante</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">O turista encontra. Sua marca se conecta.</h2><p className="mt-6 max-w-xl leading-relaxed text-white/80">O Vem Pra Penedo reúne inspiração, informações e experiências para quem planeja visitar a região. Ao se tornar parceiro, seu negócio passa a fazer parte dessa jornada de descoberta.</p></div></div></section>

      <section className="relative overflow-hidden bg-[#dff3e5] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24"><div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-penedo-gold/20 blur-3xl" aria-hidden="true" /><div className="relative mx-auto max-w-3xl"><h2 className="text-3xl font-black tracking-tight text-penedo-forest sm:text-4xl">Seu negócio merece ser encontrado por quem escolhe Penedo.</h2><p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">Vamos criar uma presença que aproxime sua marca de novos visitantes e oportunidades.</p><PartnerWhatsAppButton location="final_cta" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-penedo-forest px-6 py-3 text-center text-sm font-extrabold text-white shadow-lg transition hover:bg-penedo-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-penedo-forest sm:px-7 sm:text-base">Falar pelo WhatsApp</PartnerWhatsAppButton></div></section>
    </div>
  );
}
