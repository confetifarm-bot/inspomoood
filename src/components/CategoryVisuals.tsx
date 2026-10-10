import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Category } from '../types';

interface CategoryVisualsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

// Visual category preview thumbnails mapping to real high-res assets
const CATEGORY_THUMBNAILS: Record<string, string> = {
  'cat-ramos': '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png',
  'cat-disfraces': '/imagenes/18_Disfraces_en_Pareja/Aladdin_y_Jasmine.png',
  'cat-ropa-accesorios': '/imagenes/19_Catalogos_Prendas_Independientes/Arma_tu_disfraz_15_prendas.png',
  'cat-perfumes': '/imagenes/20_Ramos_y_Regalos/Set de perfume con logo InspoMood.png',
  'cat-cajas': '/imagenes/20_Ramos_y_Regalos/Set de regalo floral con logo InspoMood.png',
  'cat-personalizados': '/imagenes/20_Ramos_y_Regalos/Kit de citas y recuerdos-8.png',
  'cat-combos': '/imagenes/20_Ramos_y_Regalos/Caja regalo floral con perfume y detalles.png',
};

export const CategoryVisuals: React.FC<CategoryVisualsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section className="py-14 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-semibold mb-2 border border-rose-100">
              <Sparkles className="w-3.5 h-3.5 text-[#D94E34]" />
              <span>Colecciones InspoMood</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              Explora por categorías
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Encuentra el detalle perfecto para cada ocasión o sorpresa
            </p>
          </div>

          {selectedCategoryId && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-[#D94E34] hover:text-[#b03720] bg-rose-50/80 hover:bg-rose-100/80 px-3.5 py-1.5 rounded-full border border-rose-200/60 cursor-pointer self-start sm:self-auto transition-colors"
            >
              ✕ Quitar filtro (Ver todo)
            </button>
          )}
        </div>

        {/* Categories Grid with Real Visual Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategoryId === cat.id;
            const thumbnail = CATEGORY_THUMBNAILS[cat.id] || '/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Premium_Final.png';
            const delayClass = idx === 0 ? 'animation-delay-100' : idx === 1 ? 'animation-delay-150' : idx === 2 ? 'animation-delay-200' : idx === 3 ? 'animation-delay-250' : idx === 4 ? 'animation-delay-300' : 'animation-delay-400';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer text-left flex flex-col justify-end p-3.5 sm:p-4 aspect-[4/5] animate-fade-in-up ${delayClass} ${
                  isSelected
                    ? 'ring-3 ring-[#D94E34] ring-offset-2 shadow-lg shadow-rose-950/15 scale-[1.02]'
                    : 'border border-stone-200/80 hover:border-stone-300 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Background Image Thumbnail */}
                <img
                  src={thumbnail}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                  }}
                />

                {/* Gradient Contrast Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20'
                      : 'bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent group-hover:from-stone-950/95'
                  }`}
                />

                {/* Top active checkmark badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 bg-[#D94E34] text-white p-1 rounded-full shadow-md z-10 animate-fade-in">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="relative z-10 text-white space-y-0.5">
                  <h3 className="text-sm font-bold leading-tight font-display drop-shadow-xs group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 line-clamp-1">
                    {cat.description || 'Ver productos'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
