import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation, useNavigationType, useOutlet } from 'react-router-dom'

const OUT = 200
const IN = 380

type Phase = 'idle' | 'out' | 'enter' | 'in'

const styles: Record<Phase, CSSProperties> = {
  // Dinlenmede filter kesinlikle "none" olmalı: herhangi bir filter değeri
  // (blur(0px) dahil) içerideki position:fixed öğeleri ekrana değil bu
  // sarmalayıcıya göre konumlandırır — ürün sayfasındaki alt çubuk kayardı
  idle: {},
  out: {
    opacity: 0,
    filter: 'blur(3px)',
    transition: `opacity ${OUT}ms ease-out, filter ${OUT}ms ease-out`,
  },
  enter: { opacity: 0, filter: 'blur(3px)' },
  in: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: `opacity ${IN}ms cubic-bezier(.22,1,.36,1), filter ${IN}ms cubic-bezier(.22,1,.36,1)`,
  },
}

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Kaydırma konumunu tarayıcı değil bu bileşen geri yüklüyor. Tarayıcıya
// bırakılsaydı geri tuşunda eski sayfa sönerken yeni sayfanın konumuna zıplardı
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

/**
 * Sayfalar arası yumuşak geçiş: eski sayfa söner, sayfa başa alınır, yeni
 * sayfa netleşerek gelir. Ekran yerinden oynamaz.
 *
 * AnimatePresence mode="wait" kullanılmadı: o, yeni sayfayı ancak çıkış
 * animasyonu bittiğinde basar ve animasyon gizli sekmede hiç ilerlemez —
 * WhatsApp yeni sekmede açılınca geride kalan sayfa boş kalabilirdi. Bu
 * projede sepet paneli aynı sebeple takılıyordu. Burada sırayı
 * zamanlayıcılar yürütüyor; onlar gizli sekmede de çalışıyor.
 */
export function PageTransition() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const outlet = useOutlet()
  const latest = useRef(outlet)
  latest.current = outlet

  // Ekrandaki sayfa: çıkış sürerken eskisi donmuş hâliyle kalır
  const [view, setView] = useState({ key: pathname, outlet })
  const [phase, setPhase] = useState<Phase>('idle')

  /* Geri gelince kalınan yere dön: her geçmiş kaydının kaydırma konumu saklanır */
  const positions = useRef(new Map<string, number>())
  const shownKey = useRef(key) // ekrandaki sayfanın geçmiş kaydı
  const pendingScroll = useRef<number | null>(null)

  useEffect(() => {
    if (pathname === view.key) {
      // Aynı sayfada yeni kayıt (ör. menüde filtre): konum bu kayda yazılsın
      shownKey.current = key
      // Sönerken aynı sayfaya geri dönüldüyse (A → B → A) görünmez kalmasın
      setPhase((current) => (current === 'out' ? 'in' : current))
      return
    }

    // Ayrılan sayfanın konumu; çıkış sırasında kaydırma henüz değişmedi
    positions.current.set(shownKey.current, window.scrollY)
    // Geri / ileri tuşunda kayıtlı konuma, yeni sayfada başa
    const target = navigationType === 'POP' ? (positions.current.get(key) ?? 0) : 0

    const swap = () => {
      setView({ key: pathname, outlet: latest.current })
      shownKey.current = key
      pendingScroll.current = hash ? null : target
    }

    if (prefersReduced() || document.hidden) {
      swap()
      setPhase('idle')
      return
    }

    setPhase('out')
    const timer = window.setTimeout(() => {
      swap()
      setPhase('enter')
    }, OUT)
    return () => window.clearTimeout(timer)
    // view.key bilerek dışarıda: yalnızca adres ya da kayıt değişince tetiklenmeli
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, key])

  // Kaydırma yeni sayfa DOM'a girdikten sonra: eski sayfa kısaysa (ör. ürün
  // sayfası) konum ona göre kırpılırdı
  useLayoutEffect(() => {
    if (pendingScroll.current === null) return
    // html'de scroll-behavior: smooth var; burada anında olmalı
    window.scrollTo({ top: pendingScroll.current, behavior: 'instant' as ScrollBehavior })
    pendingScroll.current = null
  }, [view.key])

  /* enter → in → idle */
  useEffect(() => {
    if (phase === 'enter') {
      // Başlangıç karesi boyansın, sonra geçiş başlasın. rAF gizli sekmede
      // çalışmaz; zamanlayıcı yedek
      const frame = requestAnimationFrame(() => setPhase('in'))
      const fallback = window.setTimeout(() => setPhase('in'), 80)
      return () => {
        cancelAnimationFrame(frame)
        window.clearTimeout(fallback)
      }
    }
    if (phase === 'in') {
      const timer = window.setTimeout(() => setPhase('idle'), IN)
      return () => window.clearTimeout(timer)
    }
  }, [phase])

  // Aynı sayfada kalındıysa (ör. ?kategori değişti) canlı içerik gösterilir
  const content = view.key === pathname ? outlet : view.outlet

  return (
    // key: yeni adreste sayfa sıfırdan kurulur — ürün → ürün geçişinde
    // seçili sunum, galeri vb. bir öncekinden taşınmaz
    <div key={view.key} style={styles[phase]}>
      {content}
    </div>
  )
}
