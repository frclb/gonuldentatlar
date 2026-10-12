/**
 * Sepete uçuş animasyonu.
 *
 * Sepet ikonu Navbar'da, uçuşu başlatan buton ürün kartında; ikisinin arasında
 * context kurmak yerine ikon kendini burada kaydediyor. Animasyon DOM'a geçici
 * bir <img> ekleyip Web Animations API ile oynatıyor — React render'ına
 * girmediği için kart yeniden çizilmiyor.
 */
let bagEl: HTMLElement | null = null
let badgeEl: HTMLElement | null = null

export const registerBag = (el: HTMLElement | null) => {
  bagEl = el
}

export const registerBadge = (el: HTMLElement | null) => {
  badgeEl = el
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Sepet sayacını zıplatır. */
export function bumpBadge() {
  if (prefersReduced()) return
  badgeEl?.animate(
    [{ transform: 'scale(.4)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
    { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  )
}

/**
 * Ürün görselini kavis çizerek sepet ikonuna uçurur.
 * Hareket kapalıysa ya da hedef yoksa sessizce atlanır; `onArrive` yine çağrılır.
 */
export function flyToCart(from: HTMLElement | null, src: string, onArrive?: () => void) {
  if (!from || !bagEl || prefersReduced()) {
    onArrive?.()
    return
  }

  const a = from.getBoundingClientRect()
  const b = bagEl.getBoundingClientRect()
  const size = Math.min(a.width * 0.55, 140)

  const img = document.createElement('img')
  img.src = src
  img.alt = ''
  Object.assign(img.style, {
    position: 'fixed',
    zIndex: '90',
    pointerEvents: 'none',
    borderRadius: '50%',
    objectFit: 'cover',
    width: `${size}px`,
    height: `${size}px`,
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    boxShadow: 'var(--shadow-lift)',
  })
  document.body.appendChild(img)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)

  const animation = img.animate(
    [
      { transform: 'translate(0,0) scale(.6)', opacity: 0 },
      { transform: 'translate(0,-10px) scale(1)', opacity: 1, offset: 0.16 },
      // Kavisi veren ara kare: yatayda yarı yol, dikeyde yukarı taşma
      { transform: `translate(${dx * 0.45}px, ${dy * 0.5 - 90}px) scale(.55)`, opacity: 1, offset: 0.58 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0.5 },
    ],
    { duration: 860, easing: 'cubic-bezier(.45,0,.25,1)' },
  )

  const finish = () => {
    img.remove()
    bagEl?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }],
      { duration: 380 },
    )
    onArrive?.()
  }

  animation.onfinish = finish
  // Sekme gizlenirse onfinish hiç çalışmaz; görsel ekranda kalmasın
  window.setTimeout(() => {
    if (img.isConnected) finish()
  }, 1400)
}
