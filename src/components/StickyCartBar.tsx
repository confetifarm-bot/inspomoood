import React from 'react';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { formatSoles } from '../utils/formatters';
import {
  buildWhatsAppOrderMessage,
  createWhatsAppUrl,
  getCleanWhatsAppPhone,
  DISPLAY_WHATSAPP_PHONE,
} from '../utils/whatsapp';

interface StickyCartBarProps {
  cart: CartItem[];
  settings: StoreSettings;
  onOpenCart: () => void;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({
  cart,
  settings,
  onOpenCart,
}) => {
  if (!cart || cart.length === 0) return null;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.finalUnitPrice * item.quantity, 0);

  const handleSendWhatsAppList = () => {
    const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);
    const items = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      finalUnitPrice: item.finalUnitPrice,
      coupleSizes: item.coupleSizes,
      singleSize: item.singleSize,
      bouquetConfig: item.bouquetConfig,
      personalizedValues: item.personalizedValues,
      selectedVariantName: item.selectedVariantName,
    }));

    const message = buildWhatsAppOrderMessage({
      items,
      subtotal,
      total: subtotal,
    });

    const url = createWhatsAppUrl(cleanPhone, message);
    window.open(url, '_blank');
  };

  return (
    <aside
      aria-label="Resumen de productos seleccionados"
      className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 z-40 sm:w-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="bg-stone-900/98 backdrop-blur-lg text-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-2xl border border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-6">
        
        {/* Left summary counter & subtotal */}
        <div
          onClick={onOpenCart}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer justify-between sm:justify-start group px-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#D94E34] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-stone-900 font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-xs font-bold text-stone-200">
                  {totalCount} {totalCount === 1 ? 'en lista' : 'en lista'}
                </span>
                <span className="text-emerald-400 text-xs sm:text-xs font-extrabold tabular-nums">
                  {formatSoles(subtotal)}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors">
                Toca para ver o editar tu lista
              </span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-rose-300 sm:hidden">
            Ver detalle ›
          </span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Secondary: View Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="hidden sm:inline-flex py-2.5 px-3.5 bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold rounded-2xl transition-all cursor-pointer whitespace-nowrap active:scale-98"
          >
            Ver lista
          </button>

          {/* Primary: Direct WhatsApp Order */}
          <button
            type="button"
            onClick={handleSendWhatsAppList}
            className="flex-1 sm:flex-initial py-2.5 sm:py-2.5 px-3.5 sm:px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-extrabold rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-98 hover:shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span className="hidden sm:inline">Pedir lista por WhatsApp ({DISPLAY_WHATSAPP_PHONE})</span>
            <span className="sm:hidden">Pedir lista por WhatsApp ({DISPLAY_WHATSAPP_PHONE})</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
