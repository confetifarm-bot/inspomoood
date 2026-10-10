import React, { useState } from 'react';
import {
  X,
  Check,
  Ban,
  Heart,
  MessageCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Product, CartItem, StoreSettings } from '../types';
import { formatSoles } from '../utils/formatters';
import { buildSingleProductWhatsAppMessage, createWhatsAppUrl, getCleanWhatsAppPhone } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
  onSelectProduct,
  allProducts,
}) => {
  if (!product) return null;

  // Image Gallery State
  const images = product.images && product.images.length > 0
    ? product.images
    : ['/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Premium_Final.png'];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant & Quantity
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);

  // Couple sizes state
  const [person1Size, setPerson1Size] = useState<string>(
    product.coupleDetails?.sizes?.[1] || product.coupleDetails?.sizes?.[0] || 'M'
  );
  const [person2Size, setPerson2Size] = useState<string>(
    product.coupleDetails?.sizes?.[0] || 'S'
  );

  // Single clothing size
  const [singleSize, setSingleSize] = useState<string>('M');

  // Bouquet state
  const defaultBouquetSize = product.bouquetDetails?.sizes?.[0]?.label || '';
  const [selectedBouquetSize, setSelectedBouquetSize] = useState<string>(defaultBouquetSize);
  const [selectedFlowerColor, setSelectedFlowerColor] = useState<string>(
    product.bouquetDetails?.availableFlowerColors?.[0] || ''
  );
  const [dedicationText, setDedicationText] = useState<string>('');

  // Personalized values state
  const [personalizedValues, setPersonalizedValues] = useState<Record<string, string>>({});

  // Feedback on add
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Calculate pricing
  const basePrice = product.price;
  let extraCharges = 0;

  if (product.isBouquet && selectedBouquetSize) {
    const sizeOpt = product.bouquetDetails?.sizes.find(s => s.label === selectedBouquetSize);
    if (sizeOpt) {
      extraCharges += sizeOpt.extraPrice;
    }
  }

  if (product.isPersonalized && product.personalizedFields) {
    product.personalizedFields.forEach(f => {
      if (f.extraCharge > 0 && personalizedValues[f.fieldName]) {
        extraCharges += f.extraCharge;
      }
    });
  }

  const finalUnitPrice = basePrice + extraCharges;
  const isOutOfStock = product.stock <= 0;

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Check personalized requirements
    if (product.isPersonalized && product.personalizedFields) {
      for (const field of product.personalizedFields) {
        if (field.extraCharge === 0 && !personalizedValues[field.fieldName]?.trim()) {
          alert(`Por favor ingresa la información requerida: "${field.fieldName}"`);
          return;
        }
      }
    }

    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);

    const cartItem: CartItem = {
      id: `${product.id}-${selectedVariantId}-${person1Size}-${person2Size}-${selectedBouquetSize}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      image: images[0],
      unitBasePrice: basePrice,
      extraCharges,
      finalUnitPrice,
      quantity,
      selectedVariantId: selectedVariant?.id,
      selectedVariantName: selectedVariant?.name,
      coupleSizes: product.isCoupleItem
        ? { person1Size, person2Size }
        : undefined,
      singleSize: !product.isCoupleItem && (product.category.includes('ropa') || product.category.includes('disfraz'))
        ? singleSize
        : undefined,
      bouquetConfig: product.isBouquet
        ? {
            sizeLabel: selectedBouquetSize,
            flowerColor: selectedFlowerColor,
            dedicationText,
          }
        : undefined,
      personalizedValues: product.isPersonalized ? personalizedValues : undefined,
    };

    onAddToCart(cartItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  // WhatsApp Consultation for this specific product
  const handleWhatsAppConsult = () => {
    const cleanPhone = getCleanWhatsAppPhone(settings.whatsappNumber);
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
    const text = buildSingleProductWhatsAppMessage({
      name: product.name,
      price: finalUnitPrice,
      quantity,
      coupleSizes: product.isCoupleItem ? { person1Size, person2Size } : undefined,
      singleSize: !product.isCoupleItem && (product.category.includes('ropa') || product.category.includes('disfraz')) ? singleSize : undefined,
      presentation: product.isPerfume && product.perfumeDetails ? `${product.perfumeDetails.milliliters}ml` : selectedVariant?.name,
      bouquetConfig: product.isBouquet ? {
        sizeLabel: selectedBouquetSize,
        flowerColor: selectedFlowerColor,
        dedicationText: dedicationText.trim() || undefined
      } : undefined,
      personalizedValues: Object.keys(personalizedValues).length > 0 ? personalizedValues : undefined,
    });

    const url = createWhatsAppUrl(cleanPhone, text);
    window.open(url, '_blank');
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-bold text-stone-900">{settings.brandName}</span>
            <span>/</span>
            <span>Detalle de Producto</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Gallery with 4:5 native portrait view */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100/60 border border-stone-200/90 shadow-sm">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                  }}
                />
                {product.isCoupleItem && (
                  <div className="absolute top-3.5 left-3.5 bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-[#F4A261] text-[#F4A261]" />
                    <span>Dúo para Parejas</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-[4/5] w-16 sm:w-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#D94E34] ring-2 ring-[#D94E34]/30 shadow-sm scale-102'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Vista ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery trust box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Truck className="w-4 h-4 text-[#D94E34]" />
                  <span>Opciones de entrega disponibles:</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>Lima Metropolitana:</strong> Envíos con motorizado privado en turno coordinado.
                </p>
                <p className="leading-relaxed">
                  • <strong>Provincias:</strong> Envíos diarios vía Shalom u Olva Courier con seguimiento.
                </p>
                <p className="text-[11px] text-stone-400">
                  * Coordinaciones directas por WhatsApp con confirmación en tiempo real.
                </p>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Product Title & Price */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#38261C] font-display leading-tight">
                  {product.name}
                </h1>

                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#38261C] tabular-nums font-display">
                    {formatSoles(finalUnitPrice)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-[#948173] line-through tabular-nums">
                      {formatSoles(product.comparePrice + extraCharges)}
                    </span>
                  )}
                  {extraCharges > 0 && (
                    <span className="text-xs text-[#9A5B36] font-medium">
                      (Incluye +{formatSoles(extraCharges)} por opciones seleccionadas)
                    </span>
                  )}
                </div>

                {/* Stock indicator */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOutOfStock ? 'bg-[#9E8B7E]' : 'bg-[#487346]'
                    }`}
                  />
                  <span className="text-[#654E40]">
                    {isOutOfStock ? 'Producto sin stock actualmente' : `Stock disponible (${product.stock} unidades)`}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#654E40] leading-relaxed">
                {product.description}
              </p>

              {/* ======================================================== */}
              {/* CATEGORY SPECIFIC FIELDS */}
              {/* ======================================================== */}

              {/* 1. Couple Items (Costumes & Clothing) */}
              {product.isCoupleItem && product.coupleDetails && (
                <div className="p-4 bg-[#F5ECE0] rounded-2xl border border-[#E6D7C3] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#473429] uppercase tracking-wide">
                    <Heart className="w-4 h-4 text-[#E76F51]" />
                    <span>Selección de Tallas para la Pareja</span>
                  </div>

                  <p className="text-xs text-[#7A6455] italic">
                    {product.coupleDetails.pricingNote ||
                      'El precio cubre ambas prendas. Elige la talla adecuada para cada persona:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Person 1 Size */}
                    <div>
                      <label className="block text-xs font-semibold text-[#4A372C] mb-1.5">
                        {product.coupleDetails.person1Label || 'Talla Persona 1'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        {product.coupleDetails.sizes.map(size => (
                          <button
                            key={`p1-${size}`}
                            type="button"
                            onClick={() => setPerson1Size(size)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                              person1Size === size
                                ? 'bg-[#473429] text-white border-[#473429] shadow-xs'
                                : 'bg-white text-[#523E32] border-[#D8C7B4] hover:border-[#9A5B36]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Person 2 Size */}
                    <div>
                      <label className="block text-xs font-semibold text-[#4A372C] mb-1.5">
                        {product.coupleDetails.person2Label || 'Talla Persona 2'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        {product.coupleDetails.sizes.map(size => (
                          <button
                            key={`p2-${size}`}
                            type="button"
                            onClick={() => setPerson2Size(size)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                              person2Size === size
                                ? 'bg-[#473429] text-white border-[#473429] shadow-xs'
                                : 'bg-white text-[#523E32] border-[#D8C7B4] hover:border-[#9A5B36]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Perfumes Specifics */}
              {product.isPerfume && product.perfumeDetails && (
                <div className="p-4 bg-[#F7F1E6] rounded-2xl border border-[#E9DECB] space-y-2.5 text-xs text-[#5A4538]">
                  <div className="flex items-center justify-between font-semibold text-[#3C2A21]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E78B72]" />
                      Especificaciones de la Fragancia:
                    </span>
                    <span className="px-2 py-0.5 bg-[#EFE4D3] text-[#473429] rounded-md font-bold tabular-nums">
                      {product.perfumeDetails.milliliters} ml
                    </span>
                  </div>
                  <p>
                    <strong>Presentación:</strong> {product.perfumeDetails.presentation}
                  </p>
                  <p>
                    <strong>Notas & Características:</strong> {product.perfumeDetails.notesSummary}
                  </p>
                  <p className="text-[11px] text-[#867061] italic">
                    * Fragancia artesanal de alta fijación elaborada con ingredientes seguros y testeo libre de crueldad.
                  </p>
                </div>
              )}

              {/* 3. Bouquets & Flowers */}
              {product.isBouquet && product.bouquetDetails && (
                <div className="p-4 bg-[#F6EFE5] rounded-2xl border border-[#E6D9C7] space-y-4">
                  {/* Sizes */}
                  {product.bouquetDetails.sizes && product.bouquetDetails.sizes.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-[#473429] mb-2 uppercase tracking-wide">
                        Tamaño del Ramo:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {product.bouquetDetails.sizes.map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => setSelectedBouquetSize(sz.label)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedBouquetSize === sz.label
                                ? 'bg-[#473429] text-white border-[#473429]'
                                : 'bg-white text-[#4A372C] border-[#D9C8B5] hover:border-[#9A5B36]'
                            }`}
                          >
                            <div className="text-xs font-semibold">{sz.label}</div>
                            <div className="text-[11px] opacity-80 tabular-nums">
                              {sz.extraPrice > 0 ? `+${formatSoles(sz.extraPrice)}` : 'Incluido'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {product.bouquetDetails.availableFlowerColors && (
                    <div>
                      <label className="block text-xs font-bold text-[#473429] mb-1.5 uppercase tracking-wide">
                        Tono de las Flores:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.bouquetDetails.availableFlowerColors.map((col) => (
                          <button
                            key={col}
                            type="button"
                            onClick={() => setSelectedFlowerColor(col)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              selectedFlowerColor === col
                                ? 'bg-[#473429] text-white border-[#473429]'
                                : 'bg-white text-[#4A372C] border-[#D9C8B5] hover:border-[#9A5B36]'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dedicatory Card Message */}
                  {product.bouquetDetails.includesDedicatoryCard && (
                    <div>
                      <label className="block text-xs font-bold text-[#473429] mb-1 uppercase tracking-wide">
                        Dedicatoria para la tarjeta caligrafiada (Opcional):
                      </label>
                      <textarea
                        value={dedicationText}
                        onChange={(e) => setDedicationText(e.target.value)}
                        placeholder="Escribe el mensaje tierno que escribiremos a mano en el sobre lacrado..."
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden focus:ring-2 focus:ring-[#9A5B36]/30 resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 4. Personalized Item Inputs */}
              {product.isPersonalized && product.personalizedFields && (
                <div className="p-4 bg-[#F5EFE6] rounded-2xl border border-[#E7DBC9] space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#473429] uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-[#E76F51]" />
                    <span>Datos de Personalización</span>
                  </div>

                  {product.personalizedFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-[#4A372C]">
                        <span>{field.fieldName}</span>
                        {field.extraCharge > 0 && (
                          <span className="text-[#9A5B36] font-semibold tabular-nums">
                            +{formatSoles(field.extraCharge)}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={personalizedValues[field.fieldName] || ''}
                        onChange={(e) =>
                          setPersonalizedValues({
                            ...personalizedValues,
                            [field.fieldName]: e.target.value,
                          })
                        }
                        placeholder={field.placeholder}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden focus:ring-2 focus:ring-[#9A5B36]/30"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Buy Buttons */}
              <div className="pt-3 border-t border-[#EADBCE] space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[#EFE7DC] rounded-xl p-1 border border-[#DFD3C3]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#473429] hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold tabular-nums text-[#38261C]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#473429] hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-stone-500">
                    Total: <strong className="text-stone-900 text-sm font-bold tabular-nums font-display">{formatSoles(finalUnitPrice * quantity)}</strong>
                  </span>
                </div>

                {/* Primary Buy CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 px-4 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer ${
                      isOutOfStock
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : addedSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#D94E34] to-[#E76F51] hover:from-[#c23f27] hover:to-[#d45e41] text-white shadow-rose-950/15'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>¡Agregado al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-white" />
                        <span>Agregar al Carrito</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppConsult}
                    className="w-full py-4 px-4 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pedir por WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* What Includes & What Excludes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EADBCE]">
                {/* Includes */}
                {product.whatIncludes && product.whatIncludes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#473429] uppercase tracking-wide flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#487346]" />
                      <span>Qué incluye:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-[#5E4738]">
                      {product.whatIncludes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-[#487346] font-bold">•</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excludes */}
                {product.whatExcludes && product.whatExcludes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#473429] uppercase tracking-wide flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 text-[#B24E38]" />
                      <span>Qué no incluye:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-[#7A6455]">
                      {product.whatExcludes.map((exc, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-[#B24E38] font-bold">•</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Related Products Carousel / Grid */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#EADBCE]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#38261C] uppercase tracking-wide">
                  También te podría gustar
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setSelectedImageIndex(0);
                    }}
                    className="p-3 bg-white rounded-2xl border border-[#E9DFCF] hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={rel.images?.[0]}
                      alt={rel.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F0E9DF]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[#38261C] truncate">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-[#9A5B36] tabular-nums mt-0.5">
                        {formatSoles(rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
