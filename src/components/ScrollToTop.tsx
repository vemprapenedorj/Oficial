import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
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
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-8 right-8 z-[90] p-4 bg-penedo-emerald text-white rounded-full shadow-2xl shadow-penedo-emerald/30 hover:bg-penedo-forest border-2 border-white/20 transition-all duration-300 flex items-center justify-center group cursor-pointer transform hover:-translate-y-2 active:scale-95 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <ChevronUp size={24} className="group-hover:animate-bounce" />
    </button>
  );
}
