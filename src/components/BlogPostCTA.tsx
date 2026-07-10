import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BlogPostCTAProps {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export const BlogPostCTA: React.FC<BlogPostCTAProps> = ({ label, onClick, primary = true }) => (
  <button
    onClick={onClick}
    className={`px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
      primary 
        ? 'bg-penedo-emerald text-white hover:bg-penedo-forest shadow-penedo-emerald/20' 
        : 'bg-white text-penedo-forest border-2 border-penedo-forest/10 hover:border-penedo-forest hover:bg-gray-50'
    }`}
  >
    {label} <ArrowRight size={18} />
  </button>
);
