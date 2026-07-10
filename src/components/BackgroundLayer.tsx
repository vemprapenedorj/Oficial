import React from 'react';

export function BackgroundLayer() {
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