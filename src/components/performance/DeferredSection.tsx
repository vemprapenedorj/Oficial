import React from 'react';

interface DeferredSectionProps {
  children: React.ReactNode;
  height: number;
}

export function DeferredSection({ children, height }: DeferredSectionProps) {
  void height;
  return <>{children}</>;
}
