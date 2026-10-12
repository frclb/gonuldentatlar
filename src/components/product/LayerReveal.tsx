import { Layers, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'
import type { ServingShot } from '@/types'

const SCALE = 1.04
const SHIFT = -19 // % — fotoğraf sola kayar, sağda panele yer açar
const LABEL_X = 58.5 // %
const LINE_END = 57.5 // %
const SPLIT = [-6, -2, 2, 6] // % — dilimlerin dikey açılması
const GAP = 7 // % — iki etiket arasındaki en küçük boşluk

/**
 * Görseli katman sınırlarından dilimlere böler.
 *
 * Dört <img> de aynı dosya; tarayıcı tek istekte indirip önbellekten veriyor.
 * clip-path ile her biri yalnızca kendi şeridini gösteriyor, açılınca
 * dikeyde ayrışıyorlar — magnolya kaşıkla kesilmiş gibi.
 */
function Slices({
  shot,
  active,
  split,
  alt,
  eager,
}: {
  shot: ServingShot
  active: boolean
  split: boolean
  alt: string
  eager: boolean
}) {
  const ys = shot.layers.map((layer) => layer.y)
  const bounds = [0, (ys[0] + ys[1]) / 2, (ys[1] + ys[2]) / 2, (ys[2] + ys[3]) / 2, 100]

  return (
    <>
      {[0, 1, 2, 3].map((j) => (
        <img
          key={j}
          src={assetUrl(shot.image)}
          alt={j === 0 ? alt : ''}
          aria-hidden={j > 0}
          width={1100}
          height={1100}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-soft)]"
          style={{
            // 0.15 pay: dilimler arasında saç teli kalınlığında boşluk kalmasın
            clipPath: `inset(${Math.max(0, bounds[j] - 0.15)}% 0 ${Math.max(0, 100 - bounds[j + 1] - 0.15)}% 0)`,
            transform: active
              ? `translateX(${SHIFT}%) translateY(${split ? SPLIT[j] : 0}%) scale(${SCALE})`
              : 'translateX(0) translateY(0) scale(1)',
          }}
        />
      ))}
    </>
  )
}

export function LayerReveal({
  cup,
  jar,
  jarMode,
  active,
  split = true,
  canHover,
  onToggle,
  index = 0,
  alt,
  mountJar,
  children,
}: {
  cup: ServingShot
  jar: ServingShot
  jarMode: boolean
  active: boolean
  /** false ise fotoğraf bölünmez, yalnızca etiketler açılır */
  split?: boolean
  canHover: boolean
  onToggle: () => void
  /** Kavanoz katmanı DOM'a girsin mi. Kullanıcı sunumu değiştirene (ya da
      değiştirmeye niyetlenene) kadar false: aksi hâlde kimse Kavanoz'a
      basmasa bile kavanoz fotoğrafları indiriliyor. */
  mountJar: boolean
  /** Kavanoz dolum animasyonunda kartlar kademeli başlasın diye */
  index?: number
  alt: string
  /** Rozetler, favori butonu */
  children?: ReactNode
}) {
  const shot = jarMode ? jar : cup
  const offsets = split ? SPLIT : [0, 0, 0, 0]

  // Nokta, fotoğraf büyüyüp kaydıktan sonraki konumunda durmalı
  const dotYs = shot.layers.map((layer, j) => 50 + (layer.y - 50) * SCALE + offsets[j])

  // Etiketler üst üste binmesin: her biri bir öncekinden en az GAP aşağıda
  const labelYs: number[] = []
  dotYs.forEach((y, j) => labelYs.push(j === 0 ? y : Math.max(y, labelYs[j - 1] + GAP)))
  const overflow = labelYs[labelYs.length - 1] - 90
  if (overflow > 0) for (let j = 0; j < labelYs.length; j += 1) labelYs[j] -= overflow

  const dotX = 50 + (shot.edgeX - 3 - 50) * SCALE + SHIFT
  const delay = (base: number, j: number) => (active ? `${base + j * 0.07}s` : '0s')

  return (
    <div
      onClick={() => !canHover && onToggle()}
      role="presentation"
      className="relative aspect-square w-full cursor-pointer overflow-hidden bg-cream-100 [container-type:inline-size]"
    >
      <Slices shot={cup} active={active} split={split} alt={alt} eager={index < 2} />

      {/* Kavanoz alttan yukarı dolarak gelir, geri dönüşte boşalır */}
      {(mountJar || jarMode) && (
        <div
          className="absolute inset-0 transition-[clip-path] duration-[800ms] ease-[cubic-bezier(.65,0,.35,1)]"
          style={{
            clipPath: jarMode ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            transitionDelay: `${index * 0.07}s`,
          }}
        >
          {/* Mount edildiği an gerekiyor; dolum 800 ms sürdüğü için
              indirme çoğu bağlantıda perde arkasında bitiyor */}
          <Slices shot={jar} active={active} split={split} alt={alt} eager />
        </div>
      )}

      {/* Sağdan gelen yarı saydam panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[45%] border-l border-line/90 bg-background/85 backdrop-blur-md transition-transform duration-[550ms] ease-[var(--ease-soft)]"
        style={{ transform: active ? 'translateX(0)' : 'translateX(101%)' }}
      >
        <p className="absolute bottom-[5%] left-[8%] text-[max(8.5px,2.5cqw)] font-bold uppercase tracking-[0.18em] text-olive-600">
          Katman katman
        </p>
      </div>

      {/* Nokta → çizgi → etiket, sırayla */}
      {shot.layers.map((layer, j) => {
        const dx = LINE_END - dotX
        const dy = labelYs[j] - dotYs[j]
        return (
          <div key={layer.name + j} className="pointer-events-none" aria-hidden={!active}>
            <span
              className="absolute h-px origin-left bg-cocoa-600/55 transition-[transform,top,left,width] duration-[380ms]"
              style={{
                left: `${dotX}%`,
                top: `${dotYs[j]}%`,
                width: `${Math.hypot(dx, dy)}%`,
                transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg) scaleX(${active ? 1 : 0})`,
                transitionDelay: delay(0.22, j),
              }}
            />
            <span
              className="absolute size-[max(8px,2.8cqw)] rounded-full border-[1.5px] border-white shadow-[0_0_0_1px_rgba(64,37,26,.28),0_2px_6px_rgba(64,37,26,.2)] transition-[transform,top] duration-[360ms] ease-[cubic-bezier(.34,1.56,.64,1)]"
              style={{
                left: `${dotX}%`,
                top: `${dotYs[j]}%`,
                background: layer.color,
                transform: `translate(-50%,-50%) scale(${active ? 1 : 0})`,
                transitionDelay: delay(0.16, j),
              }}
            />
            <span
              className="absolute whitespace-nowrap text-[clamp(9.5px,4.1cqw,13px)] font-semibold leading-tight text-cocoa-800 transition-[opacity,transform,top] duration-[450ms] ease-[var(--ease-soft)]"
              style={{
                left: `${LABEL_X}%`,
                top: `${labelYs[j]}%`,
                opacity: active ? 1 : 0,
                transform: `translate(${active ? 0 : 8}px,-50%)`,
                transitionDelay: delay(0.28, j),
              }}
            >
              {layer.name}
            </span>
          </div>
        )
      })}

      {children}

      {/* Masaüstünde ipucu, dokunmatikte açma/kapama butonu */}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggle()
        }}
        aria-expanded={active}
        className={cn(
          'absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-surface/90 py-1.5 pl-2.5 pr-3 text-[11.5px] font-semibold text-cocoa-700 shadow-soft backdrop-blur transition-[opacity,transform] duration-300',
          canHover && active && 'translate-y-1.5 opacity-0',
        )}
      >
        {!canHover && active ? <X className="size-3.5" /> : <Layers className="size-3.5" />}
        {canHover ? 'Katmanları gör' : active ? 'Kapat' : 'Katmanlar'}
      </button>
    </div>
  )
}
