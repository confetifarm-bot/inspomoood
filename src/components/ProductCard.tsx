import React, { useState } from 'react';
import { Heart, Eye, Sparkles, MessageCircle, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { formatSoles } from '../utils/formatters';
import { buildSingleProductWhatsAppMessage, createWhatsAppUrl, DEFAULT_WHATSAPP_PHONE } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onOpenProductModal: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  cartCount?: number;
  onUpdateQuantity?: (product: Product, delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  onOpenProductModal,
  onQuickAdd,
  cartCount = 0,
  onUpdateQuantity,
}) => {
  const isOutOfStock = product.stock <= 0;
  const mainImage = product.images?.[0] || '/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Premium_Final.png';
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    if (product.isCoupleItem) {
      // Couple costumes require selecting 2 sizes: open modal directly for quick choice
      onOpenProductModal(product);
      return;
    }

    if (onQuickAdd) {
      onQuickAdd(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    } else {
      onOpenProductModal(product);
    }
  };

  const handleWhatsAppQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = buildSingleProductWhatsAppMessage({
      name: product.name,
      price: product.price,
      quantity: 1,
      presentation: product.isPerfume && product.perfumeDetails ? `${product.perfumeDetails.milliliters}ml` : undefined,
    });
    window.open(createWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, message), '_blank');
  };

  return (
    <div
      onClick={() => onOpenProductModal(product)}
      className="group relative bg-white rounded-3xl border border-stone-200/80 overflow-hidden flex flex-col shadow-xs hover:shadow-xl hover:shadow-rose-950/8 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Visual Image Container - Native 4:5 aspect ratio (1122x1402) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-stone-100/70 via-stone-50 to-stone-100/40">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
          }}
        />

        {/* Ambient Top Shadow for badges */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 via-black/10 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            {product.isCoupleItem && (
              <span className="bg-stone-900/90 text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Heart className="w-3 h-3 text-[#F4A261] fill-[#F4A261]" />
                <span>Dúo Pareja</span>
              </span>
            )}

            {product.isFeatured && !product.isCoupleItem && (
              <span className="bg-[#D94E34] text-white text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Favorito</span>
              </span>
            )}

            {isOutOfStock && (
              <span className="bg-stone-800/90 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-md">
                Agotado
              </span>
            )}
          </div>

          {product.comparePrice && product.comparePrice > product.price && (
            <span className="bg-gradient-to-r from-rose-500 to-[#D94E34] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tabular-nums">
              -S/ {(product.comparePrice - product.price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProductModal(product);
            }}
            className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white text-stone-900 text-xs font-semibold rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#D94E34]" />
            <span>Ver detalle</span>
          </button>

          <button
            onClick={handleQuickAddClick}
            title="Añadir a la lista"
            className="py-2.5 px-3 bg-[#D94E34] hover:bg-[#c23f27] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Añadir</span>
          </button>

          <button
            onClick={handleWhatsAppQuickOrder}
            title="Pedir por WhatsApp"
            className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category & Attributes */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium">
            <span className="text-[#D94E34] font-semibold">{categoryName || 'InspoMood'}</span>
            {product.isPerfume && product.perfumeDetails && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>{product.perfumeDetails.milliliters} ml</span>
              </>
            )}
            {product.isBouquet && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Flores eternas</span>
              </>
            )}
            {product.isPersonalized && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Personalizable</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-base font-semibold text-stone-900 leading-snug group-hover:text-[#D94E34] transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing, Stock & Quick Multi-Add Actions */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-stone-900 tabular-nums font-display">
                {formatSoles(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                  {formatSoles(product.comparePrice)}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-500'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isOutOfStock ? 'Agotado' : 'Disponible'}
            </span>
          </div>

          {/* Quick Add or Quantity Stepper */}
          {!isOutOfStock && (
            <div className="pt-0.5">
              {cartCount > 0 ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-between bg-emerald-50 border border-emerald-200/90 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 text-xs shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateQuantity?.(product, -1);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg sm:rounded-xl flex items-center justify-center font-bold shadow-2xs cursor-pointer transition-colors"
                    title="Disminuir"
                  >
                    <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  </button>

                  <div className="flex items-center gap-1 text-emerald-900 font-bold text-[11px] sm:text-xs">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 stroke-[3]" />
                    <span className="tabular-nums">{cartCount} en lista</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateQuantity ? onUpdateQuantity(product, 1) : handleQuickAddClick(e);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl flex items-center justify-center font-bold shadow-2xs cursor-pointer transition-colors"
                    title="Añadir otro"
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleQuickAddClick}
                  className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-2xs active:scale-98 ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-[#D94E34] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>¡Añadido!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Añadir al pedido</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
