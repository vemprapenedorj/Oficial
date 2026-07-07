import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DetailItem } from '../types';

interface CarouselProps {
  items: DetailItem[];
  renderItem: (item: DetailItem) => React.ReactNode;
  title: string;
  subtitle?: string;
  onNavigate?: () => void;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function Carousel({ 
  items, 
  renderItem, 
  title, 
  subtitle, 
  onNavigate,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 5 }
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentItemsPerView, setCurrentItemsPerView] = useState(itemsPerView.desktop);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentItemsPerView(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setCurrentItemsPerView(itemsPerView.tablet);
      } else {
        setCurrentItemsPerView(itemsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, items.length - currentItemsPerView);

  const next = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    } else {
      setCurrentIndex(0); // Circular
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    } else {
      setCurrentIndex(maxIndex); // Circular
    }
  };

  // Calculate percentage to move
  const gap = 24; 

  return (
    <section 
      className="py-6 md:py-12 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-end mb-4 md:mb-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-penedo-forest mb-2 tracking-tight">{title}</h2>
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
          </div>
          {onNavigate && (
            <button 
              onClick={onNavigate}
              className="hidden sm:flex items-center gap-2 text-penedo-emerald font-bold hover:gap-3 transition-all cursor-pointer"
            >
              Ver tudo <ChevronRight size={20} />
            </button>
          )}
        </div>

        <div className="relative group">
          {/* Controls - Visible on hover or on mobile always */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prev}
                className="absolute left-[-10px] md:left-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-white border border-gray-100 text-penedo-forest rounded-full shadow-xl hover:bg-penedo-gold hover:text-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={next}
                className="absolute right-[-10px] md:right-[-20px] top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center bg-white border border-gray-100 text-penedo-forest rounded-full shadow-xl hover:bg-penedo-gold hover:text-white transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Carousel Items Wrapper */}
          <div className="overflow-visible md:overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: `calc(-${currentIndex * (100 / currentItemsPerView)}% - ${currentIndex * (gap / currentItemsPerView)}px)`
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {items.map((item, index) => (
                <div 
                  key={item.id + index}
                  className="flex-shrink-0"
                  style={{ 
                    width: `calc(${100 / currentItemsPerView}% - ${(gap * (currentItemsPerView - 1)) / currentItemsPerView}px)` 
                  }}
                >
                  {renderItem(item)}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Page Indicators */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-12">
              {items.map((_, idx) => (
                idx <= maxIndex && (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx 
                        ? 'bg-penedo-gold w-8' 
                        : 'bg-gray-200'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
