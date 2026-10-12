import { useEffect, useRef, type RefObject } from 'react'

/**
 * Açılış animasyonu: boş kâse katman katman dolar, kalp belirir, işaret
 * navbar'daki logoya uçar.
 *
 * Geometri Logo.tsx'teki LogoMark ile birebir aynı (viewBox 0 0 96 96). İki SVG
 * aynı olduğu için uçuş sonunda overlay kalktığında geçiş dikişsiz görünüyor —
 * farklı bir çizim kullanılsaydı son karede sıçrama olurdu.
 */

/** LogoMark ile aynı path'ler */
const CUP = 'M21 38H75l-6.6 33.5Q66.9 81 57.4 81H38.6Q29.1 81 27.6 71.5Z'
const DOME = 'M25.5 30a22.5 20 0 0 1 45 0Z'
const HEART =
  'M48 28.6c-5.1-3.8-11.6-7.2-11.6-12.2a5.9 5.9 0 0 1 11.6-2.8 5.9 5.9 0 0 1 11.6 2.8c0 5-6.5 8.4-11.6 12.2Z'

/** Çilek dilimlerinin yatay konumu (viewBox 96) */
const SLICE_X = [33, 43, 53, 63]

const KEY = 'gt-intro-seen'

/** Açılış bu ziyarette oynasın mı? */
export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Gizli sekmede animasyon kareleri çalışmaz; overlay ekranda asılı kalırdı
  if (document.hidden) return false
  try {
    return !sessionStorage.getItem(KEY)
  } catch {
    return true
  }
}

export function IntroSplash({
  targetRef,
  onFlyStart,
  onDone,
  speed = 1,
}: {
  /** Navbar'daki logo işareti — uçuşun hedefi */
  targetRef: RefObject<HTMLElement | null>
  /** Hero animasyonlarını başlatmak için */
  onFlyStart?: () => void
  onDone: () => void
  speed?: number
}) {
  const overlay = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const cupOutline = useRef<SVGPathElement>(null)
  const cupSolid = useRef<SVGPathElement>(null)
  const rim = useRef<SVGRectElement>(null)
  const dome = useRef<SVGPathElement>(null)
  const heart = useRef<SVGPathElement>(null)
  const fruit = useRef<SVGGElement>(null)
  const layers = useRef<(SVGGElement | null)[]>([])
  const slices = useRef<(SVGGElement | null)[]>([])
  const anims = useRef<Animation[]>([])
  const flying = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  const k = 1 / speed

  const fly = () => {
    if (flying.current || !mark.current) return
    flying.current = true
    window.clearTimeout(timer.current)
    anims.current.forEach((animation) => animation.finish())

    const from = mark.current.getBoundingClientRect()
    // Hedef her seferinde ölçülür: logo mobilde 32, tablette 36, masaüstünde 40px
    const to = targetRef.current?.getBoundingClientRect() ?? new DOMRect(20, 14, 36, 36)
    const dx = to.left + to.width / 2 - (from.left + from.width / 2)
    const dy = to.top + to.height / 2 - (from.top + from.height / 2)

    if (overlay.current) overlay.current.style.pointerEvents = 'none'
    ;[word, skip].forEach((ref) =>
      ref.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }),
    )
    bg.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 650 * k,
      delay: 140 * k,
      fill: 'forwards',
    })

    const animation = mark.current.animate(
      [
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${dx}px, ${dy}px) scale(${to.width / from.width})` },
      ],
      { duration: 820 * k, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' },
    )

    window.setTimeout(() => onFlyStart?.(), 240 * k)

    const finish = () => {
      document.documentElement.style.overflow = ''
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* gizli sekmede sessionStorage kapalı olabilir */
      }
      onDone()
    }
    animation.onfinish = finish
    // Sekme gizlenirse onfinish hiç çalışmaz; overlay asılı kalmasın
    timer.current = window.setTimeout(finish, 820 * k + 400)
  }

  useEffect(() => {
    // Temizlikte ref'e değil, aynı diziye tutun: efekt boyunca dolduruluyor,
    // referansı kopyalamak lint uyarısını da gideriyor
    const running = anims.current

    document.documentElement.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    const play = (
      el: Element | null | undefined,
      frames: Keyframe[],
      options: KeyframeAnimationOptions & { duration: number; delay?: number },
    ) => {
      if (!el) return
      anims.current.push(
        el.animate(frames, {
          fill: 'both',
          easing: 'cubic-bezier(.22,1,.36,1)',
          ...options,
          duration: options.duration * k,
          delay: (options.delay ?? 0) * k,
        }),
      )
    }

    // Katmanlar yukarıdan düşüp hafifçe sekerek oturur
    const drop: Keyframe[] = [
      { transform: 'translateY(-30px)', opacity: 0 },
      { transform: 'translateY(1.4px)', opacity: 1, offset: 0.72 },
      { transform: 'translateY(0)', opacity: 1 },
    ]
    const at = [250, 420, 590, 760]
    const MERGE = 1580

    play(cupOutline.current, [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1)' }], {
      duration: 450,
    })
    play(rim.current, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 420,
      delay: 120,
    })
    layers.current.forEach((el, i) =>
      play(el, drop, { duration: 560, delay: at[i], easing: 'cubic-bezier(.33,0,.2,1)' }),
    )
    play(fruit.current, drop, { duration: 560, delay: at[2], easing: 'cubic-bezier(.33,0,.2,1)' })

    // Birleşme: çilek dilimleri merkeze kayıp kaybolur, yerini kalp alır
    slices.current.forEach((el, j) =>
      play(
        el,
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${48 - SLICE_X[j]}px,0) scale(.35)`, opacity: 0 },
        ],
        { duration: 440, delay: MERGE, easing: 'cubic-bezier(.55,0,.35,1)', fill: 'forwards' },
      ),
    )
    play(cupSolid.current, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 380,
      delay: MERGE + 40,
      fill: 'forwards',
    })
    play(cupOutline.current, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 260,
      delay: MERGE + 200,
      fill: 'forwards',
    })
    play(
      dome.current,
      [
        { transform: 'scale(.3)', opacity: 0 },
        { transform: 'scale(1.05)', opacity: 1, offset: 0.65 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: 620, delay: MERGE + 120 },
    )
    play(
      heart.current,
      [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.22)', opacity: 1, offset: 0.6 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: 540, delay: MERGE + 300, easing: 'cubic-bezier(.3,.7,.4,1)' },
    )
    play(
      word.current,
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 480, delay: MERGE + 380 },
    )

    timer.current = window.setTimeout(fly, (MERGE + 1100) * k)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fly()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer.current)
      running.forEach((animation) => animation.cancel())
      document.documentElement.style.overflow = ''
    }
    // Yalnızca ilk mount'ta kurulur; bağımlılıklar kasıtlı olarak boş
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fillBox = { transformBox: 'fill-box', transformOrigin: 'center' } as const
  const clipId = 'gt-intro-cup'

  /** Kâsenin içine düşen krema / bisküvi şeridi */
  const slab = (i: number, y: number, h: number, className: string) => (
    <g
      ref={(el) => {
        layers.current[i] = el
      }}
      style={{ opacity: 0 }}
    >
      <rect x={16} y={y} width={66} height={h} className={className} />
    </g>
  )

  return (
    <div
      ref={overlay}
      onClick={fly}
      role="presentation"
      className="fixed inset-0 z-[100] grid cursor-pointer place-items-center"
    >
      <div ref={bg} className="absolute inset-0 bg-background" />

      <div className="relative flex flex-col items-center gap-[clamp(18px,3vh,28px)]">
        <div ref={mark} className="aspect-square w-[min(52vmin,260px)] will-change-transform">
          <svg viewBox="0 0 96 96" className="block size-full overflow-visible" aria-hidden focusable="false">
            <defs>
              <clipPath id={clipId}>
                <path d={CUP} />
              </clipPath>
            </defs>

            {/* Kubbe kapak — birleşmeden sonra belirir */}
            <path ref={dome} d={DOME} className="fill-cocoa-600/25" style={{ ...fillBox, opacity: 0 }} />

            {/* Boş cam kâse */}
            <path
              ref={cupOutline}
              d={CUP}
              fill="rgba(255,255,255,.55)"
              className="stroke-cream-400"
              strokeWidth={0.9}
              style={{ ...fillBox, opacity: 0 }}
            />

            <g clipPath={`url(#${clipId})`}>
              {slab(0, 69, 10, 'fill-cream-400')}
              {slab(1, 60, 9, 'fill-cream-100')}
              {slab(2, 45, 15, 'fill-cream-100')}
              {slab(3, 38, 7, 'fill-cream-400')}
            </g>

            {/* Çilek dilimleri — kremanın içinde */}
            <g clipPath={`url(#${clipId})`}>
              <g ref={fruit} style={{ opacity: 0 }}>
                {SLICE_X.map((cx, j) => (
                  <g
                    key={cx}
                    ref={(el) => {
                      slices.current[j] = el
                    }}
                    style={fillBox}
                  >
                    <ellipse cx={cx} cy={55} rx={3.6} ry={4.6} className="fill-blush-400" />
                    <ellipse cx={cx} cy={55.4} rx={1.8} ry={2.7} className="fill-blush-200" />
                  </g>
                ))}
              </g>
            </g>

            {/* Dolu gövde — logodaki hâli */}
            <g ref={cupSolid} style={{ opacity: 0 }}>
              <path d={CUP} className="fill-cocoa-600" />
              <rect ref={rim} x={17.5} y={29} width={61} height={9.5} rx={4.75} className="fill-cocoa-600" />
              <g clipPath={`url(#${clipId})`} className="fill-cream-100">
                <rect x={16} y={45} width={66} height={9} />
                <rect x={16} y={62} width={66} height={7} />
              </g>
            </g>

            {/* Kalp — çileklerin buluştuğu yerde patlar */}
            <path ref={heart} d={HEART} className="fill-blush-400" style={{ ...fillBox, opacity: 0 }} />
          </svg>
        </div>

        <div ref={word} className="text-center opacity-0">
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4.2vw,2.4rem)] font-semibold leading-none tracking-[-0.015em] text-cocoa-800">
            Gönülden Tatlar
          </p>
          <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-olive-600">
            Magnolya &amp; Cup
          </p>
        </div>
      </div>

      <button
        ref={skip}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          fly()
        }}
        className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 px-4 py-3 text-[13px] font-medium text-muted"
      >
        Geç
      </button>
    </div>
  )
}
