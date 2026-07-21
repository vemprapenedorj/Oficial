import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, CheckCircle, Instagram, Facebook, Handshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactPage({ onGoBack = () => {} }: { onGoBack?: () => void }) {
  return (
    <div>
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b py-4 shadow-sm text-left">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer bg-transparent border-none outline-none">
            <ArrowRight className="rotate-180" size={20} /> Voltar ao Início
          </Link>
          
          <nav className="text-xs font-semibold text-gray-500 uppercase tracking-widest" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-penedo-emerald transition-colors">Início</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-penedo-forest">Contato</span>
          </nav>
        </div>
      </div>

      <header className="relative pt-40 pb-6 md:pb-12 md:pt-48 md:pb-16 bg-penedo-forest text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://picsum.photos/seed/contact/1280/720"
            srcSet="https://picsum.photos/seed/contact/768/432 768w, https://picsum.photos/seed/contact/1280/720 1280w"
            sizes="100vw"
            className="w-full h-full object-cover"
            alt="Fale Conosco Vem Pra Penedo RJ contato oficial"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
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
        <div 
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
          </div>
      </section>
    </div>
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
