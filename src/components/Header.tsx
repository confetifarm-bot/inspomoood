import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Heart, Sparkles, X, MessageCircle } from 'lucide-react';
import { StoreSettings, Promotion } from '../types';
import { getCleanWhatsAppPhone, DISPLAY_WHATSAPP_PHONE, createWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  settings: StoreSettings;
  promotions: Promotion[];
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenGiftFinder: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (categoryId: string | null) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  promotions,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenGiftFinder,
  onOpenAdmin,
  onSelectCategory,
  onScrollToSection,
}) => {
  const [showBanner, setShowBanner] = useState(true);

  // Active promo text
  const activePromo = promotions.find(p => p.active);
  const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);
  const whatsappUrl = createWhatsAppUrl(cleanPhone, `*¡Hola InspoMood!* Deseo coordinar un pedido por WhatsApp al ${DISPLAY_WHATSAPP_PHONE}`);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all duration-200 shadow-2xs">
      {/* Top announcement banner with high-contrast luxury look */}
      {showBanner && (
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 text-xs text-stone-200 flex items-center justify-between">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-medium text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 font-bold transition-all shadow-2xs cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>PEDIDOS AL {DISPLAY_WHATSAPP_PHONE}</span>
            </a>
            {activePromo && (
              <span className="flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
                <span>
                  {activePromo.name} {activePromo.couponCode ? `— Cupón: ${activePromo.couponCode}` : ''}
                </span>
              </span>
            )}
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo + Wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group shrink-0 py-1"
        >
          <img
            src={settings.logoUrl || '/logo/logo.png'}
            alt={settings.brandName || 'InspoMood'}
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-2xl p-1 bg-white border border-stone-200/80 shadow-xs group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo/logo.png';
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-[#D94E34] transition-colors font-display leading-none">
                {settings.brandName || 'InspoMood'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D94E34] inline-block animate-pulse"></span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 tracking-wide leading-tight mt-0.5">
              {settings.tagline || 'Detalles para compartir'}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-stone-600">
          <button
            onClick={() => {
              onSelectCategory(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Inicio
          </button>
          <button
            onClick={() => onScrollToSection('catalogo')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Catálogo
          </button>
          <button
            onClick={() => onScrollToSection('parejas')}
            className="hover:text-[#D94E34] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 text-[#D94E34]"
          >
            <Heart className="w-3.5 h-3.5 fill-[#D94E34]/20" />
            <span>Para Parejas</span>
          </button>
          <button
            onClick={() => onSelectCategory('cat-ramos')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ramos
          </button>
          <button
            onClick={() => onSelectCategory('cat-perfumes')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Perfumes
          </button>
          <button
            onClick={onOpenGiftFinder}
            className="text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200/60 font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Asistente de Regalos</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3.5 sm:py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-full sm:rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Buscar productos"
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">Buscar</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 sm:px-4 sm:py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-full sm:rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            aria-label={`Ver carrito con ${cartCount} productos`}
          >
            <ShoppingBag className="w-4 h-4 text-[#F4A261]" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-[#D94E34] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Acceso Administración InspoMood"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
