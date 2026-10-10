export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
  price?: number;
}

export interface PersonalizedField {
  id: string;
  fieldName: string;
  placeholder: string;
  extraCharge: number;
}

export interface BouquetSizeOption {
  id: string;
  label: string;
  extraPrice: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  whatIncludes: string[];
  whatExcludes: string[];
  
  // Couple specific
  isCoupleItem?: boolean;
  coupleDetails?: {
    person1Label: string;
    person2Label: string;
    sizes: string[];
    pricingNote: string;
  };

  // Perfume specific
  isPerfume?: boolean;
  perfumeDetails?: {
    milliliters: number;
    presentation: string;
    notesSummary: string;
  };

  // Bouquet specific
  isBouquet?: boolean;
  bouquetDetails?: {
    sizes: BouquetSizeOption[];
    availableFlowerColors: string[];
    includesDedicatoryCard: boolean;
  };

  // Personalized item specific
  isPersonalized?: boolean;
  personalizedFields?: PersonalizedField[];

  variants: ProductVariant[];
  stock: number;
  occasions: string[];
  isFeatured?: boolean;
  isCoupleSection?: boolean;
  isDemo?: boolean;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  visible: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  unitBasePrice: number;
  extraCharges: number;
  finalUnitPrice: number;
  quantity: number;
  
  // Selections
  selectedVariantId?: string;
  selectedVariantName?: string;
  
  // Couple selections
  coupleSizes?: {
    person1Size: string;
    person2Size: string;
  };

  // Single clothing size
  singleSize?: string;

  // Bouquet configuration
  bouquetConfig?: {
    sizeLabel: string;
    flowerColor: string;
    dedicationText: string;
  };

  // Personalized fields values
  personalizedValues?: Record<string, string>;
}

export type OrderDeliveryZone = 'lima' | 'provincias';
export type OrderDeliveryStatus = 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export type OrderPaymentStatus = 'pendiente' | 'pagado' | 'rechazado';
export type OrderPaymentMethod = 'yape_plin' | 'transferencia' | 'tarjeta';

export interface OrderDeliveryDetails {
  recipientName: string;
  phone: string;
  distrito?: string;
  direccion?: string;
  referencia?: string;
  departamento?: string;
  provincia?: string;
  modalidad?: 'agencia' | 'domicilio';
  agenciaSede?: string;
  fechaDeseada: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  courtesyGift?: string;
  shippingCost: number;
  shippingNote?: string;
  total: number;
  deliveryZoneType: OrderDeliveryZone;
  deliveryDetails: OrderDeliveryDetails;
  deliveryStatus: OrderDeliveryStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: OrderPaymentMethod;
  whatsappMessageUrl?: string;
  adminNotes?: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'discount_percent' | 'discount_fixed' | 'free_shipping' | 'courtesy_gift';
  value: number; // percentage or fixed Soles amount
  minPurchaseAmount: number;
  giftProductName?: string;
  couponCode?: string;
  active: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface DeliveryZoneRate {
  name: string;
  cost: number;
  estimatedDays: string;
}

export interface ProvinciaRate {
  departamento: string;
  agenciaCost: number;
  domicilioCost: number;
  estimatedDays: string;
  agenciasDisponibles: string[];
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonExplore: string;
  heroButtonFinder: string;
  whatsappNumber: string;
  whatsappGreeting: string;
  instagram: string;
  tiktok: string;
  phone: string;
  email: string;
  storeAddress: string;
  freeShippingThreshold?: number;
  limaDistricts: DeliveryZoneRate[];
  provinciaRates: ProvinciaRate[];
  paymentInstructions: {
    yapePlin: {
      enabled: boolean;
      number: string;
      holder: string;
      qrNote: string;
    };
    transferencia: {
      enabled: boolean;
      bankName: string;
      accountNumber: string;
      cci: string;
      holder: string;
    };
    tarjeta: {
      enabled: boolean;
      note: string;
    };
  };
  policies: {
    shippingPolicy: string;
    exchangePolicy: string;
    privacyPolicy: string;
  };
}

export interface BootstrapResponse {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  settings: StoreSettings;
  faqs: FAQ[];
}
