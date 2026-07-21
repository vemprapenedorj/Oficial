import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { DetailItem } from '../types';
import { DETAILS_DATA } from '../data/detailsData';
import { SearchPromo } from '../components/SearchPromo';
import { InfoCard } from '../components/InfoCard';
import { pushSearch } from '../analytics/events';
import { FAQ_DATA } from '../seo';
import { Link } from 'react-router-dom';

export function WhatToDoPage({ onOpenDetail, onGoBack }: { onOpenDetail: (item: DetailItem) => void, onGoBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = DETAILS_DATA['o-que-fazer'].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aPremium = a.isPremium || a.isPremium ? 1 : 0;
    const bPremium = b.isPremium || b.isPremium ? 1 : 0;
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
    <div>
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </Link>
          
          <nav className="text-xs font-semibold text-gray-500 uppercase tracking-widest" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-penedo-emerald transition-colors">Início</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-penedo-forest">O Que Fazer</span>
          </nav>
        </div>
      </div>

      <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <picture className="block w-full h-full">
            <source media="(max-width: 767px)" srcSet="/assets/imagens/penedo_sightseeing-mobile.webp" type="image/webp" />
            <img src="/assets/imagens/penedo_sightseeing.jpg" className="w-full h-full object-cover" alt="O Que Fazer em Penedo RJ turismo" fetchPriority="high" decoding="async" referrerPolicy="no-referrer" />
          </picture>
        </div>
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">O Que Fazer em <span className="text-penedo-gold">Penedo</span></h1>
          <p className="text-white font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed shadow-black/20 drop-shadow-sm">Descubra cachoeiras cristalinas, trilhas deslumbrantes e o charme único da Pequena Finlândia. O melhor do lazer e da cultura em um só lugar para você aproveitar.</p>
        </div>
      </header>

      <SearchPromo query={searchQuery} onSearch={setSearchQuery} minimal={true} />

      <section className="py-10 md:py-24 max-w-7xl mx-auto px-4">
        <h2 className="sr-only">Lista de Pontos Turísticos e Passeios em Penedo RJ</h2>

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

      {/* FAQ Section */}
      <section className="py-12 md:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-left">
          <h2 className="text-3xl font-black text-penedo-forest mb-8 text-center uppercase tracking-tight">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {FAQ_DATA['o-que-fazer']?.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
