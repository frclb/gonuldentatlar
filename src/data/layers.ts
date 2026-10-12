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

/** Ana sayfadaki katman vitrinine girecek ürünler, bu sırayla */
export const layeredSlugs = seeds.map((seed) => seed.slug)
