import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { StoreSettings } from '../types';
import { getCleanWhatsAppPhone, DISPLAY_WHATSAPP_PHONE, createWhatsAppUrl } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
  hasStickyCart?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings, hasStickyCart = false }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);
  const greeting = '*¡Hola InspoMood!* Deseo consultar sobre un pedido especial al ' + DISPLAY_WHATSAPP_PHONE;
  const whatsappUrl = createWhatsAppUrl(cleanPhone, greeting);

  return (
    <div
      className={`fixed right-4 sm:right-6 z-40 flex flex-col items-end gap-2 transition-all duration-300 ${
        hasStickyCart ? 'bottom-24 sm:bottom-28' : 'bottom-4 sm:bottom-6'
      }`}
    >
      {/* Tooltip greeting */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 sm:py-2.5 sm:px-4 shadow-xl border border-stone-200 text-xs text-stone-900 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[280px] sm:max-w-xs">
          <span className="leading-snug text-[11px] sm:text-xs">
            Pedidos al <strong className="text-emerald-700">{DISPLAY_WHATSAPP_PHONE}</strong> · Atencion rapida
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-900 p-0.5 cursor-pointer shrink-0"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
      </a>
    </div>
  );
};
