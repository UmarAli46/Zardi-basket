export type EggType = 'white_farm' | 'desi_yellow' | 'hen' | 'duck' | 'quail' | 'liquid_whites';

export interface PackagingOption {
  id: '6pack' | '12pack' | '30tray';
  label: string;
  count: number;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  eggType: EggType;
  breed: string;
  coopOrigin: string;
  region: string;
  dietInfo: string;
  yolkScore: number; // 1-15 Roche Yolk Color Fan Scale
  batchCode: string;
  layDate: string;
  expiryDays: number;
  price6Pack: number;
  price12Pack: number;
  price30Tray: number;
  originalPrice12Pack?: number;
  stockQuantity: number; // in dozens/units
  badges: string[];
  imageUrl: string;
  nutritionalFacts: {
    proteinPerEgg: string;
    calories: string;
    omega3: string;
    cholesterol: string;
  };
  isActive: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  packagingSize?: '6pack' | '12pack' | '30tray';
  boxLabel?: string;
  qualityTier?: string;
}

export interface CartItem {
  id: string; // unique item composite key: `${productId}-${packagingId}`
  productId: string;
  title: string;
  packagingId: '6pack' | '12pack' | '30tray';
  packagingLabel: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  eggType: EggType;
}

export type PaymentMethod = 'safepay' | 'jazzcash_tid' | 'easypaisa_tid' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  packagingId: '6pack' | '12pack' | '30tray';
  packagingLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  breakageGuarantee: boolean;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string; // e.g. Safepay tracker or TID
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  batchTraceabilityCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  breakageGuaranteeFee: number;
  contactPhone: string;
  contactEmail: string;
  contactAddress?: string;
  merchantJazzCash: string;
  merchantEasypaisa: string;
  merchantTitle: string;
}
