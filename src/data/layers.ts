import type { ProductLayer, ServingShot } from '@/types'

/**
 * Katman haritaları — "Katmanları gör" animasyonunun verisi.
 *
 * `y` değerleri fotoğraflardan ölçüldü: görsel yüksekliğinin yüzdesi olarak
 * katmanın ortası. Kaynak kareler zaten kare çekildiği için kırpma yok;
 * yüzdeler her ölçekte geçerli. Yeni ürün eklerken görseli açıp her katmanın
 * ortasını yüzde olarak yazmak yeterli.
 *
 * Renkler index.css içindeki @theme token'larının hex karşılığı; yeni token
 * eklenmiyor.
 */
const K = '#ddcbb1' // cream-400  bisküvi
const C = '#faf5ec' // cream-100  krema
const S = '#e28f84' // blush-400  çilek
const B = '#ece0cd' // cream-300  muz
const CH = '#5c3826' // cocoa-700  çikolata
const O = '#2b1811' // cocoa-900  oreo
const LO = '#ac7d60' // cocoa-400  lotus
const W = '#8f5f45' // cocoa-500  ceviz
const RV = '#cf7367' // blush-500  red velvet
const KB = '#764a34' // cocoa-600  kakaolu bisküvi
// Balkabağı: token'larda turuncu yok; nokta katmanı tanıtsın diye gerçek renk
const PK = '#e3893f'

interface Seed {
  slug: string
  names: string[]
  colors: string[]
  /** Kabın sağ kenarı ve katman ortaları — cup sunumu */
  cup: { x: number; y: number[] }
  /** Kavanoz daha dolgun olduğu için katmanlar daha aşağıda */
  jar: { x: number; y: number[] }
}

const seeds: Seed[] = [
  {
    slug: 'cilekli-magnolya',
    names: ['Bisküvi kırığı', 'Magnolya kreması', 'Taze çilek', 'Bisküvi tabanı'],
    colors: [K, C, S, K],
    cup: { x: 72, y: [41, 48, 58, 68] },
    jar: { x: 71, y: [47, 55, 64, 75] },
  },
  {
    slug: 'muzlu-magnolya',
    names: ['Bisküvi kırığı', 'Magnolya kreması', 'Dilim muz', 'Bisküvi tabanı'],
    colors: [K, C, B, K],
    cup: { x: 72, y: [41, 48, 58, 68] },
    jar: { x: 72, y: [45, 52, 63, 74] },
  },
  {
    slug: 'cikolatali-magnolya',
    names: ['Bitter çikolata', 'Çikolata sosu', 'Magnolya kreması', 'Bisküvi tabanı'],
    colors: [CH, CH, C, K],
    cup: { x: 72, y: [40, 50, 57, 71] },
    jar: { x: 74, y: [40, 51, 57, 75] },
  },
  {
    slug: 'cilekli-muzlu-cikolatali-magnolya',
    names: ['Bisküvi kırığı', 'Çikolata sosu', 'Çilek & muz', 'Bisküvi tabanı'],
    colors: [K, CH, S, K],
    cup: { x: 72, y: [39, 47, 58, 68] },
    jar: { x: 74, y: [42, 51, 65, 77] },
  },
  {
    slug: 'oreolu-magnolya',
    names: ['Oreo bisküvi', 'Magnolya kreması', 'Oreo kırığı', 'Oreo tabanı'],
    colors: [O, C, O, O],
    cup: { x: 72, y: [36, 50, 57, 68] },
    jar: { x: 75, y: [37, 55, 61, 76] },
  },
  {
    slug: 'lotuslu-magnolya',
    names: ['Lotus bisküvi', 'Magnolya kreması', 'Karamelli kırık', 'Lotus tabanı'],
    colors: [LO, C, LO, LO],
    cup: { x: 72, y: [36, 50, 57, 68] },
    jar: { x: 75, y: [34, 52, 61, 75] },
  },
  {
    slug: 'cevizli-magnolya',
    names: ['Ceviz içi', 'Vanilyalı krema', 'Ceviz kırığı', 'Bisküvi tabanı'],
    colors: [W, C, W, K],
    cup: { x: 72, y: [41, 53, 61, 72] },
    jar: { x: 75, y: [37, 54, 63, 78] },
  },
  {
    slug: 'cilekli-red-velvet-magnolya',
    names: ['Red velvet kırığı', 'Magnolya kreması', 'Taze çilek', 'Red velvet taban'],
    colors: [RV, C, S, RV],
    cup: { x: 72, y: [40, 47, 58, 69] },
    jar: { x: 71, y: [46, 54, 64, 75] },
  },
  /* --- 2. grup: menünün geri kalanı. Aynı yöntemle ölçüldü; cup kenarı 72,
         kavanoz kenarı fotoğraftan (çoğunlukla 74) --- */
  {
    slug: 'cilekli-muzlu-magnolya',
    names: ['Bisküvi kırığı', 'Magnolya kreması', 'Çilek & muz', 'Bisküvi tabanı'],
    colors: [K, C, S, K],
    cup: { x: 72, y: [41, 48, 59, 69] },
    jar: { x: 72, y: [45, 52, 63, 74] },
  },
  {
    slug: 'cilekli-cikolatali-magnolya',
    names: ['Bisküvi kırığı', 'Çikolata sosu', 'Taze çilek', 'Bisküvi tabanı'],
    colors: [K, CH, S, K],
    cup: { x: 72, y: [40, 47, 59, 68] },
    jar: { x: 74, y: [42, 50, 65, 76] },
  },
  {
    slug: 'muzlu-cikolatali-magnolya',
    names: ['Bisküvi kırığı', 'Çikolata sosu', 'Dilim muz', 'Bisküvi tabanı'],
    colors: [K, CH, B, K],
    cup: { x: 72, y: [39, 46, 59, 68] },
    jar: { x: 74, y: [42, 49, 65, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-cilekli-magnolya',
    names: ['Kakaolu bisküvi', 'Magnolya kreması', 'Taze çilek', 'Kakaolu taban'],
    colors: [KB, C, S, KB],
    cup: { x: 72, y: [40, 49, 60, 68] },
    jar: { x: 74, y: [44, 52, 66, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-muzlu-magnolya',
    names: ['Kakaolu bisküvi', 'Magnolya kreması', 'Dilim muz', 'Kakaolu taban'],
    colors: [KB, C, B, KB],
    cup: { x: 72, y: [40, 48, 60, 69] },
    jar: { x: 74, y: [42, 49, 66, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-cilekli-muzlu-magnolya',
    names: ['Kakaolu bisküvi', 'Magnolya kreması', 'Çilek & muz', 'Kakaolu taban'],
    colors: [KB, C, S, KB],
    cup: { x: 72, y: [40, 48, 60, 68] },
    jar: { x: 74, y: [45, 53, 66, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-cikolatali-magnolya',
    names: ['Kakaolu bisküvi', 'Çikolata sosu', 'Magnolya kreması', 'Kakaolu taban'],
    colors: [KB, CH, C, KB],
    cup: { x: 72, y: [43, 49, 56, 70] },
    jar: { x: 74, y: [43, 51, 58, 76] },
  },
  {
    slug: 'kakaolu-biskuvili-cilekli-cikolatali-magnolya',
    names: ['Kakaolu bisküvi', 'Çikolata sosu', 'Taze çilek', 'Kakaolu taban'],
    colors: [KB, CH, S, KB],
    cup: { x: 72, y: [41, 47, 59, 68] },
    jar: { x: 74, y: [44, 50, 67, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-muzlu-cikolatali-magnolya',
    names: ['Kakaolu bisküvi', 'Çikolata sosu', 'Dilim muz', 'Kakaolu taban'],
    colors: [KB, CH, B, KB],
    cup: { x: 72, y: [39, 45, 59, 68] },
    jar: { x: 74, y: [41, 48, 65, 77] },
  },
  {
    slug: 'kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya',
    names: ['Kakaolu bisküvi', 'Çikolata sosu', 'Çilek & muz', 'Kakaolu taban'],
    colors: [KB, CH, S, KB],
    cup: { x: 72, y: [40, 47, 59, 68] },
    jar: { x: 74, y: [44, 50, 66, 77] },
  },
  {
    slug: 'oreolu-cilekli-magnolya',
    names: ['Oreo kırığı', 'Magnolya kreması', 'Taze çilek', 'Oreo tabanı'],
    colors: [O, C, S, O],
    cup: { x: 72, y: [39, 48, 58, 69] },
    jar: { x: 74, y: [41, 51, 68, 78] },
  },
  {
    slug: 'oreolu-muzlu-magnolya',
    names: ['Oreo kırığı', 'Magnolya kreması', 'Dilim muz', 'Oreo tabanı'],
    colors: [O, C, B, O],
    cup: { x: 72, y: [40, 48, 59, 69] },
    jar: { x: 74, y: [43, 50, 67, 78] },
  },
  {
    slug: 'cevizli-cikolatali-magnolya',
    names: ['Bisküvi kırığı', 'Çikolata sosu', 'Ceviz & çikolata', 'Bisküvi tabanı'],
    colors: [K, CH, W, K],
    cup: { x: 72, y: [44, 51, 62, 72] },
    jar: { x: 74, y: [45, 53, 64, 77] },
  },
  {
    slug: 'balkabakli-magnolya',
    names: ['Bisküvi kırığı', 'Balkabağı tatlısı', 'Magnolya kreması', 'Bisküvi tabanı'],
    colors: [K, PK, C, K],
    cup: { x: 72, y: [45, 52, 59, 73] },
    jar: { x: 74, y: [43, 52, 60, 77] },
  },
  {
    slug: 'cilekli-cikolatali-cup',
    names: ['Taze çilek', 'Çikolata sosu', 'Çilekli krema', 'Bisküvi tabanı'],
    colors: [S, CH, S, K],
    cup: { x: 72, y: [42, 48, 62, 75] },
    jar: { x: 75, y: [40, 50, 66, 80] },
  },
  {
    slug: 'muzlu-cikolatali-cup',
    names: ['Dilim muz', 'Çikolata sosu', 'Muzlu krema', 'Bisküvi tabanı'],
    colors: [B, CH, B, K],
    cup: { x: 72, y: [40, 46, 60, 72] },
    jar: { x: 75, y: [39, 46, 61, 74] },
  },
  {
    slug: 'cilekli-muzlu-cikolatali-cup',
    names: ['Çilek & muz', 'Çikolata sosu', 'Meyveli krema', 'Bisküvi tabanı'],
    colors: [S, CH, S, K],
    cup: { x: 72, y: [41, 49, 61, 73] },
    jar: { x: 75, y: [39, 49, 66, 81] },
  },
]

const toLayers = (names: string[], ys: number[], colors: string[]): ProductLayer[] =>
  names.map((name, i) => ({ name, y: ys[i], color: colors[i] }))

/**
 * Kavanoz görseli, cup görselinin yanında `-kavanoz` ekiyle duruyor
 * (bkz. catalog.ts `jarImage`). Aynı kuralı burada da uyguluyoruz.
 */
const jarImage = (image: string): string => image.replace(/(\.[a-z0-9]+)$/i, '-kavanoz$1')

const shot = (image: string, edgeX: number, layers: ProductLayer[]): ServingShot => ({
  image,
  edgeX,
  layers,
})

/** slug -> iki sunumun katman haritası */
export const servingLayers: Record<string, { cup: ServingShot; jar: ServingShot }> = Object.fromEntries(
  seeds.map((seed) => {
    const cupImage = `/images/products/${seed.slug}.webp`
    return [
      seed.slug,
      {
        cup: shot(cupImage, seed.cup.x, toLayers(seed.names, seed.cup.y, seed.colors)),
        jar: shot(jarImage(cupImage), seed.jar.x, toLayers(seed.names, seed.jar.y, seed.colors)),
      },
    ]
  }),
)

/** Ana sayfadaki katman vitrinine girecek ürünler, bu sırayla (nottaki 8 ürün) */
export const showcaseSlugs = [
  'cilekli-magnolya',
  'muzlu-magnolya',
  'cikolatali-magnolya',
  'cilekli-muzlu-cikolatali-magnolya',
  'oreolu-magnolya',
  'lotuslu-magnolya',
  'cevizli-magnolya',
  'cilekli-red-velvet-magnolya',
]
