// Centralized WhatsApp utilities for InspoMood
// Guarantees 100% uncorrupted text, zero broken glyphs on all mobile/desktop devices,
// clean bullet formatting, and direct api.whatsapp.com URL generation.

export const DEFAULT_WHATSAPP_PHONE = '51919192244';
export const DISPLAY_WHATSAPP_PHONE = '919 192 244';

export function getCleanWhatsAppPhone(phone?: string): string {
  if (!phone) return DEFAULT_WHATSAPP_PHONE;
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return DEFAULT_WHATSAPP_PHONE;
  if (digits.length === 9) return `51${digits}`;
  if (digits.startsWith('51') && digits.length === 11) return digits;
  return digits;
}

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  finalUnitPrice: number;
  coupleSizes?: { person1Size: string; person2Size: string };
  singleSize?: string;
  bouquetConfig?: { sizeLabel: string; flowerColor: string; dedicationText?: string };
  personalizedValues?: Record<string, string>;
  selectedVariantName?: string;
}

export interface WhatsAppDeliveryInfo {
  recipientName?: string;
  phone?: string;
  deliveryZoneType?: 'lima' | 'provincias';
  distrito?: string;
  direccion?: string;
  referencia?: string;
  departamento?: string;
  modalidad?: 'agencia' | 'domicilio';
  fechaDeseada?: string;
  paymentMethod?: string;
}

export function buildWhatsAppOrderMessage(params: {
  items: WhatsAppOrderItem[];
  delivery?: WhatsAppDeliveryInfo;
  subtotal: number;
  shippingCost?: number;
  discountAmount?: number;
  total: number;
  orderCode?: string;
}): string {
  const { items, delivery, subtotal, shippingCost, discountAmount, total, orderCode } = params;

  let msg = `*¡HOLA INSPOMOOD! DESEO REALIZAR UN PEDIDO*\n\n`;

  if (orderCode) {
    msg += `*Codigo de Pedido:* #${orderCode}\n\n`;
  }

  msg += `*PRODUCTOS SELECCIONADOS (${items.length}):*\n`;
  msg += `-----------------------------------------\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.name}*\n`;
    msg += `   • Cantidad: ${item.quantity} ${item.quantity === 1 ? 'unidad' : 'unidades'}\n`;
    msg += `   • Precio: S/ ${(item.finalUnitPrice * item.quantity).toFixed(2)}\n`;

    if (item.coupleSizes) {
      msg += `   • Tallas Duo: P1: ${item.coupleSizes.person1Size} | P2: ${item.coupleSizes.person2Size}\n`;
    }
    if (item.singleSize) {
      msg += `   • Talla: ${item.singleSize}\n`;
    }
    if (item.selectedVariantName) {
      msg += `   • Opcion: ${item.selectedVariantName}\n`;
    }
    if (item.bouquetConfig) {
      msg += `   • Ramo: ${item.bouquetConfig.sizeLabel} (${item.bouquetConfig.flowerColor})\n`;
      if (item.bouquetConfig.dedicationText) {
        msg += `   • Dedicatoria: "${item.bouquetConfig.dedicationText}"\n`;
      }
    }
    if (item.personalizedValues && Object.keys(item.personalizedValues).length > 0) {
      Object.entries(item.personalizedValues).forEach(([k, v]) => {
        if (v && String(v).trim()) {
          msg += `   • ${k}: ${String(v).trim()}\n`;
        }
      });
    }
    msg += `\n`;
  });

  msg += `*RESUMEN DE PAGO:*\n`;
  msg += `-----------------------------------------\n`;
  msg += `• Subtotal: S/ ${subtotal.toFixed(2)}\n`;
  if (discountAmount && discountAmount > 0) {
    msg += `• Descuento: -S/ ${discountAmount.toFixed(2)}\n`;
  }
  if (shippingCost !== undefined && shippingCost > 0) {
    msg += `• Envio estimado: S/ ${shippingCost.toFixed(2)}\n`;
  } else if (shippingCost === 0) {
    msg += `• Envio: ¡GRATIS!\n`;
  } else {
    msg += `• Envio: Por coordinar (Lima / Provincias)\n`;
  }
  msg += `• *TOTAL ESTIMADO: S/ ${total.toFixed(2)}*\n\n`;

  if (delivery && (delivery.recipientName || delivery.distrito || delivery.departamento || delivery.fechaDeseada)) {
    msg += `*DATOS DE ENTREGA:*\n`;
    msg += `-----------------------------------------\n`;
    if (delivery.recipientName) msg += `• Nombre: ${delivery.recipientName}\n`;
    if (delivery.phone) msg += `• Telefono de contacto: ${delivery.phone}\n`;
    if (delivery.deliveryZoneType === 'lima') {
      if (delivery.distrito) msg += `• Destino: Lima Metropolitana (${delivery.distrito})\n`;
      if (delivery.direccion) msg += `• Direccion: ${delivery.direccion}\n`;
      if (delivery.referencia) msg += `• Referencia: ${delivery.referencia}\n`;
    } else if (delivery.deliveryZoneType === 'provincias') {
      if (delivery.departamento) msg += `• Destino: Provincia (${delivery.departamento})\n`;
      if (delivery.modalidad) msg += `• Modalidad: ${delivery.modalidad === 'domicilio' ? 'Entrega a domicilio' : 'Recojo en agencia (Shalom/Olva)'}\n`;
    }
    if (delivery.fechaDeseada) msg += `• Fecha solicitada: ${delivery.fechaDeseada}\n`;
    if (delivery.paymentMethod) msg += `• Metodo de pago: ${delivery.paymentMethod}\n`;
    msg += `\n`;
  }

  msg += `_¿Tienen disponibilidad para confirmar mi pedido? ¡Muchas gracias!_`;

  return msg;
}

export function buildSingleProductWhatsAppMessage(params: {
  name: string;
  price: number;
  quantity?: number;
  coupleSizes?: { person1Size: string; person2Size: string };
  singleSize?: string;
  bouquetConfig?: { sizeLabel: string; flowerColor: string; dedicationText?: string };
  personalizedValues?: Record<string, string>;
  presentation?: string;
}): string {
  const { name, price, quantity = 1, coupleSizes, singleSize, bouquetConfig, personalizedValues, presentation } = params;
  const total = price * quantity;

  let msg = `*¡HOLA INSPOMOOD! DESEO PEDIR ESTE PRODUCTO*\n\n`;
  msg += `*PRODUCTO:* *${name}*\n`;
  msg += `• Cantidad: ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}\n`;
  msg += `• Precio unitario: S/ ${price.toFixed(2)}\n`;

  if (coupleSizes) {
    msg += `• Tallas Duo: P1: ${coupleSizes.person1Size} | P2: ${coupleSizes.person2Size}\n`;
  }
  if (singleSize) {
    msg += `• Talla: ${singleSize}\n`;
  }
  if (presentation) {
    msg += `• Presentacion: ${presentation}\n`;
  }
  if (bouquetConfig) {
    msg += `• Ramo: ${bouquetConfig.sizeLabel} (${bouquetConfig.flowerColor})\n`;
    if (bouquetConfig.dedicationText) {
      msg += `• Dedicatoria: "${bouquetConfig.dedicationText}"\n`;
    }
  }
  if (personalizedValues && Object.keys(personalizedValues).length > 0) {
    Object.entries(personalizedValues).forEach(([k, v]) => {
      if (v && String(v).trim()) {
        msg += `• ${k}: ${String(v).trim()}\n`;
      }
    });
  }

  msg += `\n*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n\n`;
  msg += `• Consulto para entrega en Lima / Provincias.\n`;
  msg += `_¿Tienen disponibilidad inmediata para confirmar mi pedido? ¡Muchas gracias!_`;

  return msg;
}

export function createWhatsAppUrl(phone?: string, text?: string): string {
  const cleanPhone = getCleanWhatsAppPhone(phone);
  const defaultText = `*¡Hola InspoMood!* Vengo de la tienda online y quisiera hacer una consulta sobre sus productos al 919 192 244`;
  const content = text && text.trim() ? text.trim() : defaultText;
  return `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(content)}`;
}
