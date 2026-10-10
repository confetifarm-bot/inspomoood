import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Gift,
  Truck,
  MessageCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CartItem, StoreSettings, Promotion, Order } from '../types';
import { formatSoles } from '../utils/formatters';
import {
  buildWhatsAppOrderMessage,
  createWhatsAppUrl,
  getCleanWhatsAppPhone,
  DISPLAY_WHATSAPP_PHONE,
} from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
  promotions: Promotion[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  promotions,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Delivery form state
  const [deliveryZoneType, setDeliveryZoneType] = useState<'lima' | 'provincias'>('lima');
  const [recipientName, setRecipientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [distritoLima, setDistritoLima] = useState<string>(settings.limaDistricts?.[0]?.name || 'Miraflores');
  const [direccionLima, setDireccionLima] = useState<string>('');
  const [referenciaLima, setReferenciaLima] = useState<string>('');
  const [fechaDeseada, setFechaDeseada] = useState<string>('');

  // Provincias state
  const [departamentoProvincia, setDepartamentoProvincia] = useState<string>(
    settings.provinciaRates?.[0]?.departamento || 'Arequipa'
  );
  const [provinciaDistrito, setProvinciaDistrito] = useState<string>('');
  const [modalidadProvincia, setModalidadProvincia] = useState<'agencia' | 'domicilio'>('agencia');
  const [agenciaSede, setAgenciaSede] = useState<string>('');
  const [direccionProvincia, setDireccionProvincia] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'yape_plin' | 'transferencia' | 'tarjeta'>('yape_plin');

  // Submitting state & finished order
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  if (!isOpen) return null;

  // Subtotal Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.finalUnitPrice * item.quantity, 0);

  // Promotions & Discounts
  let discountAmount = 0;
  if (appliedCoupon) {
    const foundCoupon = promotions.find(
      p => p.couponCode?.toUpperCase() === appliedCoupon.toUpperCase() && subtotal >= p.minPurchaseAmount
    );
    if (foundCoupon) {
      if (foundCoupon.type === 'discount_percent') {
        discountAmount = (subtotal * foundCoupon.value) / 100;
      } else if (foundCoupon.type === 'discount_fixed') {
        discountAmount = Math.min(subtotal, foundCoupon.value);
      }
    }
  }

  // Courtesy Gift detection
  const giftPromo = promotions.find(
    p => p.type === 'courtesy_gift' && p.active && subtotal >= p.minPurchaseAmount
  );

  // Shipping cost
  let isFreeShipping = false;
  const freeShippingPromo = promotions.find(
    p => p.type === 'free_shipping' && p.active && subtotal >= p.minPurchaseAmount
  );
  if (freeShippingPromo || (settings.freeShippingThreshold && subtotal >= settings.freeShippingThreshold)) {
    if (deliveryZoneType === 'lima') {
      isFreeShipping = true;
    }
  }

  let shippingCost = 0;
  if (!isFreeShipping) {
    if (deliveryZoneType === 'lima') {
      const matchDistrict = settings.limaDistricts.find(d => d.name === distritoLima);
      shippingCost = matchDistrict ? matchDistrict.cost : 14.00;
    } else {
      const matchProv = settings.provinciaRates.find(p => p.departamento === departamentoProvincia);
      if (matchProv) {
        shippingCost = modalidadProvincia === 'domicilio' ? matchProv.domicilioCost : matchProv.agenciaCost;
      } else {
        shippingCost = modalidadProvincia === 'domicilio' ? 28.00 : 20.00;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + (step === 'checkout' ? shippingCost : 0));

  // Handle Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    const promo = promotions.find(p => p.couponCode?.toUpperCase() === clean && p.active);
    if (!promo) {
      setCouponError('El cupón ingresado no es válido o está inactivo.');
      return;
    }
    if (subtotal < promo.minPurchaseAmount) {
      setCouponError(`Este cupón requiere un pedido mínimo de ${formatSoles(promo.minPurchaseAmount)}.`);
      return;
    }

    setAppliedCoupon(clean);
  };

  // Direct WhatsApp Quick Order from Cart (Builds itemized list with clean emojis)
  const handleDirectWhatsAppCartOrder = () => {
    if (cart.length === 0) return;
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
      discountAmount,
      total: Math.max(0, subtotal - discountAmount),
    });

    const url = createWhatsAppUrl(cleanPhone, message);
    window.open(url, '_blank');
  };

  // Handle Order Submit to Server
  const handlePlaceOrder = async () => {
    setServerError(null);

    // Form validations
    if (!recipientName.trim()) {
      setServerError('Por favor ingresa el nombre de la persona que recibirá el pedido.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setServerError('Por favor ingresa un número de teléfono o celular válido para la coordinación.');
      return;
    }

    if (deliveryZoneType === 'lima' && !direccionLima.trim()) {
      setServerError('Por favor ingresa la dirección de entrega en Lima.');
      return;
    }

    if (deliveryZoneType === 'provincias') {
      if (!provinciaDistrito.trim()) {
        setServerError('Por favor ingresa la provincia y distrito de destino.');
        return;
      }
      if (modalidadProvincia === 'agencia' && !agenciaSede.trim()) {
        setServerError('Por favor ingresa el nombre de la agencia y la sede de recojo (ej: Shalom sede Centro).');
        return;
      }
      if (modalidadProvincia === 'domicilio' && !direccionProvincia.trim()) {
        setServerError('Por favor ingresa la dirección de entrega a domicilio.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: cart,
        deliveryZoneType,
        deliveryDetails: {
          recipientName,
          phone,
          distrito: deliveryZoneType === 'lima' ? distritoLima : undefined,
          direccion: deliveryZoneType === 'lima' ? direccionLima : direccionProvincia,
          referencia: deliveryZoneType === 'lima' ? referenciaLima : undefined,
          departamento: deliveryZoneType === 'provincias' ? departamentoProvincia : undefined,
          provincia: deliveryZoneType === 'provincias' ? provinciaDistrito : undefined,
          modalidad: deliveryZoneType === 'provincias' ? modalidadProvincia : undefined,
          agenciaSede: deliveryZoneType === 'provincias' && modalidadProvincia === 'agencia' ? agenciaSede : undefined,
          fechaDeseada: fechaDeseada || 'A coordinar',
        },
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrar el pedido.');
      }

      setCreatedOrder(data.order);
      setWhatsappUrl(data.whatsappMessageUrl);
      setStep('success');
      onClearCart();
    } catch (err: any) {
      setServerError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FAFAF7] h-full shadow-2xl flex flex-col border-l border-stone-200 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D94E34]" />
            <h2 className="text-base font-bold text-stone-900 font-display">
              {step === 'cart' && `Tu Carrito (${cart.length})`}
              {step === 'checkout' && 'Datos de Entrega & Confirmación'}
              {step === 'success' && '¡Pedido Registrado con Éxito!'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator (in Lima) */}
        {settings.freeShippingThreshold && subtotal > 0 && step === 'cart' && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 text-xs text-emerald-800">
            {subtotal >= settings.freeShippingThreshold ? (
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¡Felicidades! Tienes Envío Gratis en Lima Metropolitana</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span>
                  Agrega <strong>{formatSoles(settings.freeShippingThreshold - subtotal)}</strong> más para tener <strong>Envío Gratis en Lima</strong>
                </span>
                <span className="font-bold tabular-nums">
                  {Math.round((subtotal / settings.freeShippingThreshold) * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* STEP 1: CART LIST */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto text-[#D94E34] border border-rose-100 shadow-xs">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explora nuestros ramos, disfraces en pareja, perfumes y sorpresas para llenar tu día de detalles.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-3 bg-[#D94E34] hover:bg-[#c23f27] text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Ver catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white rounded-3xl border border-stone-200/80 flex gap-3.5 shadow-2xs hover:border-stone-300 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-[4/5] w-16 rounded-2xl object-cover object-top bg-stone-100 border border-stone-200/60 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                        }}
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-[#38261C] leading-snug line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#A29082] hover:text-[#B24E38] p-0.5 cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Selections details */}
                          <div className="text-[11px] text-[#7A6455] space-y-0.5 mt-0.5">
                            {item.coupleSizes && (
                              <p className="text-[#9A5B36] font-medium">
                                Tallas Dúo: <strong>P1: {item.coupleSizes.person1Size}</strong> | <strong>P2: {item.coupleSizes.person2Size}</strong>
                              </p>
                            )}
                            {item.singleSize && (
                              <p>Talla: <strong>{item.singleSize}</strong></p>
                            )}
                            {item.bouquetConfig && (
                              <p>
                                {item.bouquetConfig.sizeLabel} · {item.bouquetConfig.flowerColor}
                              </p>
                            )}
                            {item.personalizedValues && (
                              <p className="italic text-[#8C7667] truncate">
                                Personalizado: {Object.values(item.personalizedValues).join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#F5ECE0] mt-1">
                          <span className="text-xs font-bold text-[#38261C] tabular-nums">
                            {formatSoles(item.finalUnitPrice * item.quantity)}
                          </span>

                          <div className="flex items-center bg-[#F3EDE3] rounded-lg p-0.5 border border-[#E3D6C5]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-[#473429] hover:bg-white rounded transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums text-[#38261C]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#473429] hover:bg-white rounded transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Courtesy gift badge if active */}
                  {giftPromo && (
                    <div className="p-3 bg-[#EAF2E8] rounded-xl border border-[#CCE0C9] flex items-center gap-2.5 text-xs text-[#2D5A27]">
                      <Gift className="w-4 h-4 text-[#487346] shrink-0" />
                      <div>
                        <strong>¡Obsequio de cortesía incluido!</strong>
                        <p className="text-[11px] text-[#3E6D37] leading-tight">
                          {giftPromo.giftProductName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Coupon Code Section */}
                  <div className="pt-2">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="¿Tienes un cupón? Ej: AMOR10"
                        className="flex-1 text-xs p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] uppercase focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2.5 bg-[#5A4538] hover:bg-[#473429] text-white text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </form>
                    {couponError && (
                      <p className="text-[11px] text-[#B24E38] mt-1 font-medium">{couponError}</p>
                    )}
                    {appliedCoupon && !couponError && (
                      <p className="text-[11px] text-[#3D7039] mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cupón {appliedCoupon} aplicado con éxito.</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <div className="space-y-5 text-xs">
              
              {/* Back to Cart button */}
              <button
                onClick={() => setStep('cart')}
                className="text-[#9A5B36] hover:text-[#724022] font-semibold underline cursor-pointer mb-2 block"
              >
                ← Volver al resumen del carrito
              </button>

              {serverError && (
                <div className="p-3 bg-[#FBEBE8] border border-[#F3C2B8] text-[#9A2E16] rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{serverError}</span>
                </div>
              )}

              {/* Destination Zone Selector: Lima vs Provincias */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#473429] uppercase tracking-wide block">
                  1. Zona de Entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryZoneType('lima')}
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-center cursor-pointer transition-all ${
                      deliveryZoneType === 'lima'
                        ? 'bg-[#473429] text-white border-[#473429]'
                        : 'bg-white text-[#4A372C] border-[#D9C8B5]'
                    }`}
                  >
                    Lima Metropolitana
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryZoneType('provincias')}
                    className={`py-2.5 px-3 rounded-xl border font-semibold text-center cursor-pointer transition-all ${
                      deliveryZoneType === 'provincias'
                        ? 'bg-[#473429] text-white border-[#473429]'
                        : 'bg-white text-[#4A372C] border-[#D9C8B5]'
                    }`}
                  >
                    Provincias (Agencia / Domicilio)
                  </button>
                </div>
              </div>

              {/* Common Details: Recipient and Phone */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#EDE2D2]">
                <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                  2. Datos del Destinatario
                </h4>

                <div>
                  <label className="block text-[#523E32] font-medium mb-1">
                    Nombre y Apellido de quien recibe: *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej: Camila Valdivia Rojas"
                    className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#523E32] font-medium mb-1">
                    Número Celular (para coordinación de entrega): *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 987 654 321"
                    className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#523E32] font-medium mb-1">
                    Fecha deseada de entrega:
                  </label>
                  <input
                    type="date"
                    value={fechaDeseada}
                    onChange={(e) => setFechaDeseada(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                  />
                  <p className="text-[10px] text-[#8A7160] mt-1">
                    * Sujeto a validación de disponibilidad y horarios de ruta por WhatsApp.
                  </p>
                </div>
              </div>

              {/* Specific fields: LIMA */}
              {deliveryZoneType === 'lima' && (
                <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#EDE2D2]">
                  <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                    3. Dirección en Lima Metropolitana
                  </h4>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Distrito de entrega:
                    </label>
                    <select
                      value={distritoLima}
                      onChange={(e) => setDistritoLima(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                    >
                      {settings.limaDistricts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} {isFreeShipping ? '(Envío Gratis)' : `(${formatSoles(d.cost)})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Dirección exacta: *
                    </label>
                    <input
                      type="text"
                      value={direccionLima}
                      onChange={(e) => setDireccionLima(e.target.value)}
                      placeholder="Ej: Av. Pardo 450, Dpto 502"
                      className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Referencia:
                    </label>
                    <input
                      type="text"
                      value={referenciaLima}
                      onChange={(e) => setReferenciaLima(e.target.value)}
                      placeholder="Ej: A media cuadra del parque, portón marrón"
                      className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Specific fields: PROVINCIAS */}
              {deliveryZoneType === 'provincias' && (
                <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#EDE2D2]">
                  <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                    3. Destino en Provincias
                  </h4>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Departamento:
                    </label>
                    <select
                      value={departamentoProvincia}
                      onChange={(e) => setDepartamentoProvincia(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                    >
                      {settings.provinciaRates.map((p) => (
                        <option key={p.departamento} value={p.departamento}>
                          {p.departamento} (Agencia: {formatSoles(p.agenciaCost)} | Domicilio: {formatSoles(p.domicilioCost)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Provincia y Distrito: *
                    </label>
                    <input
                      type="text"
                      value={provinciaDistrito}
                      onChange={(e) => setProvinciaDistrito(e.target.value)}
                      placeholder="Ej: Arequipa, Yanahuara"
                      className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#523E32] font-medium mb-1">
                      Modalidad de envío:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setModalidadProvincia('agencia')}
                        className={`p-2 rounded-xl border font-semibold cursor-pointer ${
                          modalidadProvincia === 'agencia'
                            ? 'bg-[#473429] text-white border-[#473429]'
                            : 'bg-white text-[#4A372C] border-[#D9C8B5]'
                        }`}
                      >
                        Recojo en Agencia
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalidadProvincia('domicilio')}
                        className={`p-2 rounded-xl border font-semibold cursor-pointer ${
                          modalidadProvincia === 'domicilio'
                            ? 'bg-[#473429] text-white border-[#473429]'
                            : 'bg-white text-[#4A372C] border-[#D9C8B5]'
                        }`}
                      >
                        Entrega a Domicilio
                      </button>
                    </div>
                  </div>

                  {modalidadProvincia === 'agencia' ? (
                    <div>
                      <label className="block text-[#523E32] font-medium mb-1">
                        Nombre de Agencia y Sede: *
                      </label>
                      <input
                        type="text"
                        value={agenciaSede}
                        onChange={(e) => setAgenciaSede(e.target.value)}
                        placeholder="Ej: Shalom Agencia Centro o Olva Courier Sede Principal"
                        className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[#523E32] font-medium mb-1">
                        Dirección exacta a Domicilio: *
                      </label>
                      <input
                        type="text"
                        value={direccionProvincia}
                        onChange={(e) => setDireccionProvincia(e.target.value)}
                        placeholder="Ej: Calle Melgar 120, int 2"
                        className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#EDE2D2]">
                <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                  4. Método de Pago Preferido
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2D5C4] hover:bg-[#FAF7F2] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="yape_plin"
                      checked={paymentMethod === 'yape_plin'}
                      onChange={() => setPaymentMethod('yape_plin')}
                      className="text-[#9A5B36]"
                    />
                    <div>
                      <span className="font-bold text-[#38261C]">Yape / Plin</span>
                      <p className="text-[11px] text-[#7A6455]">
                        Transferencia directa rápida. Comprobante se valida por WhatsApp.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2D5C4] hover:bg-[#FAF7F2] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === 'transferencia'}
                      onChange={() => setPaymentMethod('transferencia')}
                      className="text-[#9A5B36]"
                    />
                    <div>
                      <span className="font-bold text-[#38261C]">Transferencia BCP / BBVA / Interbank</span>
                      <p className="text-[11px] text-[#7A6455]">
                        Cuentas en soles. Comprobante verificado por el administrador.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2D5C4] hover:bg-[#FAF7F2] cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tarjeta"
                      checked={paymentMethod === 'tarjeta'}
                      onChange={() => setPaymentMethod('tarjeta')}
                      className="text-[#9A5B36]"
                    />
                    <div>
                      <span className="font-bold text-[#38261C]">Tarjeta de Crédito / Débito (Link Oficial)</span>
                      <p className="text-[11px] text-[#7A6455]">
                        Te facilitaremos el link de pago seguro de pasarela autorizada.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-[#F4EDE2] rounded-xl text-[11px] text-[#634832] leading-relaxed">
                <strong>Importante:</strong> Al presionar "Registrar Pedido", se generará tu código oficial en estado <em>Pendiente de confirmación</em> y podrás abrir WhatsApp para validar disponibilidad de fecha y enviar tu comprobante.
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="py-6 text-center space-y-5 text-xs">
              <div className="w-16 h-16 rounded-full bg-[#E5F2E3] text-[#3D7039] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 bg-[#EBE0D2] rounded-full text-[11px] font-bold text-[#8D4415]">
                  Código: {createdOrder.orderCode}
                </span>
                <h3 className="text-lg font-bold text-[#38261C] mt-2 font-display">
                  ¡Pedido registrado con éxito!
                </h3>
                <p className="text-xs text-[#7A6455] mt-1 max-w-sm mx-auto">
                  Tu pedido ha sido guardado en nuestro sistema con estado <strong>Pendiente de confirmación</strong>.
                </p>
              </div>

              {/* WhatsApp Action Button */}
              <div className="p-4 bg-[#EAF7EE] rounded-2xl border border-[#CCE8D4] space-y-3">
                <p className="text-xs text-[#22572D] leading-snug">
                  Haz clic a continuación para abrir WhatsApp con todos los datos y coordinar los detalles de entrega:
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Abrir WhatsApp con mi Pedido ({DISPLAY_WHATSAPP_PHONE})</span>
                </a>
              </div>

              {/* Summary table */}
              <div className="p-4 bg-white rounded-2xl border border-[#EDE2D2] text-left space-y-2 text-xs text-[#523E32]">
                <div className="flex justify-between">
                  <span>Destinatario:</span>
                  <strong>{createdOrder.deliveryDetails.recipientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Teléfono:</span>
                  <strong>{createdOrder.deliveryDetails.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Destino:</span>
                  <span>{createdOrder.deliveryZoneType === 'lima' ? 'Lima' : 'Provincias'}</span>
                </div>
                <div className="flex justify-between border-t border-[#F0E6D8] pt-2">
                  <span className="font-bold">Total a confirmar:</span>
                  <strong className="text-sm font-bold text-[#38261C] tabular-nums">
                    {formatSoles(createdOrder.total)}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-[#FAF4EB] rounded-xl text-[11px] text-[#7A6455] italic">
                * El pedido no se marca como pagado automáticamente. Nuestro equipo validará el abono y te confirmará la fecha exacta de entrega.
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 border border-[#D9C8B5] text-[#473429] font-semibold rounded-xl hover:bg-[#F0E6D8] transition-colors cursor-pointer"
              >
                Volver a la tienda
              </button>
            </div>
          )}

        </div>

        {/* Bottom Cart Footer / Action CTA */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-white space-y-3">
            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold tabular-nums text-stone-900">
                  {formatSoles(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#D94E34] font-medium">
                  <span>Descuento aplicado:</span>
                  <span className="tabular-nums">-{formatSoles(discountAmount)}</span>
                </div>
              )}

              {step === 'checkout' && (
                <div className="flex items-center justify-between">
                  <span>Costo de envío:</span>
                  <span className="font-semibold tabular-nums text-stone-900">
                    {isFreeShipping ? 'GRATIS' : formatSoles(shippingCost)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-sm font-bold text-stone-900">
                <span>Total:</span>
                <span className="text-base tabular-nums font-display text-stone-900">
                  {formatSoles(grandTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons for Cart or Checkout */}
            {step === 'cart' ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDirectWhatsAppCartOrder}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Pedir lista por WhatsApp ({DISPLAY_WHATSAPP_PHONE})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>Ingresar datos de entrega (Lima / Provincias)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 px-4 bg-gradient-to-r from-[#D94E34] to-[#E76F51] hover:from-[#c23f27] hover:to-[#d45e41] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Registrando pedido en el servidor...</span>
                ) : (
                  <>
                    <span>Confirmar y Abrir WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
