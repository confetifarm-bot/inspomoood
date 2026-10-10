import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

interface OccasionsSectionProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  cart?: CartItem[];
  onUpdateCartQuantity?: (product: Product, delta: number) => void;
}

const OCCASIONS = [
  { id: 'aniversario', label: '💍 Aniversario' },
  { id: 'cumpleanos', label: '🎂 Cumpleaños' },
  { id: 'san-valentin', label: '❤️ San Valentín' },
  { id: 'halloween', label: '🎃 Halloween' },
  { id: 'porque-si', label: '✨ Porque sí' },
];

export const OccasionsSection: React.FC<OccasionsSectionProps> = ({
  products,
  onOpenProductModal,
  onQuickAdd,
  cart = [],
  onUpdateCartQuantity,
}) => {
  const [activeOccasion, setActiveOccasion] = useState('aniversario');

  const filteredProducts = products
    .filter(p => p.occasions && p.occasions.includes(activeOccasion))
    .slice(0, 4);

  return (
    <section className="py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Segmented Filter Control */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-2 border border-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Momentos Especiales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              Ideas por ocasión
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Encuentra el detalle justo para cada fecha inolvidable o sorpresa espontánea
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-x-auto max-w-full">
            {OCCASIONS.map((occ) => {
              const isActive = activeOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setActiveOccasion(occ.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up animation-delay-150">
            {filteredProducts.map((prod) => {
              const productCartCount = cart
                .filter((it) => it.productId === prod.id)
                .reduce((s, it) => s + it.quantity, 0);

              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenProductModal={onOpenProductModal}
                  onQuickAdd={onQuickAdd}
                  cartCount={productCartCount}
                  onUpdateQuantity={onUpdateCartQuantity}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 animate-fade-in-up">
            <p className="text-sm text-stone-600">
              No hay productos etiquetados para esta ocasión actualmente.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
