import type { Campaign, Category, Product, SocialMediaPost, StoreSettings } from '@/types'
import { servingOnly } from './options'

/* ------------------------------------------------------------- Kategoriler */

export const categories: Category[] = [
  { id: 'cilekli', slug: 'cilekli', name: 'Çilekli', tagline: 'Taze çilekle', image: '/images/products/cilekli-magnolya.webp', tone: 'blush', order: 1, isActive: true },
  { id: 'muzlu', slug: 'muzlu', name: 'Muzlu', tagline: 'Dilim muzla', image: '/images/products/muzlu-magnolya.webp', tone: 'cream', order: 2, isActive: true },
  { id: 'cikolatali', slug: 'cikolatali', name: 'Çikolatalı', tagline: 'Yoğun çikolata sosu', image: '/images/products/cikolatali-magnolya.webp', tone: 'cocoa', order: 3, isActive: true },
  { id: 'kakaolu-biskuvili', slug: 'kakaolu-biskuvili', name: 'Kakaolu Bisküvili', tagline: 'Kakaolu kırıklarla', image: '/images/products/kakaolu-biskuvili-cilekli-cikolatali-magnolya.webp', tone: 'cocoa', order: 4, isActive: true },
  { id: 'oreolu', slug: 'oreolu', name: 'Oreolu', tagline: 'Bol Oreo kırığı', image: '/images/products/oreolu-magnolya.webp', tone: 'cocoa', order: 5, isActive: true },
  { id: 'lotuslu', slug: 'lotuslu', name: 'Lotuslu', tagline: 'Karamelize bisküvi', image: '/images/products/lotuslu-magnolya.webp', tone: 'cream', order: 6, isActive: true },
  { id: 'cevizli', slug: 'cevizli', name: 'Cevizli', tagline: 'Çıtır ceviz', image: '/images/products/cevizli-magnolya.webp', tone: 'olive', order: 7, isActive: true },
  { id: 'balkabakli', slug: 'balkabakli', name: 'Balkabaklı', tagline: 'Mevsiminde güzel', image: '/images/products/balkabakli-magnolya.webp', tone: 'cream', order: 8, isActive: true },
  { id: 'red-velvet', slug: 'red-velvet', name: 'Red Velvet', tagline: 'Çilekli ve kadifemsi', image: '/images/products/cilekli-red-velvet-magnolya.webp', tone: 'blush', order: 9, isActive: true },
]

/* ------------------------------------------------------------------ Ürünler */

/**
 * ⚠️ FİYATLAR GEÇİCİDİR.
 * İşletmeden alınacak güncel fiyat listesiyle değiştirilmelidir.
 * Fiyatlar yönetim panelinden de tek tek güncellenebilir.
 */
const productList: Product[] = [
  /* --- Klasik Magnolya --- */
  {
    id: 'cilekli-magnolya',
    slug: 'cilekli-magnolya',
    name: 'Çilekli Magnolya',
    description: 'Süt kreması, bisküvi kırıkları ve dilimlenmiş taze çilek.',
    categoryIds: ['cilekli'],
    price: 150,
    image: '/images/products/cilekli-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['Taze çilek'],
    order: 1,
  },
  {
    id: 'muzlu-magnolya',
    slug: 'muzlu-magnolya',
    name: 'Muzlu Magnolya',
    description: 'Süt kreması, bisküvi kırıkları ve dilim muz.',
    categoryIds: ['muzlu'],
    price: 145,
    image: '/images/products/muzlu-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 2,
  },
  {
    id: 'cilekli-muzlu-magnolya',
    slug: 'cilekli-muzlu-magnolya',
    name: 'Çilekli Muzlu Magnolya',
    description: 'Taze çilek ve muzun bisküvili krema katmanlarıyla buluşması.',
    categoryIds: ['cilekli', 'muzlu'],
    price: 160,
    image: '/images/products/cilekli-muzlu-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    order: 3,
  },
  {
    id: 'cikolatali-magnolya',
    slug: 'cikolatali-magnolya',
    name: 'Çikolatalı Magnolya',
    description: 'Bisküvili krema üzerine yoğun çikolata sosu.',
    categoryIds: ['cikolatali'],
    price: 155,
    image: '/images/products/cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 4,
  },
  {
    id: 'cilekli-cikolatali-magnolya',
    slug: 'cilekli-cikolatali-magnolya',
    name: 'Çilekli Çikolatalı Magnolya',
    description: 'Taze çilek, çikolata sosu ve bisküvili krema.',
    categoryIds: ['cilekli', 'cikolatali'],
    price: 165,
    image: '/images/products/cilekli-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    order: 5,
  },
  {
    id: 'muzlu-cikolatali-magnolya',
    slug: 'muzlu-cikolatali-magnolya',
    name: 'Muzlu Çikolatalı Magnolya',
    description: 'Dilim muz, çikolata sosu ve bisküvili krema.',
    categoryIds: ['muzlu', 'cikolatali'],
    price: 160,
    image: '/images/products/muzlu-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 6,
  },
  {
    id: 'cilekli-muzlu-cikolatali-magnolya',
    slug: 'cilekli-muzlu-cikolatali-magnolya',
    name: 'Çilekli Muzlu Çikolatalı Magnolya',
    description: 'Çilek, muz ve çikolata sosunun bir arada olduğu tam kadro.',
    categoryIds: ['cilekli', 'muzlu', 'cikolatali'],
    price: 175,
    image: '/images/products/cilekli-muzlu-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 7,
  },

  {
    id: 'balkabakli-magnolya',
    slug: 'balkabakli-magnolya',
    name: 'Balkabaklı Magnolya',
    description: 'Kendi pişirdiğimiz balkabağı püresi, süt kreması ve çıtır bisküvi kırıkları.',
    categoryIds: ['balkabakli'],
    price: 175,
    image: '/images/products/balkabakli-magnolya.webp',
    isActive: true,
    isFeatured: true,
    badge: { label: 'Mevsiminde güzel', tone: 'dark' },
    order: 8,
  },

  /* --- Kakaolu Bisküvili --- */
  {
    id: 'kakaolu-biskuvili-cilekli-magnolya',
    slug: 'kakaolu-biskuvili-cilekli-magnolya',
    name: 'Kakaolu Bisküvili Çilekli Magnolya',
    description: 'Kakaolu bisküvi kırıkları, süt kreması ve taze çilek.',
    categoryIds: ['kakaolu-biskuvili', 'cilekli'],
    price: 165,
    image: '/images/products/kakaolu-biskuvili-cilekli-magnolya.webp',
    isActive: true,
    isFeatured: true,
    order: 9,
  },
  {
    id: 'kakaolu-biskuvili-muzlu-magnolya',
    slug: 'kakaolu-biskuvili-muzlu-magnolya',
    name: 'Kakaolu Bisküvili Muzlu Magnolya',
    description: 'Kakaolu bisküvi kırıkları, süt kreması ve dilim muz.',
    categoryIds: ['kakaolu-biskuvili', 'muzlu'],
    price: 160,
    image: '/images/products/kakaolu-biskuvili-muzlu-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 10,
  },
  {
    id: 'kakaolu-biskuvili-cilekli-muzlu-magnolya',
    slug: 'kakaolu-biskuvili-cilekli-muzlu-magnolya',
    name: 'Kakaolu Bisküvili Çilekli Muzlu Magnolya',
    description: 'Kakaolu bisküvi katmanları arasında çilek ve muz.',
    categoryIds: ['kakaolu-biskuvili', 'cilekli', 'muzlu'],
    price: 175,
    image: '/images/products/kakaolu-biskuvili-cilekli-muzlu-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 11,
  },
  {
    id: 'kakaolu-biskuvili-cikolatali-magnolya',
    slug: 'kakaolu-biskuvili-cikolatali-magnolya',
    name: 'Kakaolu Bisküvili Çikolatalı Magnolya',
    description: 'Kakaolu bisküvi ve çikolata sosu — çikolata sevenlere.',
    categoryIds: ['kakaolu-biskuvili', 'cikolatali'],
    price: 170,
    image: '/images/products/kakaolu-biskuvili-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    isPopular: true,
    order: 12,
  },
  {
    id: 'kakaolu-biskuvili-cilekli-cikolatali-magnolya',
    slug: 'kakaolu-biskuvili-cilekli-cikolatali-magnolya',
    name: 'Kakaolu Bisküvili Çilekli Çikolatalı Magnolya',
    description: 'Kakaolu bisküvi, çikolata sosu ve taze çilek.',
    categoryIds: ['kakaolu-biskuvili', 'cilekli', 'cikolatali'],
    price: 180,
    image: '/images/products/kakaolu-biskuvili-cilekli-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: true,
    order: 13,
  },
  {
    id: 'kakaolu-biskuvili-muzlu-cikolatali-magnolya',
    slug: 'kakaolu-biskuvili-muzlu-cikolatali-magnolya',
    name: 'Kakaolu Bisküvili Muzlu Çikolatalı Magnolya',
    description: 'Kakaolu bisküvi, çikolata sosu ve dilim muz.',
    categoryIds: ['kakaolu-biskuvili', 'muzlu', 'cikolatali'],
    price: 175,
    image: '/images/products/kakaolu-biskuvili-muzlu-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 14,
  },
  {
    id: 'kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya',
    slug: 'kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya',
    name: 'Kakaolu Bisküvili Çilekli Muzlu Çikolatalı Magnolya',
    description: 'Kakaolu bisküvi, çikolata, çilek ve muz — hepsi bir arada.',
    categoryIds: ['kakaolu-biskuvili', 'cilekli', 'muzlu', 'cikolatali'],
    price: 190,
    image: '/images/products/kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 15,
  },

  /* --- Oreolu --- */
  {
    id: 'oreolu-magnolya',
    slug: 'oreolu-magnolya',
    name: 'Oreolu Magnolya',
    description: 'Bol Oreo kırığı ve süt kreması katmanları.',
    categoryIds: ['oreolu'],
    price: 170,
    image: '/images/products/oreolu-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['Çok satan'],
    order: 16,
  },
  {
    id: 'oreolu-cilekli-magnolya',
    slug: 'oreolu-cilekli-magnolya',
    name: 'Oreolu Çilekli Magnolya',
    description: 'Oreo kırıkları arasında taze çilek dilimleri.',
    categoryIds: ['oreolu', 'cilekli'],
    price: 180,
    image: '/images/products/oreolu-cilekli-magnolya.webp',
    isActive: true,
    isFeatured: true,
    order: 17,
  },
  {
    id: 'oreolu-muzlu-magnolya',
    slug: 'oreolu-muzlu-magnolya',
    name: 'Oreolu Muzlu Magnolya',
    description: 'Oreo kırıkları arasında dilim muz.',
    categoryIds: ['oreolu', 'muzlu'],
    price: 175,
    image: '/images/products/oreolu-muzlu-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 18,
  },

  /* --- Lotuslu --- */
  {
    id: 'lotuslu-magnolya',
    slug: 'lotuslu-magnolya',
    name: 'Lotuslu Magnolya',
    description: 'Karamelize Lotus bisküvi kırıkları ve süt kreması.',
    categoryIds: ['lotuslu'],
    price: 185,
    image: '/images/products/lotuslu-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['Çok satan'],
    order: 19,
  },

  /* --- Cevizli --- */
  {
    id: 'cevizli-magnolya',
    slug: 'cevizli-magnolya',
    name: 'Cevizli Magnolya',
    description: 'Çıtır ceviz kırıkları ve süt kreması katmanları.',
    categoryIds: ['cevizli'],
    price: 180,
    image: '/images/products/cevizli-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 20,
  },
  {
    id: 'cevizli-cikolatali-magnolya',
    slug: 'cevizli-cikolatali-magnolya',
    name: 'Cevizli Çikolatalı Magnolya',
    description: 'Ceviz kırıkları, çikolata sosu ve süt kreması.',
    categoryIds: ['cevizli', 'cikolatali'],
    price: 190,
    image: '/images/products/cevizli-cikolatali-magnolya.webp',
    isActive: true,
    isFeatured: false,
    order: 21,
  },

  /* --- Red Velvet --- */
  {
    id: 'cilekli-red-velvet-magnolya',
    slug: 'cilekli-red-velvet-magnolya',
    name: 'Çilekli Red Velvet Magnolya',
    description: 'Red velvet kırıkları, süt kreması ve bardağı çevreleyen taze çilek dilimleri.',
    categoryIds: ['red-velvet', 'cilekli'],
    price: 195,
    image: '/images/products/cilekli-red-velvet-magnolya.webp',
    isActive: true,
    isFeatured: true,
    isNew: true,
    tags: ['Taze çilek'],
    order: 22,
  },

  /* --- Cup --- */
  {
    id: 'cilekli-cikolatali-cup',
    slug: 'cilekli-cikolatali-cup',
    name: 'Çilekli Çikolatalı Cup',
    description: 'Üstü çikolata sosuyla kaplı, doğranmış taze çilekli cup.',
    categoryIds: ['cilekli', 'cikolatali'],
    price: 185,
    image: '/images/products/cilekli-cikolatali-cup.webp',
    isActive: true,
    isFeatured: true,
    isPopular: true,
    tags: ['Taze çilek'],
    order: 23,
  },
  {
    id: 'muzlu-cikolatali-cup',
    slug: 'muzlu-cikolatali-cup',
    name: 'Muzlu Çikolatalı Cup',
    description: 'Üstü çikolata sosuyla kaplı, doğranmış muzlu cup.',
    categoryIds: ['muzlu', 'cikolatali'],
    price: 180,
    image: '/images/products/muzlu-cikolatali-cup.webp',
    isActive: true,
    isFeatured: false,
    order: 24,
  },
  {
    id: 'cilekli-muzlu-cikolatali-cup',
    slug: 'cilekli-muzlu-cikolatali-cup',
    name: 'Çilekli Muzlu Çikolatalı Cup',
    description: 'Çilek, muz ve çikolata sosunun bir arada olduğu cup.',
    categoryIds: ['cilekli', 'muzlu', 'cikolatali'],
    price: 195,
    image: '/images/products/cilekli-muzlu-cikolatali-cup.webp',
    isActive: true,
    isFeatured: true,
    order: 25,
  },
]

/** Cup fotoğrafından kavanoz fotoğrafının yolunu üretir. */
const jarImage = (image: string): string => image.replace(/(\.[a-z0-9]+)$/i, '-kavanoz$1')

/**
 * Menüdeki her tatlı hem cup hem kavanoz olarak hazırlanıyor; sunum seçeneği
 * tek yerden bütün ürünlere iliştirilir. Sunum seçeneği olan ürünün galerisi
 * cup ve kavanoz fotoğraflarından oluşur — bu iki dosya birlikte bulunur.
 *
 * Bir ürüne özel seçenek seti ya da galeri gerekirse o ürüne doğrudan
 * `options` / `gallery` yazmak yeterli.
 */
export const products: Product[] = productList.map((product) => {
  const options = product.options ?? servingOnly
  const hasJar = options.some((option) => option.id === 'sunum')
  return {
    ...product,
    options,
    gallery: product.gallery ?? (hasJar ? [product.image, jarImage(product.image)] : [product.image]),
  }
})

/* -------------------------------------------------------------- Kampanyalar */

/**
 * Aktif kampanya yok. Yönetim panelinden eklendiğinde ana sayfada kampanya
 * bölümü ve menüdeki "Kampanyalar" bağlantısı otomatik görünür hale gelir.
 */
export const campaigns: Campaign[] = []

/* ---------------------------------------------------------------- Instagram */

export const instagramPosts: SocialMediaPost[] = [
  { id: 'post-1', image: '/images/genel/vitrin-tumu-kare.webp', caption: 'Bugün vitrinde neler var?', likes: 412, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-2', image: '/images/genel/oreolu-uclu-kavanoz-kare.webp', caption: 'Oreolu üçlü — klasikleşti.', likes: 623, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-3', image: '/images/products/lotuslu-magnolya.webp', caption: 'Lotuslu Magnolya hazır.', likes: 501, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-4', image: '/images/genel/karisik-dortlu-kavanoz-kare.webp', caption: 'Çilek, muz, çikolata — dördü bir arada.', likes: 388, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-5', image: '/images/genel/kakaolu-uclu-kavanoz-kare.webp', caption: 'Kakaolu bisküvili üçlü.', likes: 457, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-6', image: '/images/genel/cevizli-ikili-kavanoz-kare.webp', caption: 'Cevizli, sade ve çikolatalı.', likes: 265, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-7', image: '/images/products/muzlu-magnolya.webp', caption: 'Muzlu Magnolya — sade sevenlere.', likes: 198, url: 'https://instagram.com/gonuldenntatlar' },
  { id: 'post-8', image: '/images/genel/karisik-dortlu-cup-kare.webp', caption: 'Aynı tatlar, cup sunumuyla.', likes: 344, url: 'https://instagram.com/gonuldenntatlar' },
]

/* ------------------------------------------------------------------ İşletme */

/**
 * Sipariş hattı numarası.
 *
 * GitHub Actions, tanımlı olmayan bir repo değişkenini boş metin olarak geçiriyor;
 * `??` boş metni yakalamadığı için numara sessizce boş kalıyor ve bütün WhatsApp
 * bağlantıları alıcısız bir wa.me adresine dönüşüyordu. Bu yüzden sadece rakamlara
 * indirip uzunluğu da kontrol ediyoruz.
 *
 * ⚠️ Yedek değer gerçek bir numara değildir. Canlıda repo değişkeni
 * VITE_WHATSAPP_NUMBER mutlaka tanımlı olmalı.
 */
const FALLBACK_WHATSAPP = '905000000000'

function whatsappNumber(): string {
  let digits = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

  // wa.me ülke kodu ister; yerel yazımları (0532…, 532…) 90'lı biçime çevir
  if (digits.length === 11 && digits.startsWith('0')) digits = `90${digits.slice(1)}`
  else if (digits.length === 10 && digits.startsWith('5')) digits = `90${digits}`

  if (digits.length >= 10) return digits
  if (import.meta.env.DEV) {
    console.warn(
      '[Gönülden Tatlar] VITE_WHATSAPP_NUMBER tanımlı değil; siparişler için geçici numara kullanılıyor.',
    )
  }
  return FALLBACK_WHATSAPP
}

export const storeSettings: StoreSettings = {
  name: 'Gönülden Tatlar',
  slogan: 'Tatlısı gönülden, lezzeti dilden dile.',
  phone: '+90 500 000 00 00',
  whatsapp: whatsappNumber(),
  instagram: 'https://instagram.com/gonuldenntatlar',
  instagramHandle: '@gonuldenntatlar',
  address: 'Cumhuriyet Mah. Tatlı Sokak No: 12/A, Merkez',
  addressShort: 'Cumhuriyet Mah. Tatlı Sk. No:12/A',
  mapsUrl: 'https://maps.google.com/?q=G%C3%B6n%C3%BClden+Tatlar',
  isOpen: true,
  showPrices: false,
  minOrderTotal: 250,
  deliveryFee: 49,
  freeDeliveryOver: 600,
  hours: [
    { day: 1, label: 'Pazartesi', open: '11:00', close: '23:00', isClosed: false },
    { day: 2, label: 'Salı', open: '11:00', close: '23:00', isClosed: false },
    { day: 3, label: 'Çarşamba', open: '11:00', close: '23:00', isClosed: false },
    { day: 4, label: 'Perşembe', open: '11:00', close: '23:00', isClosed: false },
    { day: 5, label: 'Cuma', open: '11:00', close: '00:00', isClosed: false },
    { day: 6, label: 'Cumartesi', open: '11:00', close: '00:00', isClosed: false },
    { day: 0, label: 'Pazar', open: '12:00', close: '23:00', isClosed: false },
  ],
}
