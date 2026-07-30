import React, { useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
  children: React.ReactNode;
  height: number;
}

export function DeferredSection({ children, height }: DeferredSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  // The static build deliberately renders the complete content for crawlers.
  // Real visitors mount each section only as it approaches the viewport.
  const [shouldRender, setShouldRender] = useState(() => window.__PRERENDER__ === true);

  useEffect(() => {
    if (shouldRender || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div
      ref={sectionRef}
      className="deferred-section"
      style={{ containIntrinsicSize: `auto ${height}px` }}
    >
      {shouldRender ? children : null}
    </div>
  );
}
