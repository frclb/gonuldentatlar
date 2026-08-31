import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '@/context/CatalogContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'

/** Görselin geçiş süresi. 3 sn telaşlı, 5 sn durağan; 4 sn dengeli duruyor. */
const INTERVAL = 4000

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
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const hidden = useRef(false)

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
      setIndex((current) => (current + 1) % slides.length)
    }, INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, slides.length])

  if (slides.length === 0) return null
  const active = slides[index] ?? slides[0]

  return (
    <Link
      to={`/menu/${active.slug}`}
      aria-label={`${active.name} — ürünü incele`}
      className={cn(
        'relative mx-auto block aspect-square w-full max-w-[26rem] md:max-w-none',
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
            alt={i === index ? slide.alt : ''}
            aria-hidden={i !== index}
            width={1100}
            height={1100}
            decoding={i === 0 ? 'sync' : 'async'}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 size-full object-cover',
              'transition-[opacity,transform] duration-[900ms] ease-[var(--ease-soft)]',
              i === index ? 'scale-100 opacity-100' : 'scale-[1.05] opacity-0',
            )}
          />
        ))}
      </span>
    </Link>
  )
}
