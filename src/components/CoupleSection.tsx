import React from 'react';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';

interface CoupleSectionProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onExploreCategory: (categorySlug: string) => void;
  onQuickAdd?: (product: Product) => void;
  cart?: CartItem[];
  onUpdateCartQuantity?: (product: Product, delta: number) => void;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  products,
  onOpenProductModal,
  onExploreCategory,
  onQuickAdd,
  cart = [],
  onUpdateCartQuantity,
}) => {
  const coupleProducts = products.filter(p => p.isCoupleSection || p.isCoupleItem).slice(0, 4);

  if (coupleProducts.length === 0) return null;

  return (
    <section id="parejas" className="py-16 bg-gradient-to-b from-rose-50/30 via-white to-stone-50/40 border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full text-xs font-bold text-[#D94E34] mb-2 border border-rose-100 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-[#D94E34] text-[#D94E34]" />
              <span>Lo más viral para parejas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              Para disfrutar de a dos
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Prendas coordinadas, pijamas y disfraces temáticos diseñados para crear complicidad y recuerdos inolvidables juntos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onExploreCategory('cat-disfraces')}
              className="px-4 py-2 text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Ver todos los disfraces dúo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D94E34]" />
            </button>
          </div>
        </div>

        {/* 4-Column Grid with Native 4:5 aspect ratio cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up animation-delay-150">
          {coupleProducts.map((product) => {
            const productCartCount = cart
              .filter((it) => it.productId === product.id)
              .reduce((s, it) => s + it.quantity, 0);

            return (
              <ProductCard
                key={product.id}
                product={product}
                categoryName="Dúo Pareja"
                onOpenProductModal={onOpenProductModal}
                onQuickAdd={onQuickAdd}
                cartCount={productCartCount}
                onUpdateQuantity={onUpdateCartQuantity}
              />
            );
          })}
        </div>

        {/* Callout Banner below grid */}
        <div className="mt-10 p-6 bg-gradient-to-r from-rose-50/80 via-white to-amber-50/60 rounded-3xl border border-rose-100/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 animate-fade-in-up animation-delay-250">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D94E34] text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Tallas independientes y calce perfecto garantizado
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                En todos nuestros disfraces y conjuntos, cada persona elige su propia talla por separado (ej. Él L, Ella S) sin recargos.
              </p>
            </div>
          </div>

          <button
            onClick={() => onExploreCategory('cat-ropa-accesorios')}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md"
          >
            Explorar conjuntos y pijamas
          </button>
        </div>

      </div>
    </section>
  );
};
