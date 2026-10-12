import { useEffect, useRef, type RefObject } from 'react'
import { DOME_FILL } from './colors'

/**
 * Açılış animasyonu: boş cam kâse katman katman dolar, kenar oturur, çilek
 * dilimleri birleşip kalbe dönüşür ve kalp tepeye süzülür, krema tepesi
 * kabarır, işaret navbar'daki logoya uçar.
 *
 * Geometri Logo.tsx'teki LogoMark ile birebir aynı (viewBox 0 0 64 64). Son
 * karede bantlar logodaki krema katmanlarını (33–38,6 ve 46–51) tam olarak
 * oluşturuyor; overlay kalktığında geçiş dikişsiz görünüyor.
 */

/** LogoMark ile aynı path'ler */
const BODY = 'M11 26h42l-3.6 29.2a6 6 0 0 1-5.95 5.3H20.55a6 6 0 0 1-5.95-5.3L11 26Z'
const DOME = 'M14 20A18 15.5 0 0 1 50 20Z'
const HEART =
  'M32 19.5c-4.76-3.5-8.96-6.44-8.96-10.36a4.76 4.76 0 0 1 8.96-2.38 4.76 4.76 0 0 1 8.96 2.38c0 3.92-4.2 6.86-8.96 10.36Z'

/** Çilek dilimlerinin yatay konumu */
const SLICE_X = [20.5, 28.2, 35.8, 43.5]

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
  const glass = useRef<SVGPathElement>(null)
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

    let done = false
    const finish = () => {
      if (done) return
      done = true
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
    // Temizlikte ref'e değil, aynı diziye tutun: efekt boyunca dolduruluyor
    const running = anims.current

    document.documentElement.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    // fill varsayılanı 'both': gecikme süresince ilk kare uygulanır. Bu yüzden
    // başta görünmemesi gereken her öğenin ilk karesinde opacity 0 olmalı;
    // krema tepesi istisna, ilk karede scaleY 0 olduğu için zaten görünmez
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
      { transform: 'translateY(1.2px)', opacity: 1, offset: 0.72 },
      { transform: 'translateY(0)', opacity: 1 },
    ]
    const at = [250, 400, 550, 700, 850]
    const MERGE = 1500
    const settle = 'cubic-bezier(.33,0,.2,1)'
    const bounce = 'cubic-bezier(.3,.7,.4,1)'

    play(glass.current, [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'scale(1)' }], {
      duration: 450,
    })
    layers.current.forEach((el, i) => play(el, drop, { duration: 520, delay: at[i], easing: settle }))
    // Çilekler üst krema bandıyla birlikte düşer
    play(fruit.current, drop, { duration: 520, delay: at[3], easing: settle })
    play(
      rim.current,
      [
        { transform: 'translateY(-12px)', opacity: 0 },
        { transform: 'translateY(.8px)', opacity: 1, offset: 0.7 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      { duration: 480, delay: 1050, easing: settle },
    )

    // Birleşme: cam kaybolur, dilimler merkeze kayar, kalp orada doğup tepeye süzülür
    play(glass.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: MERGE, fill: 'forwards' })
    slices.current.forEach((el, j) =>
      play(
        el,
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${32 - SLICE_X[j]}px,0) scale(.35)`, opacity: 0 },
        ],
        { duration: 440, delay: MERGE, easing: 'cubic-bezier(.55,0,.35,1)', fill: 'forwards' },
      ),
    )
    play(
      heart.current,
      [
        { transform: 'translateY(24px) scale(0)', opacity: 0 },
        { transform: 'translateY(24px) scale(1.1)', opacity: 1, offset: 0.3 },
        { transform: 'translateY(-1.2px) scale(1)', opacity: 1, offset: 0.78 },
        { transform: 'translateY(0) scale(1)', opacity: 1 },
      ],
      { duration: 840, delay: MERGE + 120, easing: bounce },
    )
    play(
      dome.current,
      [
        { transform: 'scale(.86, 0)', opacity: 1 },
        { transform: 'scale(1.02, 1.08)', opacity: 1, offset: 0.65 },
        { transform: 'scale(1, 1)', opacity: 1 },
      ],
      { duration: 560, delay: MERGE + 300, easing: bounce },
    )
    play(
      word.current,
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 480, delay: MERGE + 420 },
    )

    timer.current = window.setTimeout(fly, (MERGE + 1200) * k)

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

  /** Kâsenin içine düşen bant; gövdeye kırpıldığı için kenarları eğimli kalır */
  const slab = (i: number, y: number, h: number, className: string) => (
    <g
      ref={(el) => {
        layers.current[i] = el
      }}
      style={{ opacity: 0 }}
    >
      <rect x={8} y={y} width={48} height={h} className={className} />
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
          <svg viewBox="0 0 64 64" className="block size-full overflow-visible" aria-hidden focusable="false">
            <defs>
              <clipPath id={clipId}>
                <path d={BODY} />
              </clipPath>
            </defs>

            {/* Boş cam kâse */}
            <path
              ref={glass}
              d={BODY}
              fill="rgba(255,255,255,.6)"
              className="stroke-cream-400"
              strokeWidth={0.6}
              style={{ ...fillBox, opacity: 0 }}
            />

            {/* Alttan üste: kakao, krema, kakao, krema (çilekli), kakao.
                Sonradan düşen bant öncekinin üst kenarını örter; son karede
                kremler tam olarak logodaki iki katmanı oluşturur */}
            <g clipPath={`url(#${clipId})`}>
              {slab(0, 50.8, 11, 'fill-cocoa-600')}
              {slab(1, 45.6, 5.4, 'fill-cream-100')}
              {slab(2, 38.2, 7.8, 'fill-cocoa-600')}
              {slab(3, 32.6, 6, 'fill-cream-100')}
              {slab(4, 18, 15, 'fill-cocoa-600')}
            </g>

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
                    <ellipse cx={cx} cy={35.8} rx={2.7} ry={2.3} className="fill-blush-400" />
                    <ellipse cx={cx} cy={35.9} rx={1.3} ry={1.2} className="fill-blush-200" />
                  </g>
                ))}
              </g>
            </g>

            {/* Krema tepesi alttan kabarır */}
            <path
              ref={dome}
              d={DOME}
              fill={DOME_FILL}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', opacity: 0 }}
            />
            <rect ref={rim} x={7.5} y={19.5} width={49} height={7} rx={2.6} className="fill-cocoa-600" style={{ opacity: 0 }} />
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
