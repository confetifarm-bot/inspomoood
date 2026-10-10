import React, { useState } from 'react';
import { X, Sparkles, Heart, Gift, ArrowRight, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface GiftFinderModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onOpenProductModal: (product: Product) => void;
}

export const GiftFinderModal: React.FC<GiftFinderModalProps> = ({
  products,
  isOpen,
  onClose,
  onOpenProductModal,
}) => {
  const [occasion, setOccasion] = useState<string>('aniversario');
  const [budgetRange, setBudgetRange] = useState<string>('any');
  const [giftType, setGiftType] = useState<string>('any');

  if (!isOpen) return null;

  // Filter products based on selected criteria
  const matchingProducts = products.filter((p) => {
    if (!p.active) return false;

    // Occasion match
    if (occasion !== 'any' && (!p.occasions || !p.occasions.includes(occasion))) {
      return false;
    }

    // Budget range
    if (budgetRange === 'under-100' && p.price > 100) return false;
    if (budgetRange === '100-180' && (p.price < 100 || p.price > 180)) return false;
    if (budgetRange === 'over-180' && p.price < 180) return false;

    // Gift Type
    if (giftType === 'ramos' && !p.isBouquet && !p.category.includes('ramos')) return false;
    if (giftType === 'perfumes' && !p.isPerfume && !p.category.includes('perfumes')) return false;
    if (giftType === 'parejas' && !p.isCoupleItem && !p.isCoupleSection) return false;
    if (giftType === 'personalizados' && !p.isPersonalized && !p.category.includes('personal')) return false;
    if (giftType === 'combos' && !p.category.includes('combo')) return false;

    return true;
  });

  const resetFinder = () => {
    setOccasion('aniversario');
    setBudgetRange('any');
    setGiftType('any');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                Asistente para encontrar el detalle ideal
              </h2>
              <p className="text-xs text-stone-500">
                Selecciona la ocasión y presupuesto para ver las mejores sugerencias
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Step Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-50/80 rounded-2xl border border-stone-200/80">
            
            {/* Step 1: Ocasión */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#473429] uppercase tracking-wide block">
                1. ¿Cuál es la ocasión?
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
              >
                <option value="aniversario">Aniversario</option>
                <option value="cumpleanos">Cumpleaños</option>
                <option value="san-valentin">San Valentín</option>
                <option value="halloween">Halloween</option>
                <option value="porque-si">Porque sí (Espontáneo)</option>
                <option value="any">Cualquier ocasión</option>
              </select>
            </div>

            {/* Step 2: Presupuesto */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#473429] uppercase tracking-wide block">
                2. ¿Presupuesto deseado?
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
              >
                <option value="any">Cualquier presupuesto</option>
                <option value="under-100">Hasta S/ 100.00</option>
                <option value="100-180">Entre S/ 100.00 y S/ 180.00</option>
                <option value="over-180">Más de S/ 180.00 (Packs Deluxe)</option>
              </select>
            </div>

            {/* Step 3: Tipo de Detalle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#473429] uppercase tracking-wide block">
                3. Tipo de Detalle
              </label>
              <select
                value={giftType}
                onChange={(e) => setGiftType(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
              >
                <option value="any">Todos los tipos</option>
                <option value="ramos">Ramos y flores frescas</option>
                <option value="perfumes">Perfumes y brumas</option>
                <option value="parejas">Dúos y prendas para compartir</option>
                <option value="personalizados">Grabados y personalizados</option>
                <option value="combos">Combos para parejas</option>
              </select>
            </div>

          </div>

          {/* Results Area */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#4A372C] uppercase tracking-wider">
                Sugerencias ({matchingProducts.length})
              </h3>

              <button
                onClick={resetFinder}
                className="text-xs text-[#9A5B36] hover:text-[#724022] flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            </div>

            {matchingProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {matchingProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpenProductModal={(prod) => {
                      onClose();
                      onOpenProductModal(prod);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-[#EADBCE]">
                <p className="text-xs text-[#7A6455]">
                  No encontramos un producto exacto con todos los criterios seleccionados. Prueba ampliando el presupuesto o eligiendo "Todos los tipos".
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
