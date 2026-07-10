import React, { useState, useEffect, useRef } from 'react';

interface DeferredSectionProps {
  children: React.ReactNode;
  height: number;
}

export function DeferredSection({ children, height }: DeferredSectionProps) {
  const [isVisible, setIsVisible] = useState(() => {
    // 1. Detect server-side rendering or pre-rendering environment (SSG/Puppeteer)
    const isSSR = import.meta.env.SSR || 
                  typeof window === 'undefined' || 
                  (typeof window !== 'undefined' && (window as any).__PRERENDER__) ||
                  (typeof navigator !== 'undefined' && /HeadlessChrome|Prerender/i.test(navigator.userAgent || ''));
                  
    // 2. Detect lack of IntersectionObserver support
    const hasObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;
    
    return isSSR || !hasObserver;
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Low-priority scheduler to allow high-priority browser rendering first
          const triggerVisible = () => setIsVisible(true);
          
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => triggerVisible());
          } else {
            setTimeout(triggerVisible, 0);
          }
        }
      },
      {
        rootMargin: '500px 0px',
        threshold: 0,
      }
    );

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [isVisible]);

  if (isVisible) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      style={{ height: `${height}px` }}
      className="w-full bg-transparent"
    />
  );
}
