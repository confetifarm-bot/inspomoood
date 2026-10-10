import React, { useState } from 'react';
import { Heart, MessageCircle, Instagram, ShieldCheck, Mail, MapPin, Phone, FileText, X } from 'lucide-react';
import { StoreSettings } from '../types';
import { getCleanWhatsAppPhone, createWhatsAppUrl, DISPLAY_WHATSAPP_PHONE } from '../utils/whatsapp';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onScrollToCatalog: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onScrollToCatalog,
}) => {
  const [activePolicy, setActivePolicy] = useState<'shipping' | 'exchange' | 'privacy' | null>(null);

  const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);
  const whatsappUrl = createWhatsAppUrl(cleanPhone, `*¡Hola InspoMood!* Quisiera hacer una consulta sobre la tienda al ${DISPLAY_WHATSAPP_PHONE}`);

  return (
    <footer className="bg-stone-900 border-t border-stone-800 text-stone-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="/"
              className="flex items-center gap-3 group"
            >
              <img
                src={settings.logoUrl || '/logo/logo.png'}
                alt={settings.brandName || 'InspoMood'}
                className="w-12 h-12 object-contain rounded-2xl shadow-xs group-hover:scale-105 transition-transform bg-white p-1 border border-white/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo/logo.png';
                }}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-white font-display">
                    {settings.brandName || 'InspoMood'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D94E34]"></span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium">
                  {settings.tagline || 'Detalles para compartir'}
                </span>
              </div>
            </a>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {settings.heroSubtitle ||
                'Detalles para compartir. Ramos de rosas eternas, disfraces en pareja virales, ramos Hot Wheels y regalos pensados para sorprender en Perú.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 flex items-center justify-center transition-all border border-emerald-500/20 shadow-2xs"
                title="Atención por WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`https://instagram.com/${settings.instagram?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 text-pink-400 flex items-center justify-center transition-all border border-white/10 shadow-2xs"
                title="Instagram InspoMood"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-stone-400"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToCatalog}
                  className="hover:text-white transition-colors cursor-pointer text-stone-400"
                >
                  Catálogo completo
                </button>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-stone-400"
                >
                  Asistencia y pedidos
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Confidence */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Términos & Confianza
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActivePolicy('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-400"
                >
                  Políticas de Envíos (Lima & Provincias)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('exchange')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-400"
                >
                  Garantía y Cambios de Talla
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-stone-400"
                >
                  Tratamiento de Datos y Privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Atención InspoMood
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D94E34]" />
                <span className="text-stone-300 font-semibold">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D94E34]" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D94E34] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.storeAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row: Copyright & Admin trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} InspoMood Perú. Hecho con amor. Precios en soles peruanos (S/).</p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso Administración</span>
          </button>
        </div>

      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative space-y-4 text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 font-display">
                {activePolicy === 'shipping' && 'Políticas de Envíos y Tiempos de Entrega'}
                {activePolicy === 'exchange' && 'Garantía y Política de Cambios'}
                {activePolicy === 'privacy' && 'Privacidad y Protección de Datos'}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
              {activePolicy === 'shipping' && settings.policies?.shippingPolicy}
              {activePolicy === 'exchange' && settings.policies?.exchangePolicy}
              {activePolicy === 'privacy' && settings.policies?.privacyPolicy}
            </div>

            <div className="pt-3 border-t border-stone-100 text-right">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
