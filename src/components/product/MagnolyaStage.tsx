import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Price } from '@/components/ui/Price'
import { ServingToggle } from '@/components/ui/ServingToggle'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { assetUrl } from '@/lib/assets'
import { buildCartItem, defaultSelections } from '@/lib/cart'
import { flyToCart } from '@/lib/flyToCart'
import { isStageEntryOnTop } from '@/lib/stageHistory'
import type { Product, ServingShot } from '@/types'

const EASE = 'cubic-bezier(.22,1,.36,1)'
const SPRING = 'cubic-bezier(.34,1.3,.64,1)'
const SPLIT = [-10, -3.5, 3.5, 10]

/** [zemin, blob] — blush-50/100, cocoa-50/100, cream-100/300/200 */
const TONES: Record<string, [string, string]> = {
  'cilekli-magnolya': ['#fdf3f1', '#fbe5e1'],
  'cilekli-muzlu-cikolatali-magnolya': ['#fdf3f1', '#fbe5e1'],
  'cilekli-red-velvet-magnolya': ['#fdf3f1', '#fbe5e1'],
  'cikolatali-magnolya': ['#faf4f0', '#f0e3d9'],
  'lotuslu-magnolya': ['#faf4f0', '#f0e3d9'],
  'oreolu-magnolya': ['#faf5ec', '#ece0cd'],
}
const DEFAULT_TONE: [string, string] = ['#faf5ec', '#f4ecdf']

/** Bir sonraki kare; rAF gizli sekmede çalışmadığı için zamanlayıcı yedekli */
function nextFrame(fn: () => void) {
  let ran = false
  const run = () => {
    if (ran) return
    ran = true
    fn()
  }
  requestAnimationFrame(run)
  window.setTimeout(run, 50)
}

function bounds(shot: ServingShot) {
  const ys = shot.layers.map((layer) => layer.y)
  return [0, (ys[0] + ys[1]) / 2, (ys[1] + ys[2]) / 2, (ys[2] + ys[3]) / 2, 100]
}

/** Görseli katman sınırlarından dört dilime böler (dördü de aynı dosya) */
function StageSlices({ shot, split, alt }: { shot: ServingShot; split: boolean; alt?: string }) {
  const b = bounds(shot)
  return (
    <>
      {[0, 1, 2, 3].map((j) => (
        <div
          key={j}
          role={j === 0 && alt ? 'img' : undefined}
          aria-label={j === 0 ? alt : undefined}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${assetUrl(shot.image)})`,
            clipPath: `inset(${Math.max(0, b[j] - 0.15)}% 0 ${Math.max(0, 100 - b[j + 1] - 0.15)}% 0)`,
            transform: `translateY(${split ? SPLIT[j] : 0}%)`,
            transition: `transform .9s ${SPRING} ${split ? j * 0.05 : 0}s`,
          }}
        />
      ))}
    </>
  )
}

/** Katman etiketleri — sağ ve sol tarafa dönüşümlü */
function Callouts({ shot, split }: { shot: ServingShot; split: boolean }) {
  const offsets = split ? SPLIT : [0, 0, 0, 0]
  // Görsel sahnede %7 içeride ve %86 ölçekte duruyor
  const ox = (x: number) => 7 + x * 0.86

  return (
    <>
      {shot.layers.map((layer, j) => {
        const right = j % 2 === 0
        const y = 7 + (layer.y + offsets[j]) * 0.86
        const x = right ? ox(shot.edgeX - 3) : ox(100 - shot.edgeX + 3)
        const d = (base: number) => (split ? `${base + j * 0.08}s` : '0s')
        return (
          <div key={layer.name + j} aria-hidden={!split} className="pointer-events-none">
            <span
              className="absolute h-px bg-cocoa-600/55"
              style={{
                top: `${y}%`,
                left: `${right ? x : 22}%`,
                width: `${right ? 78 - x : x - 22}%`,
                transformOrigin: right ? '0% 50%' : '100% 50%',
                transform: `scaleX(${split ? 1 : 0})`,
                transition: `transform .45s ease ${d(0.32)}, top .9s ${SPRING}`,
              }}
            />
            <span
              className="absolute size-[max(10px,2.4cqw)] rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(64,37,26,.25),0_2px_8px_rgba(64,37,26,.25)]"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                background: layer.color,
                transform: `translate(-50%,-50%) scale(${split ? 1 : 0})`,
                transition: `transform .45s cubic-bezier(.34,1.56,.64,1) ${d(0.25)}, top .9s ${SPRING}`,
              }}
            />
            <span
              className="absolute flex w-max max-w-[22%] flex-col gap-0.5 rounded-[14px] bg-surface/95 px-[.9em] py-[.55em] text-[clamp(11px,2.5cqw,15px)] leading-tight shadow-card"
              style={{
                top: `${y}%`,
                left: right ? '78%' : 'auto',
                right: right ? 'auto' : '78%',
                textAlign: right ? 'left' : 'right',
                opacity: split ? 1 : 0,
                transform: `translate(${split ? 0 : right ? -10 : 10}px,-50%)`,
                transition: `opacity .35s ease ${d(0.4)}, transform .55s ${EASE} ${d(0.4)}, top .9s ${SPRING}`,
              }}
            >
              <span className="text-[.72em] font-bold tracking-[0.12em] text-olive-600">0{j + 1}</span>
              <span className="text-balance font-semibold text-cocoa-800">{layer.name}</span>
            </span>
          </div>
        )
      })}
    </>
  )
}

/** Merkezden saçılan kırıntılar — her yeniden ayrışmada `key` değişip yeniden oynar */
function Crumbs({ colors }: { colors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const big = i % 5 === 0
        const size = big ? 2.6 : 1 + ((i * 37) % 10) / 10
        return { size, h: big ? size * 1.25 : size, color: colors[i % colors.length] }
      }),
    [colors],
  )

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const w = host.getBoundingClientRect().width
    host.querySelectorAll<HTMLElement>('[data-crumb]').forEach((el, i, all) => {
      const angle = (i / all.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist = w * (0.3 + Math.random() * 0.2)
      const dx = Math.cos(angle) * dist
      const dy = Math.sin(angle) * dist * 0.82 - w * 0.04
      el.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 0 },
          {
            transform: `translate(calc(-50% + ${dx * 0.72}px), calc(-50% + ${dy * 0.72}px)) scale(1) rotate(90deg)`,
            opacity: 1,
            offset: 0.42,
          },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + w * 0.07}px)) scale(.55) rotate(160deg)`,
            opacity: 0,
          },
        ],
        { duration: 1300 + Math.random() * 500, delay: i * 14, easing: EASE },
      )
    })
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {bits.map((bit, i) => (
        <span
          key={i}
          data-crumb
          className="absolute left-1/2 top-[46%] rounded-full opacity-0 shadow-[0_1px_2px_rgba(64,37,26,.15)]"
          style={{ width: `${bit.size}cqw`, height: `${bit.h}cqw`, background: bit.color }}
        />
      ))}
    </div>
  )
}

/**
 * Magnolya sahnesi: kart görseli tam ekrana büyür (FLIP), katmanlar ayrışır,
 * kırıntılar saçılır. ← / → ile ürünler arasında gezilir; kapanınca görsel o
 * anki ürünün kartına geri küçülür.
 */
export function MagnolyaStage({
  products,
  activeId,
  fromRect,
  returnTo,
  jar,
  onJarChange,
  onNavigate,
  onClose,
}: {
  products: Product[]
  activeId: string
  /** Tıklanan kart görselinin konumu — FLIP başlangıcı */
  fromRect: DOMRect | null
  /** Sahneyi kart dışından açan öğe: o ürün hâlâ gösteriliyorsa kapanışta oraya döner */
  returnTo?: { id: string; el: Element }
  jar: boolean
  onJarChange: (value: boolean) => void
  onNavigate: (id: string) => void
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { notify } = useToast()
  const stage = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const busy = useRef(false)
  // Sahne açılmadan önce odakta olan öğe; kapanınca oraya dönülür
  const returnFocus = useRef<Element | null>(typeof document === 'undefined' ? null : document.activeElement)
  const [shown, setShown] = useState(false) // zemin + sahne görünür
  const [open, setOpen] = useState(false) // içerik açık
  const [joined, setJoined] = useState(false) // sunum değişirken katmanlar birleşik
  const [wiping, setWiping] = useState(false)
  const [burst, setBurst] = useState(0)

  // Kapanış temizliği ilk render'ın değerlerini görür; o anki ürünü ref'ten okur
  const currentId = useRef(activeId)
  currentId.current = activeId

  const index = products.findIndex((product) => product.id === activeId)
  const p = products[index]
  const serving = p?.serving
  const shot = serving ? (jar ? serving.jar : serving.cup) : null
  const split = open && !joined
  const tone = (p && TONES[p.slug]) ?? DEFAULT_TONE

  // Fiyat ve sepet satırı mevcut "Sunum" seçeneğinden gelir: kavanoz farkı
  // tek yerde (data/options.ts) tanımlı, gizli fiyat ayarı da Price'ta işliyor
  const selections = p ? { ...defaultSelections(p), sunum: [jar ? 'kavanoz' : 'cup'] } : {}
  const unitPrice = p ? buildCartItem(p, { selections }).unitPrice : 0

  const later = (fn: () => void, ms: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(fn, reduce ? 0 : ms)
  }
  const reveal = () => {
    setOpen(true)
    setBurst((b) => b + 1)
  }

  /* Açılış: kart görselinden büyür */
  useLayoutEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const st = stage.current
    if (st && fromRect && !reduce) {
      const to = st.getBoundingClientRect()
      const s = fromRect.width / to.width
      const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2)
      const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2)
      st.animate([{ transform: `translate(${dx}px,${dy}px) scale(${s})` }, { transform: 'none' }], {
        duration: 780,
        easing: EASE,
      })
      img.current?.animate([{ borderRadius: '6%', inset: '0%' }, { borderRadius: '50%', inset: '7%' }], {
        duration: 780,
        easing: EASE,
      })
    }
    setShown(true)
    closeButton.current?.focus({ preventScroll: true })
    later(reveal, 480)

    const opener = returnFocus.current
    return () => {
      document.documentElement.style.overflow = ''
      window.clearTimeout(timer.current)
      // Görsel gibi odak da o anki ürünün kartına dönsün (← / → sonrası dahil);
      // kart yoksa sahneyi açan öğeye
      const card = document.querySelector<HTMLElement>(`[data-magnolya-card="${currentId.current}"] h3 button`)
      const target = card ?? (opener instanceof HTMLElement ? opener : null)
      target?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (busy.current) return
    busy.current = true
    setOpen(false)
    later(() => {
      const st = stage.current
      setShown(false)
      if (!st || reduce || !p) {
        onClose()
        return
      }
      // Açan öğeye dön (← / → ile başka ürüne geçildiyse o ürünün kartına)
      const card =
        returnTo && returnTo.id === p.id && returnTo.el.isConnected
          ? returnTo.el
          : document.querySelector(`[data-magnolya-card="${p.id}"] [data-imgbox]`)
      const t = card?.getBoundingClientRect()
      const f = st.getBoundingClientRect()
      let animation: Animation
      if (t && t.width && t.bottom > 0 && t.top < window.innerHeight) {
        const s = t.width / f.width
        const dx = t.left + t.width / 2 - (f.left + f.width / 2)
        const dy = t.top + t.height / 2 - (f.top + f.height / 2)
        const ease = 'cubic-bezier(.65,0,.25,1)'
        animation = st.animate([{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${s})` }], {
          duration: 620,
          easing: ease,
          fill: 'forwards',
        })
        img.current?.animate([{ borderRadius: '50%', inset: '7%' }, { borderRadius: '6%', inset: '0%' }], {
          duration: 620,
          easing: ease,
          fill: 'forwards',
        })
      } else {
        // Kart ekranda değilse yerinde solarak kapanır
        animation = st.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.92)' }], {
          duration: 380,
          easing: 'ease-in',
          fill: 'forwards',
        })
      }
      let done = false
      const finish = () => {
        if (done) return
        done = true
        onClose()
      }
      animation.onfinish = finish
      // Gizli sekmede onfinish çalışmaz; sayfa kaydırması kilitli kalmasın
      window.setTimeout(finish, 1000)
    }, 300)
  }

  const step = (direction: 1 | -1) => {
    if (busy.current) return
    busy.current = true
    setOpen(false)
    const st = stage.current
    st?.animate(
      [
        { opacity: 1, transform: 'none' },
        { opacity: 0, transform: `translateX(${-direction * 48}px) scale(.95)` },
      ],
      { duration: 300, easing: 'ease-in', fill: 'forwards' },
    )
    later(() => {
      onNavigate(products[(index + direction + products.length) % products.length].id)
      // Yeni ürün çizildikten sonra diğer yandan girsin
      nextFrame(() => {
        st?.getAnimations().forEach((animation) => animation.cancel())
        st?.animate(
          [
            { opacity: 0, transform: `translateX(${direction * 48}px) scale(.95)` },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 480, easing: EASE },
        )
        later(() => {
          reveal()
          busy.current = false
        }, 240)
      })
    }, 320)
  }

  /* Cup ↔ Kavanoz: birleş → dol → yeniden ayrış */
  const switchServing = (value: boolean) => {
    if (value === jar || busy.current) return
    busy.current = true
    setJoined(true)
    later(() => {
      onJarChange(value)
      setWiping(true)
      img.current?.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(.95)', offset: 0.4 },
          { transform: 'scale(1.015)', offset: 0.8 },
          { transform: 'scale(1)' },
        ],
        { duration: 900, easing: 'cubic-bezier(.45,0,.25,1)' },
      )
      later(() => {
        setWiping(false)
        setJoined(false)
        setBurst((b) => b + 1)
        busy.current = false
      }, 860)
    }, 420)
  }

  const add = () => {
    if (!p || !shot) return
    flyToCart(img.current, assetUrl(shot.image))
    addItem(buildCartItem(p, { selections }))
    notify(`${p.name} sepete eklendi`)
  }

  /* Klavye — en güncel close/step'e erişsin diye ref üzerinden */
  const api = useRef({ close, step })
  useEffect(() => {
    api.current = { close, step }
  })
  // Geri tuşu (telefonda geri hareketi) sahneyi kapatır
  useEffect(() => {
    const onPop = () => {
      if (!isStageEntryOnTop()) api.current.close()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') api.current.close()
      else if (event.key === 'ArrowRight') api.current.step(1)
      else if (event.key === 'ArrowLeft') api.current.step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!p || !serving || !shot) return null

  const textIn = (delay: number) => ({
    opacity: open ? 1 : 0,
    transform: open ? 'none' : 'translateY(14px)',
    transition: `opacity .5s ease ${open ? delay : 0}s, transform .6s ${EASE} ${open ? delay : 0}s`,
  })

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain"
    >
      <div
        onClick={close}
        className="fixed inset-0"
        style={{
          background: tone[0],
          opacity: shown ? 1 : 0,
          transition: `opacity .45s ease ${shown ? 0 : 0.14}s, background-color .6s ease`,
        }}
      />

      <div className="pointer-events-none relative mx-auto flex min-h-full max-w-[84rem] flex-wrap items-center justify-center gap-[clamp(1.5rem,4vw,4.5rem)] px-[clamp(1.25rem,4vw,4rem)] pb-[clamp(2.5rem,6vh,4rem)] pt-[clamp(4.5rem,9vh,6rem)]">
        {/* Görsel */}
        <div className="pointer-events-auto relative w-full max-w-[min(74vh,620px)] flex-[1_1_340px]">
          <div
            ref={stage}
            className="relative aspect-square w-full [container-type:inline-size]"
            style={{ opacity: shown ? 1 : 0 }}
          >
            <div
              className="absolute inset-[3%] rounded-[42%_58%_52%_48%/46%_40%_60%_54%]"
              style={{
                background: tone[1],
                opacity: open ? 1 : 0,
                transform: `scale(${open ? 1 : 0.55}) rotate(${open ? 0 : -18}deg)`,
                transition: `transform 1s ${SPRING} .05s, opacity .5s ease, background-color .6s ease`,
              }}
            />
            <div ref={img} className="absolute inset-[7%] overflow-hidden rounded-full shadow-lift">
              {/* Kavanoz dolumu bitince alttaki cup gizlenir; yoksa katmanlar
                  ayrışınca aralardaki boşluklardan cup dilimleri görünüyordu */}
              <div
                className="absolute inset-0"
                style={{
                  visibility: jar ? 'hidden' : 'visible',
                  transition: `visibility 0s linear ${jar ? 0.8 : 0}s`,
                }}
              >
                <StageSlices shot={serving.cup} split={split} alt={p.name} />
              </div>
              <div
                className="absolute inset-0 transition-[clip-path] duration-[800ms] ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ clipPath: jar ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)' }}
              >
                <StageSlices shot={serving.jar} split={split} />
              </div>
              {/* Dolum çizgisi — krema yüzeyi */}
              <span
                className="pointer-events-none absolute inset-x-0 -mt-[3px] h-1.5 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.95)_25%,rgba(255,255,255,.95)_75%,transparent)] blur-[1.5px] transition-[top,opacity] duration-[800ms] ease-[cubic-bezier(.65,0,.35,1)]"
                style={{ top: jar ? '0%' : '100%', opacity: wiping ? 1 : 0 }}
              />
            </div>
            <Callouts shot={shot} split={split} />
            {burst > 0 && !reduce && (
              <Crumbs key={burst} colors={[...shot.layers.map((layer) => layer.color), '#e28f84', '#ddcbb1', '#c8a086']} />
            )}
          </div>
        </div>

        {/* Metin */}
        <div className="pointer-events-auto max-w-[30rem] flex-[1_1_320px]">
          <p
            className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-olive-600"
            style={textIn(0)}
          >
            Magnolya <span className="h-px w-6 bg-olive-300" />
            <span className="tabular-nums text-muted">
              {String(index + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
            </span>
          </p>
          <h2 className="mt-3.5 flex flex-wrap gap-x-[.26em] text-[clamp(2.25rem,1.5rem+3vw,3.75rem)] leading-[1.04] tracking-[-0.02em]">
            {p.name.split(' ').map((word, k) => (
              <span key={word + k} className="-mb-[.1em] inline-block overflow-hidden pb-[.1em]">
                <span
                  className="inline-block"
                  style={{
                    transform: open ? 'translateY(0)' : 'translateY(110%)',
                    transition: `transform .8s ${EASE} ${open ? 0.04 + k * 0.07 : 0}s`,
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted" style={textIn(0.18)}>
            {p.description}
          </p>
          {/* Kartlar sahneyi açtığı için ürün sayfasına giden yol burada:
              sipariş notu, adet ve benzer ürünler orada */}
          <button
            type="button"
            onClick={() => {
              // Sahnenin geçmiş kaydı ürün sayfasıyla değişir: ürün sayfasından
              // geri gelince sahne değil liste görünür. Sıra önemli — önce
              // gezinme, sonra kapanış (kapanış kayıt üstteyse geri alırdı)
              navigate(`/menu/${p.slug}`, { replace: isStageEntryOnTop() })
              onClose()
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa-700 underline-offset-4 hover:underline"
            style={textIn(0.24)}
          >
            Ürün detayları <ArrowRight className="size-4" />
          </button>

          <ol className="mt-6 border-t border-line">
            {shot.layers.map((layer, j) => (
              <li
                key={layer.name + j}
                className="flex items-center gap-3.5 border-b border-line py-2.5"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateX(-10px)',
                  transition: `opacity .4s ease ${open ? 0.32 + j * 0.07 : 0}s, transform .55s ${EASE} ${open ? 0.32 + j * 0.07 : 0}s`,
                }}
              >
                <span className="w-[22px] text-xs font-bold tabular-nums text-muted">0{j + 1}</span>
                <span
                  className="size-3 shrink-0 rounded-full shadow-[0_0_0_1px_rgba(64,37,26,.2)]"
                  style={{ background: layer.color }}
                />
                <span className="text-[15px] font-semibold text-cocoa-800">{layer.name}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4" style={textIn(0.55)}>
            <ServingToggle jar={jar} onChange={switchServing} />
            <Price value={unitPrice} className="text-[1.75rem]" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3" style={textIn(0.62)}>
            <button
              type="button"
              onClick={add}
              className="inline-flex h-13 flex-[1_1_200px] items-center justify-center gap-2 rounded-full bg-cocoa-600 px-7 font-semibold text-cream-50 shadow-soft transition hover:bg-cocoa-700 active:scale-[0.97]"
            >
              <Plus className="size-[18px]" strokeWidth={2.4} /> Sepete Ekle
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Önceki magnolya"
                className="grid size-13 place-items-center rounded-full border border-line bg-surface text-cocoa-700 transition hover:border-cocoa-300 hover:bg-cream-100"
              >
                <ArrowLeft className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Sonraki magnolya"
                className="grid size-13 place-items-center rounded-full border border-line bg-surface text-cocoa-700 transition hover:border-cocoa-300 hover:bg-cream-100"
              >
                <ArrowRight className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={closeButton}
        type="button"
        onClick={close}
        aria-label="Kapat"
        className="fixed right-4 top-[max(16px,env(safe-area-inset-top))] z-[2] grid size-11 place-items-center rounded-full bg-surface text-cocoa-700 shadow-card transition-[opacity,transform] active:scale-95"
        style={{ opacity: shown ? 1 : 0 }}
      >
        <X className="size-5" />
      </button>
    </div>,
    document.body,
  )
}
