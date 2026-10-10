import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Heart, Truck, MessageCircle, Star, ShieldCheck, Flame } from 'lucide-react';
import { StoreSettings } from '../types';
import { getCleanWhatsAppPhone, DISPLAY_WHATSAPP_PHONE, createWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  settings: StoreSettings;
  onExplore: () => void;
  onOpenGiftFinder: () => void;
}

interface StarShowcase {
  id: string;
  tabLabel: string;
  title: string;
  badge: string;
  price: string;
  image: string;
  tagline: string;
}

const STAR_PRODUCTS: StarShowcase[] = [
  {
    id: 'hotwheels',
    tabLabel: '🏎️ Hot Wheels Viral',
    title: 'Ramo Hot Wheels Viral 2026',
    badge: '🔥 Lo más viral de TikTok',
    price: 'S/ 59.00',
    image: '/imagenes/20_Ramos_y_Regalos/Ramo_Carritos_Premium_Final.png',
    tagline: 'El regalo definitivo para él con autos coleccionables originales y luces LED.',
  },
  {
    id: 'rosas',
    tabLabel: '🌹 Rosas Eternas',
    title: 'Ramo Rosas Eternas de Lujo',
    badge: '❤️ Flores que duran para siempre',
    price: 'S/ 69.00',
    image: '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png',
    tagline: 'Rosas artesanales de satén premium con corona dorada y mariposa de cristal.',
  },
  {
    id: 'disfraz',
    tabLabel: '🎭 Disfraz en Pareja',
    title: 'Disfraz Aladdin & Jasmine Dúo',
    badge: '👑 Tallas independientes Él y Ella',
    price: 'S/ 159.00',
    image: '/imagenes/18_Disfraces_en_Pareja/Aladdin_y_Jasmine.png',
    tagline: 'Set completo para dos con calce perfecto y telas premium de alta confección.',
  },
  {
    id: 'capibara',
    tabLabel: '🧸 Ramo Capibara',
    title: 'Ramo Capibara Tierno con Rosas',
    badge: '✨ El detalle más tierno',
    price: 'S/ 49.00',
    image: '/imagenes/20_Ramos_y_Regalos/Capibara y girasoles_ abrazo soleado-6.png',
    tagline: 'Peluche suave de capibara rodeado de flores eternas y follaje pastel.',
  },
  {
    id: 'perfume-box',
    tabLabel: '🎁 Box Perfume Deluxe',
    title: 'Box de Lujo: Fragancias & Rosas',
    badge: '💎 Edición Exclusiva InspoMood',
    price: 'S/ 109.00',
    image: '/imagenes/20_Ramos_y_Regalos/Regalo elegante con perfume Good Girl.png',
    tagline: 'Fragancias icónicas de autor presentadas con rosas eternas, bombones y caja rígida magnética.',
  },
];

export const Hero: React.FC<HeroProps> = ({ settings, onExplore, onOpenGiftFinder }) => {
  const [activeStarIndex, setActiveStarIndex] = useState(0);
  const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);

  // Gentle auto-rotation of showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStarIndex((prev) => (prev + 1) % STAR_PRODUCTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeStar = STAR_PRODUCTS[activeStarIndex];

  const handleWhatsAppContact = () => {
    const message = `*¡Hola InspoMood!* Vengo de la tienda web y quisiera consultar por pedidos y envios al ${DISPLAY_WHATSAPP_PHONE}`;
    window.open(createWhatsAppUrl(cleanPhone, message), '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-[#FAFAF7] to-[#FAFAF7] pt-6 pb-16 sm:py-20 border-b border-stone-200/70">
      {/* Ambient background soft light orbs */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Verified Direct Orders Kicker */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold animate-fade-in">
              <a
                href={createWhatsAppUrl(cleanPhone, `*¡Hola InspoMood!* Quisiera coordinar un pedido especial por WhatsApp al ${DISPLAY_WHATSAPP_PHONE}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/80 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>PEDIDOS AL {DISPLAY_WHATSAPP_PHONE}</span>
              </a>

              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-800 rounded-full border border-rose-100 font-medium">
                <Heart className="w-3 h-3 text-[#D94E34] fill-[#D94E34]" />
                <span>Boutique de Regalos & Dúos</span>
              </span>
            </div>

            {/* Headline with Rich Gradient */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12] text-balance font-display animate-fade-in-up">
              Sorprende a tu persona favorita con{' '}
              <span className="bg-gradient-to-r from-[#D94E34] via-[#E76F51] to-[#F4A261] bg-clip-text text-transparent">
                detalles que enamoran
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-150">
              Ramos con flores eternas, disfraces en pareja virales, ramos Hot Wheels y regalos personalizados hechos a mano con amor en Perú para celebrar aniversarios, cumpleaños o cualquier día juntos.
            </p>

            {/* High-Converting Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in-up animation-delay-200">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#D94E34] to-[#E76F51] hover:from-[#c23f27] hover:to-[#d45e41] rounded-2xl shadow-lg hover:shadow-xl hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Explorar catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppContact}
                className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Pedir por WhatsApp</span>
              </button>

              <button
                onClick={onOpenGiftFinder}
                className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Asistente de regalos</span>
              </button>
            </div>

            {/* Trust Pillar Badges */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left animate-fade-in-up animation-delay-300">
              <div className="flex items-start gap-2.5">
                <div className="p-2.5 bg-rose-50 text-[#D94E34] rounded-2xl shrink-0 mt-0.5 border border-rose-100/60 shadow-2xs">
                  <Heart className="w-4 h-4 fill-[#D94E34]/20" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Tallas independientes</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">Cada uno elige su talla</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl shrink-0 mt-0.5 border border-amber-100/60 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Lima & Provincias</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">Envíos con seguimiento</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0 mt-0.5 border border-emerald-100/60 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Garantía InspoMood</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">Fotos reales y acabados top</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Composition: Interactive Star Showcase */}
          <div className="lg:col-span-5 relative animate-fade-in-up animation-delay-200">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Star Showcase Tab Selector Pills */}
              <div className="flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-sm mb-3 overflow-x-auto">
                {STAR_PRODUCTS.map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => setActiveStarIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeStarIndex === idx
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {prod.tabLabel}
                  </button>
                ))}
              </div>

              {/* Main Card with Real 4:5 Portrait Photography */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-2xl border border-stone-200/90 group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100/50">
                  <img
                    key={activeStar.id}
                    src={activeStar.image}
                    alt={activeStar.title}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />
                  
                  {/* Top Floating Badge on Image */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{activeStar.badge}</span>
                    </span>

                    <span className="bg-white/95 backdrop-blur-md text-stone-900 font-extrabold text-sm px-3 py-1 rounded-full shadow-md font-display">
                      {activeStar.price}
                    </span>
                  </div>

                  {/* Bottom overlay note */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <h3 className="text-lg font-bold font-display leading-tight">
                      {activeStar.title}
                    </h3>
                    <p className="text-xs text-stone-200/90 leading-snug line-clamp-2">
                      {activeStar.tagline}
                    </p>
                  </div>
                </div>

                {/* Floating Tag Badge 1: Customer Satisfaction */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl py-2 px-3.5 shadow-xl flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span>4.9 / 5 · +1,200 entregas</span>
                </div>

                {/* Floating Tag Badge 2: Brand Stamp */}
                <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl py-2 px-3.5 shadow-xl flex items-center gap-2 text-xs font-semibold text-stone-800">
                  <img src={settings.logoUrl || '/logo/logo.png'} alt="InspoMood" className="w-5 h-5 object-contain rounded-md" />
                  <span>Hecho a mano en Perú</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
