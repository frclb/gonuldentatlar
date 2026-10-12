import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

type Filter = { id: string; label: string }
type Box = { x: number; y: number; w: number; h: number; sy: number }

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Filtre sekmeleri. Aktif sekmenin zemini her butonda ayrı yanıp sönmek
 * yerine tek bir "hap" olarak sekmeler arasında kayar: aynı satırda önce iki
 * sekmeyi kapsayacak kadar uzar, sonra yaylanarak oturur; satır değişirken
 * hafifçe basılıp zıplar.
 *
 * Katman sırası önemli: butonlar position almıyor; hap `absolute z-[1]`,
 * yazılar `relative z-[2]`. Böylece hap butonların beyaz zemininin üstünde,
 * yazıların altında kayar. Butonlara relative / transform / z-index verilirse
 * hap arkalarında kalır (tek istisna basılıyken uygulanan active:scale-95).
 */
export function FilterChips({
  filters,
  active,
  onSelect,
  className,
}: {
  filters: Filter[]
  active: string
  onSelect: (id: string) => void
  className?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<Box | null>(null)
  const prev = useRef<Box | null>(null)
  const settle = useRef<number | undefined>(undefined)
  const activeRef = useRef(active)
  activeRef.current = active

  const measure = (id: string): Box | null => {
    const el = wrap.current?.querySelector<HTMLElement>(`[data-filter="${id}"]`)
    return el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, sy: 1 } : null
  }

  useLayoutEffect(() => {
    const to = measure(active)
    if (!to) return
    const from = prev.current
    window.clearTimeout(settle.current)
    const reduce = prefersReduced()

    if (!from || reduce) {
      setBox(to)
    } else if (Math.abs(from.y - to.y) < 4) {
      // Aynı satır: önce iki sekmeyi kapsayacak kadar uza, sonra otur
      const x = Math.min(from.x, to.x)
      const right = Math.max(from.x + from.w, to.x + to.w)
      setBox({ ...to, x, w: right - x, sy: 0.86 })
      settle.current = window.setTimeout(() => setBox(to), 170)
    } else {
      // Satır değişimi: basılarak zıpla
      setBox({ ...to, sy: 0.82 })
      settle.current = window.setTimeout(() => setBox(to), 200)
    }
    prev.current = to

    // Mobilde yatay kaydırmada aktif sekme görünür alana gelsin
    const el = wrap.current
    if (el && el.scrollWidth > el.clientWidth + 2) {
      el.scrollTo({ left: Math.max(0, to.x - 24), behavior: reduce ? 'auto' : 'smooth' })
    }
  }, [active, filters.length])

  // Pencere boyutu değişince ve yazı tipi yüklenince yeniden ölç. Bir kez
  // kurulur: gözlemci kurulduğu an tetiklendiği için her sekme değişiminde
  // yeniden kurulsaydı hapı doğrudan hedefe koyar, uzama hareketini yutardı
  useLayoutEffect(() => {
    const sync = () => {
      const to = measure(activeRef.current)
      if (!to) return
      window.clearTimeout(settle.current)
      prev.current = to
      setBox(to)
    }
    const observer = new ResizeObserver(sync)
    if (wrap.current) observer.observe(wrap.current)
    document.fonts?.ready.then(sync)
    return () => {
      observer.disconnect()
      window.clearTimeout(settle.current)
    }
  }, [])

  return (
    <div ref={wrap} role="group" aria-label="Tat filtresi" className={cn('relative', className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[1] rounded-full bg-cocoa-600 shadow-soft"
        style={{
          width: box?.w ?? 0,
          height: box?.h ?? 0,
          opacity: box ? 1 : 0,
          transform: `translate(${box?.x ?? 0}px, ${box?.y ?? 0}px) scaleY(${box?.sy ?? 1})`,
          transition:
            'transform .5s cubic-bezier(.34,1.25,.64,1), width .5s cubic-bezier(.34,1.25,.64,1), height .3s ease, opacity .2s ease',
        }}
      />
      {filters.map((filter) => {
        const on = filter.id === active
        return (
          <button
            key={filter.id}
            type="button"
            data-filter={filter.id}
            aria-pressed={on}
            onClick={() => onSelect(filter.id)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-full border bg-surface px-4 py-2 text-sm font-semibold',
              'transition-[color,border-color,background-color,transform] duration-300 active:scale-95',
              // Yazı rengi hap geldikten kısa süre sonra döner
              on
                ? 'border-cocoa-600 text-cream-50 delay-[120ms]'
                : 'border-line text-cocoa-700 hover:border-cocoa-300 hover:bg-cream-100',
            )}
          >
            <span className="relative z-[2]">{filter.label}</span>
          </button>
        )
      })}
    </div>
  )
}
