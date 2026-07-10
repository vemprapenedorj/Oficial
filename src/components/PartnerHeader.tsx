import React from 'react';
import { Award, Compass, Heart, Shield } from 'lucide-react';
import { DetailItem } from '../types';

interface PartnerHeaderProps {
  item: DetailItem;
  size?: 'default' | 'large' | 'small';
}

export function PartnerHeader({ item, size = 'large' }: PartnerHeaderProps) {
  const containerSize = size === 'large' 
    ? "w-14 h-14 md:w-20 md:h-20" 
    : "w-10 h-10 md:w-14 md:h-14";
  
  const textSize = size === 'large'
    ? "text-4xl md:text-6xl font-black text-penedo-forest tracking-tighter leading-none drop-shadow-sm text-left"
    : "text-xl md:text-2xl font-black text-penedo-forest tracking-tighter leading-none drop-shadow-sm text-left line-clamp-2";

  const HeadingTag = size === 'large' ? 'h1' : 'h3';
  const imgSize = size === 'large' ? 80 : 56;

  return (
    <div className="flex items-center gap-4 text-left">
      <div className={`${containerSize} rounded-full border-2 border-penedo-gold shadow-md shrink-0 bg-white overflow-hidden flex items-center justify-center`}>
        <img 
          src={`/assets/imagens/logos/logo-${item.id}.jpg`} 
          alt={`Logotipo oficial do estabelecimento ${item.title} em Penedo RJ`} 
          width={imgSize}
          height={imgSize}
          loading="lazy"
          decoding="async"
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