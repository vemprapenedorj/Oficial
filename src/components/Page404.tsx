import React from 'react';
import { Home, Compass } from 'lucide-react';
import { Page } from '../types';
import { Link } from 'react-router-dom';

interface Page404Props {
  onNavigate: (page: Page) => void;
}

export default function Page404({ onNavigate }: Page404Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
        <span className="text-8xl font-black text-penedo-emerald block mb-4 selection:bg-transparent">404</span>
        <h1 className="text-3xl font-bold text-penedo-forest mb-4 tracking-tight leading-none">Página Não Encontrada</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Desculpe, a página que você está tentando acessar não existe ou foi movida.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full py-4 bg-penedo-forest hover:bg-penedo-emerald text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Home size={18} /> Ir para o Início
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/o-que-fazer"
              className="py-3 bg-white text-penedo-forest border border-gray-200 hover:border-penedo-emerald hover:bg-gray-50 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Compass size={14} /> O Que Fazer
            </Link>
            <Link
              to="/onde-ficar"
              className="py-3 bg-white text-penedo-forest border border-gray-200 hover:border-penedo-emerald hover:bg-gray-50 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Compass size={14} /> Onde Ficar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
