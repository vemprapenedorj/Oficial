import React from 'react';
import { Search } from 'lucide-react';

export function SearchPromo({ onSearch, query, minimal = false }: { onSearch: (q: string) => void, query: string, minimal?: boolean }) {
  return (
    <section className={`search-promo ${minimal ? 'search-promo-minimal' : ''}`}>
      <div className="search-promo-content">
        {!minimal && (
          <>
            <h2 className="promo-title">Descubra o Melhor de Penedo!</h2>
            <p className="promo-description">
              Encontre facilmente as pousadas mais charmosas, hotéis aconchegantes e os restaurantes
              com a culinária mais saborosa de Penedo e região. Sua aventura começa aqui!
            </p>
          </>
        )}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por pousadas, hotéis, restaurantes..." 
            className="search-input"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button type="button" className="search-button">
            <Search size={20} />
          </button>
        </div>
        {!minimal && (
          <p className="promo-tip">
            *Dica: Digite o nome ou uma palavra-chave para resultados rápidos!
          </p>
        )}
      </div>
    </section>
  );
}
