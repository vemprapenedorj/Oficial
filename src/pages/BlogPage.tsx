import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, User, Clock, ArrowRight, Camera, Mountain, Star, 
  Droplets, Info, MapIcon, MapPin, Car, Bus, Utensils, Heart, ShoppingBag 
} from 'lucide-react';
import { DetailItem, Page } from '../types';
import { DETAILS_DATA } from '../data/detailsData';
import { InfoCard } from '../components/InfoCard';
import SEO from '../components/SEO';
import { generateSEO } from '../seo';
import { BlogPostCTA } from '../components/BlogPostCTA';
import { getBreadcrumbSchema } from '../schema';

import { RestaurantesArticle } from '../components/RestaurantesArticle';
import { HospedagemArticle } from '../components/HospedagemArticle';
import { Roteiro1DiaArticle } from '../components/Roteiro1DiaArticle';
import Page404 from '../components/Page404';

const MotionLink = motion.create(Link);

export function BlogPage({ onOpenDetail, onNavigate, onSelectArticle }: { onOpenDetail: (item: DetailItem) => void, onNavigate: (page: Page, premiumSlug?: string | null) => void, onSelectArticle: (id: string | null) => void }) {
  const { slug: activeArticle } = useParams<{ slug: string }>();
  const blogPosts = React.useMemo(() => {
    return [...(DETAILS_DATA['blog'] || [])].sort((a, b) => {
      const parseDate = (d: string) => {
        const [day, month, year] = d.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(b.date) - parseDate(a.date);
    });
  }, []);

  const getNavigationButtons = (articleId: string) => {
    const currentIndex = blogPosts.findIndex(post => post.id === articleId);
    const prevPost = currentIndex !== -1 && currentIndex + 1 < blogPosts.length ? blogPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

    const handlePrev = () => {
      if (prevPost) {
        const inlineArticleIds = ['roteiro-1-dia-em-penedo', 'penedo-guia', 'cachoeiras-penedo', 'restaurantes', 'melhores-hospedagens'];
        if (inlineArticleIds.includes(prevPost.id)) {
          handleSelectArticle(prevPost.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          onNavigate('blog');
        }
      } else {
        handleSelectArticle(null);
        onNavigate('blog');
      }
    };

    const handleNext = () => {
      if (nextPost) {
        const inlineArticleIds = ['roteiro-1-dia-em-penedo', 'penedo-guia', 'cachoeiras-penedo', 'restaurantes', 'melhores-hospedagens'];
        if (inlineArticleIds.includes(nextPost.id)) {
          handleSelectArticle(nextPost.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      const penedoGuiaExists = blogPosts.some(post => post.id === 'penedo-guia');
      if (penedoGuiaExists && articleId !== 'penedo-guia') {
        handleSelectArticle('penedo-guia');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onNavigate('o-que-fazer');
      }
    };

    const inlineArticleIds = ['roteiro-1-dia-em-penedo', 'penedo-guia', 'cachoeiras-penedo', 'restaurantes', 'melhores-hospedagens'];
    const prevHref = prevPost && inlineArticleIds.includes(prevPost.id) ? `/blog/artigo/${prevPost.id}` : '/blog';
    const penedoGuiaExists = blogPosts.some(post => post.id === 'penedo-guia');
    const nextHref = nextPost && inlineArticleIds.includes(nextPost.id)
      ? `/blog/artigo/${nextPost.id}`
      : (penedoGuiaExists && articleId !== 'penedo-guia' ? '/blog/artigo/penedo-guia' : '/o-que-fazer');

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-100 max-w-4xl mx-auto w-full px-4 mb-12">
        {prevPost ? (
          <Link
            to={prevHref}
            className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
          >
            <ArrowRight className="rotate-180 shrink-0" size={16} />
            <span className="flex-1 text-center pr-4">Artigo anterior</span>
          </Link>
        ) : (
          <Link
            to="/blog"
            className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
          >
            <ArrowRight className="rotate-180 shrink-0" size={16} />
            <span className="flex-1 text-center pr-4">Ver todos os artigos</span>
          </Link>
        )}
        
        <Link
          to={nextHref}
          className="px-6 h-[52px] w-full sm:w-[280px] rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-between transition-all bg-[#064E3B] hover:bg-[#0B6B50] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-none outline-none"
        >
          <span className="flex-grow text-center pl-4">Continue explorando Penedo</span>
          <ArrowRight size={16} className="shrink-0" />
        </Link>
      </div>
    );
  };

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

  if (activeArticle && !blogPosts.some((post) => (post.slug || post.id) === activeArticle)) {
    return (
      <>
        <SEO
          title="Artigo Não Encontrado | Vem Pra Penedo"
          description="O artigo que você procura não foi encontrado."
          canonical="https://vemprapenedo.com.br/404"
          robots="noindex, follow"
        />
        <Page404 onNavigate={onNavigate} />
      </>
    );
  }

  if (activeArticle === 'roteiro-1-dia-em-penedo') {
    return (
      <Roteiro1DiaArticle onOpenDetail={onOpenDetail} onNavigate={onNavigate} handleSelectArticle={handleSelectArticle} />
    );
  }

  if (activeArticle === 'cachoeiras-penedo') {
    return (
      <div className="bg-white">
        <SEO 
          {...generateSEO('article', {
            slug: 'cachoeiras-penedo',
            title: 'Cachoeiras em Penedo RJ: As Melhores para Visitar',
            description: 'Explore as melhores cachoeiras em Penedo RJ. Guia completo com Três Cachoeiras, Cachoeira de Deus e dicas exclusivas para sua aventura.',
            image: '/assets/imagens/blog/cachoeiras-penedo/Introducao.jpg',
            datePublished: '2026-06-15',
            keywords: ['cachoeiras penedo', 'turismo penedo', 'penedo rj']
          })}
        />
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <Link to="/blog" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer">
              <ArrowRight className="rotate-180" size={20} /> Voltar para o Blog
            </Link>
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
            <div
              className="inline-block px-4 py-1.5 bg-penedo-gold text-penedo-forest text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl"
            >
              Natureza & Aventura
            </div>
            <h1 
              className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter"
            >
              Cachoeiras em <span className="text-penedo-gold italic">Penedo RJ</span>: As Melhores para Visitar
            </h1>
            <p 
              className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Um guia completo para refrescar o corpo e a alma nas águas mais cristalinas da Serra da Mantiqueira.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-white/85 uppercase tracking-widest mt-8">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-penedo-gold" /> 21/06/2026</span>
              <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-penedo-gold" /> 6 MIN DE LEITURA</span>
              <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
              <span className="flex items-center gap-1.5"><User size={14} className="text-penedo-gold" /> PORTAL VEM PRA PENEDO</span>
            </div>
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
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <Link
                    to="/blog/artigo/penedo-guia"
                    className="w-full sm:w-auto px-10 py-5 bg-penedo-emerald text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-penedo-forest transition-all shadow-xl shadow-penedo-emerald/30 transform hover:-translate-y-1"
                  >
                    Ver roteiro completo de Penedo
                  </Link>
                  <a
                    href="https://api.whatsapp.com/send?phone=5524992087767&text=Olá,%20vim%20do%20site%20Vem%20Pra%20Penedo%20e%20gostaria%20de%20mais%20informações!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-10 py-5 bg-white text-penedo-emerald border-2 border-penedo-emerald rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-penedo-mint transition-all shadow-lg transform hover:-translate-y-1"
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </section>

            </div>
          </div>
        </section>

        {/* Navigation buttons */}
        {getNavigationButtons('cachoeiras-penedo')}

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
                href="https://api.whatsapp.com/send?phone=5524992087767&text=Olá,%20vim%20do%20site%20Vem%20Pra%20Penedo%20e%20gostaria%20de%20mais%20informações!"
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá,%20vim%20do%20site%20Vem%20Pra%20Penedo%20e%20gostaria%20de%20mais%20informações!')} 
                primary={true} 
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (activeArticle === 'penedo-guia') {
    return (
      <div className="bg-white">
        <SEO 
          {...generateSEO('article', {
            slug: 'penedo-guia',
            title: 'Guia Completo: O Que Fazer em Penedo RJ',
            description: 'Descubra os encantos da Finlândia Brasileira. Um destino mágico na Serra da Mantiqueira com cachoeiras, gastronomia e muita cultura.',
            image: '/assets/imagens/blog/penedo-guia/capa.jpg',
            datePublished: '2026-06-20',
            keywords: ['penedo guia', 'o que fazer em penedo', 'turismo penedo']
          })}
        />
        <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4">
          <div className="max-w-7xl mx-auto px-4">
            <Link to="/blog" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer">
              <ArrowRight className="rotate-180" size={20} /> Voltar para o Blog
            </Link>
          </div>
        </div>
        {/* Full Guia Content */}
        <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <img src="/assets/imagens/blog/penedo-guia/capa.jpg" className="w-full h-full object-cover" alt="Penedo RJ" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 px-4 max-w-4xl mx-auto">
            <h1 
              className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              Guia Completo: <span className="text-penedo-gold">O Que Fazer em Penedo</span>
            </h1>
            <p 
              className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm"
            >
              Descubra os encantos da Finlândia Brasileira. Um destino mágico na Serra da Mantiqueira esperando por você.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-white/85 uppercase tracking-widest mt-8">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-penedo-gold" /> 20/06/2026</span>
              <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-penedo-gold" /> 10 MIN DE LEITURA</span>
              <span className="w-1.5 h-1.5 bg-penedo-gold rounded-full"></span>
              <span className="flex items-center gap-1.5"><User size={14} className="text-penedo-gold" /> PORTAL VEM PRA PENEDO</span>
            </div>
            <div
              className="mt-8 flex justify-center"
            >
              <BlogPostCTA label="Ver hospedagens em Penedo" href="#onde-se-hospedar" onClick={() => scrollToAnchor('onde-se-hospedar')} />
            </div>
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
                    <span><strong><a href="#secao-cachoeiras" onClick={(event) => { event.preventDefault(); scrollToAnchor('secao-cachoeiras'); }} className="hover:text-penedo-gold transition-colors cursor-pointer outline-none border-b border-dotted border-penedo-gold/30">Trilhas e Cachoeiras</a></strong>: Explore trilhas que levam a mirantes e quedas escondidas.</span>
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
                { time: "Manhã", plan: <>Comece pela <a href="#card-pequena-finlandia" onClick={(event) => { event.preventDefault(); scrollToAnchor('card-pequena-finlandia'); }} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Pequena Finlândia</a> e a <a href="#card-casa-do-papai-noel" onClick={(event) => { event.preventDefault(); scrollToAnchor('card-casa-do-papai-noel'); }} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Casa do Papai Noel</a>. Aproveite para tomar um café da manhã reforçado em uma das padarias locais.</> },
                { time: "Tarde", plan: <>Visite as <a href="#desc-tres-cachoeiras" onClick={(event) => { event.preventDefault(); scrollToAnchor('desc-tres-cachoeiras'); }} className="font-bold underline decoration-penedo-gold/30 hover:text-penedo-gold transition-colors cursor-pointer outline-none">Três Cachoeiras</a> para um contato revigorante com a natureza. Se tiver tempo, almoce por lá apreciando a vista.</> },
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
                  <p><strong className="text-penedo-gold">Manhã:</strong> Chegue cedo e explore as lojas da <a href="#card-pequena-finlandia" onClick={(event) => { event.preventDefault(); scrollToAnchor('card-pequena-finlandia'); }} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Pequena Finlândia</a>. Almoce por lá.</p>
                  <p><strong className="text-penedo-gold">Tarde:</strong> Visite a <a href="#card-casa-do-papai-noel" onClick={(event) => { event.preventDefault(); scrollToAnchor('card-casa-do-papai-noel'); }} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Casa do Papai Noel</a> e o <a href="#card-museu-finlandes" onClick={(event) => { event.preventDefault(); scrollToAnchor('card-museu-finlandes'); }} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Museu Finlandês</a> para mergulhar na história local.</p>
                  <p><strong className="text-penedo-gold">Noite:</strong> Desfrute de um jantar romântico em um dos renomados restaurantes de Penedo.</p>
                </div>
              </div>
              <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-penedo-gold">Dia 2: Aventura e Natureza</h3>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p><strong className="text-penedo-gold">Manhã:</strong> Dedique-se às cachoeiras. Visite as <a href="#desc-tres-cachoeiras" onClick={(event) => { event.preventDefault(); scrollToAnchor('desc-tres-cachoeiras'); }} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Três Cachoeiras</a> ou faça a trilha até a <a href="#desc-cachoeira-de-deus" onClick={(event) => { event.preventDefault(); scrollToAnchor('desc-cachoeira-de-deus'); }} className="text-penedo-gold underline font-bold transition-all cursor-pointer outline-none">Cachoeira de Deus</a>.</p>
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
            <BlogPostCTA label="Ver mais restaurantes" href="/gastronomia" onClick={() => onNavigate('gastronomia')} primary={true} />
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
                  <li><strong><a href="#onde-se-hospedar" onClick={(event) => { event.preventDefault(); scrollToAnchor('onde-se-hospedar'); }} className="hover:text-penedo-gold hover:underline transition-all cursor-pointer font-bold outline-none decoration-penedo-gold border-b border-dotted">Pousadas Românticas</a></strong>: Ideais para casais, muitas com lareira e hidromassagem.</li>
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
            </div>
          </div>
        </section>

        {/* Navigation buttons */}
        {getNavigationButtons('penedo-guia')}

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
                href="https://api.whatsapp.com/send?phone=5524992087767&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20Penedo!"
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5524992087767&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20Penedo!')} 
                primary={true} 
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (activeArticle === 'restaurantes') {
    return (
      <RestaurantesArticle handleSelectArticle={handleSelectArticle} onNavigate={onNavigate} />
    );
  }

  if (activeArticle === 'melhores-hospedagens') {
    return (
      <HospedagemArticle handleSelectArticle={handleSelectArticle} onNavigate={onNavigate} />
    );
  }

  return (
    <div className="bg-white">
      <SEO 
        title="Blog Penedo RJ - Dicas e Roteiros | Vem Pra Penedo"
        description="Acompanhe o blog Vem Pra Penedo. Dicas exclusivas, roteiros completos, os melhores restaurantes e onde se hospedar na Finlândia Brasileira."
        image="https://vemprapenedo.com.br/assets/imagens/blog/penedo_blog_header.jpg"
        type="website"
        canonical="https://vemprapenedo.com.br/blog"
        schema={getBreadcrumbSchema([
          { name: 'Início', item: 'https://vemprapenedo.com.br/' },
          { name: 'Blog', item: 'https://vemprapenedo.com.br/blog' }
        ])}
      />
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </Link>
          
          <nav className="text-xs font-semibold text-gray-500 uppercase tracking-widest" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-penedo-emerald transition-colors">Início</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-penedo-forest">Blog</span>
          </nav>
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
          {DETAILS_DATA['blog'].map((post) => {
            const hasArticlePage = ['roteiro-1-dia-em-penedo', 'penedo-guia', 'cachoeiras-penedo', 'restaurantes', 'melhores-hospedagens'].includes(post.id);
            const postHref = hasArticlePage ? `/blog/artigo/${post.id}` : '/onde-ficar';

            return (
            <MotionLink
              key={post.id} 
              to={postHref}
              whileHover={{ y: -12 }}
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
                    {`${post.description}${post.date ? ` Publicado em ${post.date}.` : ''}`}
                  </p>
                </div>
                <div className="w-full py-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-penedo-emerald font-black text-xs uppercase tracking-widest group-hover:bg-penedo-emerald group-hover:text-white transition-all shadow-sm">
                  Ler artigo completo <ArrowRight size={18} />
                </div>
              </div>
            </MotionLink>
            );
          })}
        </div>
      </section>

      <section className="py-10 md:py-24 bg-penedo-forest relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">Quer anunciar aqui?</h2>
          <p className="text-penedo-gold/80 mb-6 md:mb-12 text-lg font-medium italic">Seja um parceiro do Vem Pra Penedo e alcance milhares de turistas.</p>
          <BlogPostCTA label="Falar sobre parcerias" href="/contato" onClick={() => onNavigate('contato')} primary={true} />
        </div>
      </section>
    </div>
  );
}
