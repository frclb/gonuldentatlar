import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '@/context/CatalogContext'
import { useIntro } from '@/context/IntroContext'
import { servingLayers } from '@/data/layers'
import { useCanHover } from '@/hooks/useCanHover'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'

/**
 * Bir karenin toplam süresi: FADE kadar solma + kalanı sabit durma.
 * FADE her zaman INTERVAL'den küçük kalmalı; aksi hâlde önceki geçiş
 * bitmeden yenisi başlar ve görüntü sıçrar.
 */
const INTERVAL = 3000
const FADE = 1500

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

/** Açıkken görsel bu kadar büyür; noktalar da aynı ölçekle yer değiştirir */
const ZOOM = 1.03
/** Noktadan etikete çizginin uzunluğu (%) */
const LINE = 7
const SPRING = 'cubic-bezier(.34,1.56,.64,1)'

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
  // Katman etiketleri açık mı: masaüstünde üzerine gelince, dokunmatikte ilk dokunuşta
  const [open, setOpen] = useState(false)
  const canHover = useCanHover()
  const link = useRef<HTMLAnchorElement>(null)

  // Noktalar Hero açıldıktan sonra kademeli belirir; açılış oynuyorsa onu bekler
  const { heroIn } = useIntro()
  const [dotsIn, setDotsIn] = useState(false)
  useEffect(() => {
    if (!heroIn) return
    // Önce scale(0) boyansın, sonra geçiş başlasın
    const timer = window.setTimeout(() => setDotsIn(true), 30)
    return () => window.clearTimeout(timer)
  }, [heroIn])

  // Dokunmatikte açık etiketler, görselin dışına dokununca kapansın
  useEffect(() => {
    if (!open || canHover) return
    const onDown = (event: PointerEvent) => {
      if (!link.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, canHover])
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
          // Katman noktaları: o karedeki ürünün ve sunumun haritası
          shot: servingLayers[slug]?.[jar ? 'jar' : 'cup'],
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
    // Etiketler açıkken de dur: okunurken ürün değişmesin
    if (paused || open || reducedMotion || slides.length < 2) return
    const timer = window.setInterval(() => {
      if (hidden.current) return
      setFrame((frame) => ({
        current: (frame.current + 1) % slides.length,
        previous: frame.current,
      }))
    }, INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused, open, reducedMotion, slides.length])

  if (slides.length === 0) return null
  const active = slides[current] ?? slides[0]
  const shot = active.shot
  // Görsel büyüyünce noktalar da merkezden aynı oranda açılır
  const at = (value: number) => 50 + (value - 50) * (open ? ZOOM : 1)

  return (
    <Link
      ref={link}
      to={`/menu/${active.slug}`}
      aria-label={`${active.name} — ürünü incele`}
      className={cn(
        // `isolate` şart: içerideki z-index'ler kendi bağlamında kalsın, yoksa
        // üstteki görsel yüzen kartların önüne geçiyor
        'relative isolate mx-auto block aspect-square w-full max-w-[26rem] md:max-w-none',
        BLOB,
      )}
      /* Üzerine gelince dursun: tıklamak isteyen kaçan hedefle uğraşmasın. */
      onMouseEnter={() => {
        setPaused(true)
        if (canHover) setOpen(true)
      }}
      onMouseLeave={() => {
        setPaused(false)
        setOpen(false)
      }}
      onFocus={() => {
        setPaused(true)
        setOpen(true)
      }}
      onBlur={() => {
        setPaused(false)
        setOpen(false)
      }}
      // Dokunmatikte ilk dokunuş katmanları açar, ikincisi ürüne gider
      onClick={(event) => {
        if (!canHover && !open && shot) {
          event.preventDefault()
          setOpen(true)
        }
      }}
    >
      <span className={cn('absolute inset-0 rotate-3 bg-cream-200', BLOB)} aria-hidden />

      <span
        className={cn(
          'absolute inset-0 block overflow-hidden transition-transform duration-700 ease-[var(--ease-soft)]',
          BLOB,
        )}
        style={{ transform: `scale(${open ? ZOOM : 1})` }}
      >
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

      {/* Katman noktaları — panel yok; etiketler sağa ve sola dönüşümlü açılır */}
      {shot && (
        <span aria-hidden className="pointer-events-none absolute inset-0 z-30">
          {shot.layers.map((layer, j) => {
            const right = j % 2 === 0
            const dotX = at(right ? shot.edgeX - 3 : 100 - shot.edgeX + 3)
            const y = at(layer.y)
            const move = 'top .7s var(--ease-soft), left .7s var(--ease-soft), right .7s var(--ease-soft)'
            return (
              <span key={j}>
                <span
                  className="absolute h-px bg-cocoa-600/60"
                  style={{
                    top: `${y}%`,
                    left: `${right ? dotX : dotX - LINE}%`,
                    width: `${LINE}%`,
                    transformOrigin: right ? '0% 50%' : '100% 50%',
                    transform: `scaleX(${open ? 1 : 0})`,
                    transition: `transform .3s ease ${open ? 0.05 : 0}s, ${move}`,
                  }}
                />
                <span
                  className="absolute size-3 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(64,37,26,.28),0_2px_6px_rgba(64,37,26,.25)]"
                  style={{
                    top: `${y}%`,
                    left: `${dotX}%`,
                    background: layer.color,
                    transform: `translate(-50%,-50%) scale(${dotsIn ? 1 : 0})`,
                    transition: `transform .45s ${SPRING} ${0.9 + j * 0.08}s, ${move}, background-color .5s ease`,
                  }}
                />
                <span
                  className={cn(
                    'absolute max-w-[27%] rounded-xl bg-surface/95 px-3 py-1.5 text-[clamp(10.5px,2.6vw,12.5px)] font-semibold leading-tight text-cocoa-800 shadow-card',
                    right ? 'text-left' : 'text-right',
                  )}
                  style={{
                    top: `${y}%`,
                    ...(right ? { left: `${dotX + LINE}%` } : { right: `${100 - (dotX - LINE)}%` }),
                    opacity: open ? 1 : 0,
                    transform: `translate(${open ? 0 : right ? -6 : 6}px,-50%)`,
                    transition: `opacity .35s ease ${open ? 0.12 + j * 0.06 : 0}s, transform .45s var(--ease-soft) ${open ? 0.12 + j * 0.06 : 0}s, ${move}`,
                  }}
                >
                  {layer.name}
                </span>
              </span>
            )
          })}
        </span>
      )}
    </Link>
  )
}
