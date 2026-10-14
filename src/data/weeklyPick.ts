import type { Product } from '@/types'

/**
 * "Bu haftanın favorisi" sırası. Her pazartesi 00:00'da (İstanbul saati)
 * listede bir sonraki ürüne geçilir; liste bitince başa dönülür. Değişim
 * tarayıcıda hesaplandığı için yeniden yayın gerekmez.
 *
 * Tatlar dönüşümlü dizildi: art arda iki hafta aynı aileden (kakaolu,
 * oreolu, cup…) ürün gelmesin. Balkabaklı mevsiminde olmadığı için yok;
 * mevsimi gelince listeye eklemek yeterli. Listede olup menüde pasif olan
 * ürün atlanır.
 */
export const WEEKLY_PICKS = [
  'lotuslu-magnolya',
  'cilekli-magnolya',
  'oreolu-magnolya',
  'kakaolu-biskuvili-cikolatali-magnolya',
  'cilekli-red-velvet-magnolya',
  'muzlu-cikolatali-magnolya',
  'cilekli-cikolatali-cup',
  'cevizli-magnolya',
  'kakaolu-biskuvili-cilekli-magnolya',
  'oreolu-cilekli-magnolya',
  'cilekli-muzlu-cikolatali-magnolya',
  'muzlu-cikolatali-cup',
  'cikolatali-magnolya',
  'kakaolu-biskuvili-muzlu-magnolya',
  'oreolu-muzlu-magnolya',
  'cilekli-cikolatali-magnolya',
  'cevizli-cikolatali-magnolya',
  'kakaolu-biskuvili-cilekli-cikolatali-magnolya',
  'cilekli-muzlu-cikolatali-cup',
  'kakaolu-biskuvili-cilekli-muzlu-magnolya',
  'cilekli-muzlu-magnolya',
  'kakaolu-biskuvili-muzlu-cikolatali-magnolya',
  'muzlu-magnolya',
  'kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya',
]

/** Sıranın başladığı pazartesi: bu hafta listenin ilk ürünü */
const START = Date.UTC(2026, 9, 12)
const WEEK = 7 * 24 * 60 * 60 * 1000

/** Bugünün İstanbul'daki takvim günü (gece yarısı, UTC olarak) */
function istanbulDay(now: Date): number {
  // en-CA biçimi YYYY-MM-DD verir
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .split('-')
    .map(Number)
  return Date.UTC(y, m - 1, d)
}

/** Bu haftanın favorisi; listede etkin ürün yoksa undefined */
export function weeklyPick(products: Product[], now = new Date()): Product | undefined {
  const pool = WEEKLY_PICKS.map((slug) => products.find((product) => product.slug === slug)).filter(
    (product): product is Product => Boolean(product),
  )
  if (pool.length === 0) return undefined
  const week = Math.floor((istanbulDay(now) - START) / WEEK)
  // Saat geri alınmış bir cihazda hafta negatif çıkabilir
  return pool[((week % pool.length) + pool.length) % pool.length]
}
