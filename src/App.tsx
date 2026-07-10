import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Menu, X, Instagram, Mail 
} from 'lucide-react';
import SEO from './components/SEO';
import { checkRedirects } from './seo/redirects';
import { generateSEO } from './seo';
import { Page, DetailItem } from './types';
import { DeferredSection } from './components/performance/DeferredSection';

const PageTransition = lazy(() => import('./components/PageTransition').then(m => ({ default: m.PageTransition })));


// Static JSON/data files
import locaisData from './locais.json';
import { DETAILS_DATA } from './data/detailsData';

// Sub-components
import { BackgroundLayer } from './components/BackgroundLayer';
import { ScrollToTop } from './components/ScrollToTop';
import Page404 from './components/Page404';

const DetailModal = lazy(() => import('./components/DetailModal').then(m => ({ default: m.DetailModal })));

// Analytical trackers
import { 
  pushScroll, 
  pushPageEngagement, 
  pushPageView 
} from './analytics/events';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const WhatToDoPage = lazy(() => import('./pages/WhatToDoPage').then(m => ({ default: m.WhatToDoPage })));
const WhereToStayPage = lazy(() => import('./pages/WhereToStayPage').then(m => ({ default: m.WhereToStayPage })));
const GastronomyPage = lazy(() => import('./pages/GastronomyPage').then(m => ({ default: m.GastronomyPage })));
const ShoppingPage = lazy(() => import('./pages/ShoppingPage').then(m => ({ default: m.ShoppingPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const PremiumDetailPage = lazy(() => import('./pages/PremiumDetailPage').then(m => ({ default: m.PremiumDetailPage })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center bg-transparent">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-penedo-emerald border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-penedo-forest/60 tracking-wider uppercase">Carregando...</p>
    </div>
  </div>
);

import { trackEvent } from './analytics/tracking';

const getCategoryCleanPath = (categoryName: string): string => {
  const cat = (categoryName || '').toLowerCase();
  if (cat === 'hospedagem' || cat === 'onde-ficar') return 'onde-ficar';
  if (cat === 'gastronomia' || cat === 'restaurantes') return 'gastronomia';
  if (cat === 'o-que-fazer' || cat === 'turismo' || cat === 'aventura') return 'o-que-fazer';
  if (cat === 'compras') return 'compras';
  return 'detalhe';
};

const getBusinessPath = (slug: string): string => {
  const allItems = [...Object.values(locaisData).flat(), ...Object.values(DETAILS_DATA).flat()];
  const item = allItems.find((i: any) => i.slug === slug || i.id === slug) as any;
  if (item) {
    return `/${getCategoryCleanPath(item.category)}/${slug}`;
  }
  return `/detalhe/${slug}`;
};

const parsePath = (): { page: Page; premiumSlug: string | null; blogArticle: string | null } => {
  // Check for backward compatibility with old Hash URLs
  const hash = window.location.hash;
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '/');
    window.location.hash = ''; // Clear hash
    window.history.replaceState(null, '', cleanHash);
  }

  const path = window.location.pathname;

  // Check centralized 301 redirects
  const redirectTarget = checkRedirects(path);
  if (redirectTarget) {
    window.location.replace(redirectTarget);
    return { page: 'home', premiumSlug: null, blogArticle: null };
  }
  
  if (path === '/' || path === '') {
    return { page: 'home', premiumSlug: null, blogArticle: null };
  }
  
  if (path.startsWith('/detalhe/')) {
    const slug = path.replace('/detalhe/', '');
    return { page: 'premium-detail', premiumSlug: slug, blogArticle: null };
  }
  
  if (path.startsWith('/blog/artigo/')) {
    const slug = path.replace('/blog/artigo/', '');
    return { page: 'blog', premiumSlug: null, blogArticle: slug };
  }

  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    return { page: 'blog', premiumSlug: null, blogArticle: slug };
  }
  
  if (path === '/blog' || path === '/blog/') {
    return { page: 'blog', premiumSlug: null, blogArticle: null };
  }

  const parts = path.split('/').filter(Boolean);
  if (parts.length === 2) {
    const [category, slug] = parts;
    const allCategories = ['gastronomia', 'onde-ficar', 'o-que-fazer', 'compras', 'restaurantes', 'pousadas', 'hoteis', 'detalhe'];
    if (allCategories.includes(category)) {
      return { page: 'premium-detail', premiumSlug: slug, blogArticle: null };
    }
  }
  
  const pageName = path.replace(/^\//, '').replace(/\/$/, '') as Page;
  const validPages: Page[] = ['home', 'o-que-fazer', 'onde-ficar', 'gastronomia', 'compras', 'blog', 'contato', 'premium-detail', '404'];
  if (validPages.includes(pageName)) {
    return { page: pageName, premiumSlug: null, blogArticle: null };
  }
  
  return { page: '404', premiumSlug: null, blogArticle: null };
};

const updatePath = (page: Page, premiumSlug: string | null, blogArticle: string | null) => {
  let path = '/';
  if (page === 'home') {
    path = '/';
  } else if (page === 'premium-detail' && premiumSlug) {
    path = getBusinessPath(premiumSlug);
  } else if (page === 'blog') {
    if (blogArticle) {
      path = `/blog/artigo/${blogArticle}`;
    } else {
      path = `/blog`;
    }
  } else if (page === '404') {
    path = '/404';
  } else {
    path = `/${page}`;
  }
  
  if (window.location.pathname !== path) {
    window.history.pushState({ page, premiumSlug, blogArticle }, '', path);
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => parsePath().page);
  const [selectedPremiumSlug, setSelectedPremiumSlug] = useState<string | null>(() => parsePath().premiumSlug);
  const [activeBlogArticle, setActiveBlogArticle] = useState<string | null>(() => parsePath().blogArticle);
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

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = parsePath();
      setCurrentPage(route.page);
      setSelectedPremiumSlug(route.premiumSlug);
      setActiveBlogArticle(route.blogArticle);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize state changes to URL path
  useEffect(() => {
    updatePath(currentPage, selectedPremiumSlug, activeBlogArticle);
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
    let idleId: number;
    let fallbackTimer: number;

    const track = () => {
      const pagePath = window.location.pathname || '/';
      const pageTitle = document.title || 'Vem Pra Penedo';
      pushPageView(pagePath, pageTitle);
    };

    if (typeof window !== 'undefined') {
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(track, { timeout: 1000 });
      } else {
        fallbackTimer = window.setTimeout(track, 200);
      }
    }

    return () => {
      if (idleId && typeof window !== 'undefined' && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
      if (fallbackTimer && typeof window !== 'undefined') {
        window.clearTimeout(fallbackTimer);
      }
    };
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
          
          const pushEvent = () => pushScroll(t, activeSlug);
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(pushEvent);
          } else {
            setTimeout(pushEvent, 10);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScrollDepth);
    return () => window.removeEventListener('scroll', handleScrollDepth);
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  // 3. GTM page_engagement tracking
  useEffect(() => {
    const activeSlug = selectedPremiumSlug;
    
    const pushEvent = (time: number) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => pushPageEngagement(time, activeSlug));
      } else {
        pushPageEngagement(time, activeSlug);
      }
    };

    const timers = [
      setTimeout(() => pushEvent(30), 30000),
      setTimeout(() => pushEvent(60), 60000),
      setTimeout(() => pushEvent(120), 120000)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [currentPage, selectedPremiumSlug, activeBlogArticle]);

  const navigate = (page: Page, premiumSlug: string | null = null) => {
    setActiveBlogArticle(null);
    
    if (page !== 'premium-detail' && page !== 'blog') {
      setSelectedPremiumSlug(null);
    }

    if (page === 'home') {
      setHomeRefreshKey(prev => prev + 1);
    }
    
    setCurrentPage(page);
    if (page === 'blog' && premiumSlug) {
      setActiveBlogArticle(premiumSlug);
    } else {
      setSelectedPremiumSlug(premiumSlug);
    }
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
      {/* Decorative background layer */}
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
                href="/" 
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
                  href="/" 
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
                  href={item.id === 'home' ? '/' : `/${item.id}`}
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
        <div 
          className={`md:hidden bg-penedo-forest border-b border-white/10 overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
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
                href={item.id === 'home' ? '/' : `/${item.id}`}
                onClick={(e) => { e.preventDefault(); navigate(item.id as Page); }}
                className="block w-full text-left px-3 py-2 rounded-md text-white/90 font-medium hover:bg-penedo-emerald/20 transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-0 overflow-x-hidden relative">
        <Suspense fallback={<LoadingFallback />}>
            {currentPage === 'home' && (
              <div className="animate-fade-in">
                <SEO {...generateSEO('home')} />
                <HomePage 
                  onNavigate={navigate} 
                  onOpenDetail={handleOpenDetail} 
                  onSelectArticle={setActiveBlogArticle}
                  onNavigatePremium={(slug) => navigate('premium-detail', slug)}
                />
              </div>
            )}
            {currentPage === 'o-que-fazer' && (
              <PageTransition key="what-to-do">
                <SEO {...generateSEO('category', 'o-que-fazer')} />
                <WhatToDoPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
              </PageTransition>
            )}
            {currentPage === 'onde-ficar' && (
              <PageTransition key="where-to-stay">
                <SEO {...generateSEO('category', 'onde-ficar')} />
                <WhereToStayPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
              </PageTransition>
            )}
            {currentPage === 'gastronomia' && (
              <PageTransition key="gastronomy">
                <SEO {...generateSEO('category', 'gastronomia')} />
                <GastronomyPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
              </PageTransition>
            )}
            {currentPage === 'compras' && (
              <PageTransition key="shopping">
                <SEO {...generateSEO('category', 'compras')} />
                <ShoppingPage onOpenDetail={handleOpenDetail} onGoBack={() => navigate('home')} />
              </PageTransition>
            )}
            {currentPage === 'contato' && (
              <PageTransition key="contact">
                <SEO {...generateSEO('category', 'contato')} />
                <ContactPage onGoBack={() => navigate('home')} />
              </PageTransition>
            )}
            {currentPage === 'blog' && (
              <PageTransition key="blog">
                <BlogPage onOpenDetail={handleOpenDetail} onNavigate={navigate} activeArticle={activeBlogArticle} onSelectArticle={setActiveBlogArticle} />
              </PageTransition>
            )}
            {currentPage === 'premium-detail' && (
              <PageTransition key={`premium-${selectedPremiumSlug}`}>
                <PremiumDetailPage slug={selectedPremiumSlug!} onNavigate={navigate} onOpenDetail={handleOpenDetail} />
              </PageTransition>
            )}
            {currentPage === '404' && (
              <PageTransition key="page-404">
                <SEO 
                  title="Página Não Encontrada | Vem Pra Penedo"
                  description="A página que você procura não foi encontrada. Navegue pelo portal oficial para descobrir o melhor de Penedo RJ."
                  canonical="https://vemprapenedo.com.br/404"
                  robots="noindex, follow"
                />
                <Page404 onNavigate={navigate} />
              </PageTransition>
            )}
        </Suspense>
      </main>

      {/* Footer */}
      <DeferredSection height={350}>
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
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-white transition-colors cursor-pointer">Início</a></li>
                <li><a href="/o-que-fazer" onClick={(e) => { e.preventDefault(); navigate('o-que-fazer'); }} className="hover:text-white transition-colors cursor-pointer">O Que Fazer</a></li>
                <li><a href="/onde-ficar" onClick={(e) => { e.preventDefault(); navigate('onde-ficar'); }} className="hover:text-white transition-colors cursor-pointer">Onde Ficar</a></li>
                <li><a href="/gastronomia" onClick={(e) => { e.preventDefault(); navigate('gastronomia'); }} className="hover:text-white transition-colors cursor-pointer">Gastronomia</a></li>
                <li><a href="/compras" onClick={(e) => { e.preventDefault(); navigate('compras'); }} className="hover:text-white transition-colors cursor-pointer">Compras</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate('blog'); }} className="hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="/contato" onClick={(e) => { e.preventDefault(); navigate('contato'); }} className="hover:text-white transition-colors cursor-pointer">Contato</a></li>
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
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
      </DeferredSection>

      <ScrollToTop />

      <Suspense fallback={null}>
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </Suspense>

      {/* Cookie Consent banner with CSS transition */}
      <div 
        className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] transition-all duration-500 ease-out transform ${
          showCookies ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl border p-6">
          <h4 className="font-bold text-penedo-graphite">Privacidade e Cookies</h4>
          <p className="text-sm text-gray-500 my-4">Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política.</p>
          <div className="flex gap-3">
            <button onClick={acceptCookies} className="flex-grow py-3 bg-penedo-emerald text-white font-bold rounded-2xl text-sm hover:bg-penedo-forest transition-colors">Aceitar</button>
            <button onClick={() => setShowCookies(false)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm hover:bg-gray-200 transition-colors">Recusar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
