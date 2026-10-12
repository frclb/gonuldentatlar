import { useEffect, useLayoutEffect, useRef } from 'react'

/** Gelen kartların kademesi en fazla bu kadar uzasın: 25 kartta son kart 1,5 sn beklemesin */
const STAGGER_CAP = 10

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Filtre değişince ürün grid'ini "katman katman" yeniden dizer: çıkan kartlar
 * küçülüp solar, kalanlar yeni yerlerine kayar (FLIP), gelenler sırayla yükselir.
 *
 * Kartların kök elemanında `data-flip-id` olmalı. Değişikliği doğrudan değil,
 * `exitThen(sonrakiIdler, commit)` ile yapın: önce çıkış oynar, sonra commit.
 * Arama gibi exitThen'den geçmeyen değişiklikler animasyonsuz uygulanır.
 */
export function useFlipGrid(ids: string[]) {
  const grid = useRef<HTMLDivElement>(null)
  const rects = useRef(new Map<string, DOMRect>())
  // Bir sonraki dizilim değişikliği exitThen'den mi geldi
  const armed = useRef(false)
  const pending = useRef<number | undefined>(undefined)
  const key = ids.join('|')

  const capture = () => {
    const map = new Map<string, DOMRect>()
    grid.current?.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((el) => {
      map.set(el.dataset.flipId!, el.getBoundingClientRect())
    })
    rects.current = map
  }

  /** Çıkacak kartları soldurur, bittiğinde `commit` çağrılır */
  const exitThen = (nextIds: string[], commit: () => void) => {
    // Hızlı arka arkaya tıklamada yalnızca sonuncusu uygulansın; aradaki
    // sonuç bir an görünüp kaybolmasın
    window.clearTimeout(pending.current)
    if (prefersReduced() || nextIds.join('|') === key) {
      // Dizilim değişmiyor (ör. sönme sürerken eski sekmeye geri dönüldü):
      // layout effect çalışmayacağı için yarım kalan sönmeyi burada geri al,
      // yoksa kartlar görünmez kalır
      grid.current
        ?.querySelectorAll<HTMLElement>('[data-flip-id]')
        .forEach((card) => card.getAnimations().forEach((animation) => animation.cancel()))
      armed.current = false
      commit()
      return
    }

    capture()
    armed.current = true
    const el = grid.current
    // Grid yoksa (boş durum gösteriliyor) çıkacak kart da yok
    if (!el) {
      commit()
      return
    }

    const next = new Set(nextIds)
    const leaving = Array.from(el.querySelectorAll<HTMLElement>('[data-flip-id]')).filter(
      (card) => !next.has(card.dataset.flipId!),
    )
    leaving.forEach((card, i) =>
      card.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(.9) translateY(10px)' },
        ],
        { duration: 220, delay: Math.min(i, 6) * 25, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
      ),
    )
    // Zamanlayıcı gizli sekmede de çalışır; animasyon donsa bile filtre uygulanır
    pending.current = window.setTimeout(commit, leaving.length ? 220 + Math.min(leaving.length, 6) * 25 : 0)
  }

  useLayoutEffect(() => {
    const el = grid.current
    if (!el || !armed.current) return
    armed.current = false
    const before = rects.current
    rects.current = new Map()

    const run: Animation[] = []
    let entering = 0
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((card) => {
      // Önceki çıkış animasyonunun "forwards" dolgusu kalan kartta asılı kalmasın
      card.getAnimations().forEach((animation) => animation.cancel())
      const from = before.get(card.dataset.flipId!)
      if (from) {
        const to = card.getBoundingClientRect()
        const dx = from.left - to.left
        const dy = from.top - to.top
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          run.push(
            card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }], {
              duration: 560,
              easing: 'cubic-bezier(.22,1,.36,1)',
            }),
          )
        }
      } else {
        // Önceki dizilimde yoktu (boş durumdan dönüşte hepsi): alttan yükselir
        run.push(
          card.animate(
            [
              { opacity: 0, transform: 'translateY(16px) scale(.94)' },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: 520,
              delay: 80 + Math.min(entering++, STAGGER_CAP) * 60,
              easing: 'cubic-bezier(.22,1,.36,1)',
              fill: 'backwards',
            },
          ),
        )
      }
    })

    // Sekme arka plandaysa animasyonlar duraklar; kartlar görünmez kalmasın
    const timer = window.setTimeout(
      () => run.forEach((animation) => animation.playState !== 'finished' && animation.finish()),
      1600,
    )
    return () => window.clearTimeout(timer)
  }, [key])

  useEffect(() => () => window.clearTimeout(pending.current), [])

  return { grid, exitThen }
}
