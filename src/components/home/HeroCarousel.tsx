import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '@/context/CatalogContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'

/**
 * Bir karenin toplam süresi: FADE kadar solma + kalanı sabit durma.
 * FADE her zaman INTERVAL'den küçük kalmalı; aksi hâlde önceki geçiş
 * bitmeden yenisi başlar ve görüntü sıçrar.
 */
const INTERVAL = 2400
const FADE = 1200

/**
 * Geçiş biçimi. 'fade' görseli yerinde soldurur, 'slide' yandan kaydırır.
 * Değiştirmek için bu sabiti güncellemek yeterli.
 */
const TRANSITION: 'fade' | 'slide' = 'fade'

/**
 * Ana sayfadaki büyük görsel. Cup ve kavanoz sunumları dönüşümlü gösterilir;
 * her karede farklı bir ürün çıkar.
 *
 * `jar: true` olan kayıtlar ürünün galerisindeki kavanoz fotoğrafını kullanır
 * (galeri sırası: [cup, kavanoz] — bkz. data/catalog.ts).
 */
const SLIDES: { slug: string; jar: boolean }[] = [
  { slug: 'cilekli-red-velvet-magnolya', jar: false },
  { slug: 'lotuslu-magnolya', jar: true },
  { slug: 'cilekli-cikolatali-cup', jar: false },
  { slug: 'balkabakli-magnolya', jar: true },
  { slug: 'kakaolu-biskuvili-cilekli-cikolatali-magnolya', jar: false },
  { slug: 'cevizli-cikolatali-magnolya', jar: true },
  { slug: 'oreolu-magnolya', jar: false },
  { slug: 'cilekli-red-velvet-magnolya', jar: true },
]

const BLOB = 'rounded-[38%_62%_55%_45%/45%_38%_62%_55%]'

export function HeroCarousel() {
  const { getProduct } = useCatalog()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  /**
   * İki katman tutulur: geçiş sırasında önceki görsel altta tam opak kalır,
   * yeni görsel üstünde belirir. Tek katmanla çapraz geçişte ikisi de yarı
   * saydam olduğu an zemin sızıyor ve geçiş "sıçrama" gibi görünüyordu.
   */
  const [{ current, previous }, setFrame] = useState({ current: 0, previous: -1 })
  const [paused, setPaused] = useState(false)
  /** Sayfa zaten gizliyken açılmış olabilir; olay beklemeden ilk durumu oku. */
  const hidden = useRef(typeof document !== 'undefined' && document.visibilityState === 'hidden')

  const slides = useMemo(
    () =>
      SLIDES.flatMap(({ slug, jar }) => {
        const product = getProduct(slug)
        if (!product) return []
        const image = jar ? (product.gallery?.[1] ?? product.image) : product.image
        return [{
          slug,
          image,
          name: product.name,
          alt: `${product.name} — ${jar ? 'kavanoz' : 'cup'} sunum`,
        }]
      }),
    [getProduct],
  )

  /* Sekme arka plandayken döndürme; geri dönünce kaldığı yerden sürer. */
  useEffect(() => {
    const onVisibility = () => {
      hidden.current = document.visibilityState === 'hidden'
    }
    // Sayfa zaten gizliyken açılmış olabilir; olay beklemeden bir kez oku.
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return
    const timer = window.setInterval(() => {
      if (hidden.current) return
      setFrame((frame) => ({
        current: (frame.current + 1) % slides.length,
        previous: frame.current,
      }))
    }, INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  if (slides.length === 0) return null
  const active = slides[current] ?? slides[0]

  return (
    <Link
      to={`/menu/${active.slug}`}
      aria-label={`${active.name} — ürünü incele`}
      className={cn(
        // `isolate` şart: içerideki z-index'ler kendi bağlamında kalsın, yoksa
        // üstteki görsel yüzen kartların önüne geçiyor
        'relative isolate mx-auto block aspect-square w-full max-w-[26rem] md:max-w-none',
        BLOB,
      )}
      /* Üzerine gelince dursun: tıklamak isteyen kaçan hedefle uğraşmasın. */
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className={cn('absolute inset-0 rotate-3 bg-cream-200', BLOB)} aria-hidden />

      <span className={cn('absolute inset-0 block overflow-hidden', BLOB)}>
        {slides.map((slide, i) => (
          <img
            key={slide.image}
            src={assetUrl(slide.image)}
            alt={i === current ? slide.alt : ''}
            aria-hidden={i !== current}
            width={1100}
            height={1100}
            decoding={i === 0 ? 'sync' : 'async'}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ transitionDuration: `${FADE}ms` }}
            className={cn(
              'absolute inset-0 size-full object-cover',
              TRANSITION === 'fade'
                ? cn(
                    // Çıkan görsel altta opak kalır; üstteki belirirken zemin sızmaz
                    i === current &&
                      'z-20 scale-100 opacity-100 transition-[opacity,transform] ease-[var(--ease-soft)]',
                    i === previous && 'z-10 scale-100 opacity-100',
                    i !== current && i !== previous && 'z-0 scale-[1.04] opacity-0',
                  )
                : cn(
                    // Kayma: giren sağdan gelir, çıkan sola gider, bekleyenler sağda durur
                    'transition-transform ease-[var(--ease-soft)]',
                    i === current && 'z-20 translate-x-0',
                    i === previous && 'z-10 -translate-x-full',
                    i !== current && i !== previous && 'z-0 translate-x-full transition-none',
                  ),
            )}
          />
        ))}
      </span>
    </Link>
  )
}
