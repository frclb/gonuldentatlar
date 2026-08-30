/**
 * Gönülden Tatlar — Domain modeli.
 * Bugün mock data ile besleniyor; alanlar gerçek bir backend'e (REST/Supabase)
 * birebir taşınabilecek şekilde tasarlandı.
 */

/* ------------------------------------------------------------------ Katalog */

export interface Category {
  id: string
  slug: string
  name: string
  /** Kategori kartındaki kısa alt metin */
  tagline?: string
  image: string
  /** Marka renk sistemindeki vurgu tonu — kategori kartı arka planı */
  tone: 'cocoa' | 'olive' | 'blush' | 'cream'
  order: number
  isActive: boolean
}

export type ProductOptionType = 'single' | 'multiple'

export interface ProductOptionValue {
  id: string
  name: string
  /** TL cinsinden fiyat farkı. 0 ise ücretsiz. */
  priceDelta: number
  isDefault?: boolean
  isAvailable?: boolean
}

export interface ProductOption {
  id: string
  name: string
  type: ProductOptionType
  required?: boolean
  /** `multiple` tipinde en fazla kaç seçim yapılabilir */
  maxSelect?: number
  values: ProductOptionValue[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  isDefault?: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  categoryId: string
  /** TL cinsinden temel fiyat */
  price: number
  oldPrice?: number
  image: string
  gallery?: string[]
  isActive: boolean
  isFeatured: boolean
  isNew?: boolean
  isPopular?: boolean
  discountPercentage?: number
  /** Ürün kartında gösterilen kısa etiketler: "Taze çilek", "Günlük hazır" vb. */
  tags?: string[]
  variants?: ProductVariant[]
  options?: ProductOption[]
  order?: number
}

/* --------------------------------------------------------------- Kampanyalar */

export interface Campaign {
  id: string
  slug: string
  title: string
  description: string
  image: string
  /** Kampanya paketinin normal toplamı */
  oldPrice?: number
  price?: number
  discountPercentage?: number
  startsAt: string
  endsAt: string
  isActive: boolean
  /** Kampanyaya dahil ürünlerin id'leri — menüde filtrelemek için */
  productIds?: string[]
  ctaLabel?: string
  tone: 'cocoa' | 'olive' | 'blush'
}

/* --------------------------------------------------------------------- Sepet */

export interface SelectedOption {
  optionId: string
  optionName: string
  valueIds: string[]
  valueNames: string[]
  priceDelta: number
}

export interface CartItem {
  /** Ürün + seçenek kombinasyonundan üretilen kararlı anahtar */
  key: string
  productId: string
  slug: string
  name: string
  image: string
  /** Seçenekler dahil, birim fiyat (TL) */
  unitPrice: number
  basePrice: number
  quantity: number
  variantId?: string
  variantName?: string
  selectedOptions: SelectedOption[]
  note?: string
}

/* -------------------------------------------------------------- Sipariş akışı */

export type DeliveryType = 'pickup' | 'delivery'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Address {
  fullAddress: string
  directions?: string
}

export interface Customer {
  fullName: string
  phone: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  optionsSummary: string
  note?: string
}

export interface Order {
  id: string
  code: string
  createdAt: string
  status: OrderStatus
  deliveryType: DeliveryType
  customer: Customer
  address?: Address
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  note?: string
  /** Sipariş WhatsApp üzerinden mi iletildi */
  channel: 'whatsapp' | 'web'
}

/* --------------------------------------------------------------- İşletme */

export interface BusinessHour {
  /** 0 = Pazar ... 6 = Cumartesi */
  day: number
  label: string
  open: string
  close: string
  isClosed: boolean
}

export interface StoreSettings {
  name: string
  slogan: string
  phone: string
  whatsapp: string
  instagram: string
  instagramHandle: string
  address: string
  addressShort: string
  mapsUrl: string
  isOpen: boolean
  minOrderTotal: number
  deliveryFee: number
  freeDeliveryOver: number
  hours: BusinessHour[]
}

export interface SocialMediaPost {
  id: string
  image: string
  caption: string
  likes: number
  url: string
}
