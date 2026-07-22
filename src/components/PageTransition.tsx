import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  key?: React.Key;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
