import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatSoles } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllCatalog: (term: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onViewAllCatalog,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matches = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando? (Ej: Hot Wheels, rosas, Aladdin, capibara)..."
            className="flex-1 text-sm bg-transparent text-stone-900 placeholder-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-900 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 px-2.5 py-1 bg-stone-100 rounded-lg cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2 bg-[#FAFAF7]">
          {query.trim() && matches.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500">
              No encontramos resultados para "<strong>{query}</strong>". Intenta con otro término.
            </div>
          )}

          {matches.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                onClose();
                onSelectProduct(prod);
              }}
              className="p-3 bg-white rounded-2xl hover:bg-stone-50 border border-stone-200/70 hover:border-stone-300 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={prod.images?.[0]}
                  alt={prod.name}
                  className="aspect-[4/5] w-12 rounded-xl object-cover object-top bg-stone-100 border border-stone-200/60 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                  }}
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate font-display">{prod.name}</h4>
                  <p className="text-[11px] text-stone-500 truncate">{prod.shortDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-stone-900 tabular-nums font-display">
                  {formatSoles(prod.price)}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D94E34]" />
              </div>
            </div>
          ))}

          {query.trim() && matches.length > 0 && (
            <div className="pt-2 border-t border-[#EADBCE]">
              <button
                onClick={() => {
                  onClose();
                  onViewAllCatalog(query);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#9A5B36] hover:text-[#7A4425] hover:bg-[#F3EBE0] rounded-xl transition-colors cursor-pointer"
              >
                Ver todos los resultados en el catálogo completo →
              </button>
            </div>
          )}

          {!query.trim() && (
            <div className="py-4 px-2 text-xs text-[#8A7363]">
              <span className="font-semibold block mb-2 text-[#473429]">Búsquedas sugeridas:</span>
              <div className="flex flex-wrap gap-2">
                {['Ramos de flores', 'Disfraz pareja', 'Perfume 100ml', 'Hoodies bordados', 'Cofre polaroid', 'Combos parejas'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white border border-[#EADBCE] rounded-xl hover:bg-[#F3EBE0] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
