import { createContext, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import { shouldPlayIntro } from '@/components/brand/IntroSplash'

/**
 * Açılış animasyonu üç yeri ilgilendiriyor: overlay'i basan SiteLayout, uçuşun
 * hedefi olan Navbar logosu ve uçuş başlayınca açılması gereken Hero. Üçü de
 * kardeş olduğu için küçük bir context en sade yol.
 */
interface IntroValue {
  /** Overlay ekranda mı */
  playing: boolean
  /** Hero içeriği belirmeye başlasın mı */
  heroIn: boolean
  /** Navbar'daki logo işareti */
  logoRef: RefObject<HTMLSpanElement>
  setPlaying: (value: boolean) => void
  setHeroIn: (value: boolean) => void
}

const IntroCtx = createContext<IntroValue | null>(null)

export function IntroProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  // Yalnızca oturum ana sayfada başlıyorsa. Ürün linkiyle gelen biri için
  // "oynuyor" durumunda kalsaydı navbar logosu (açılış sürerken gizli) ana
  // sayfaya gidene kadar görünmez kalıyordu
  const [playing, setPlaying] = useState(() => pathname === '/' && shouldPlayIntro())
  // Açılış oynamıyorsa Hero doğrudan görünür olmalı
  const [heroIn, setHeroIn] = useState(!playing)
  const logoRef = useRef<HTMLSpanElement>(null)

  const value = useMemo(
    () => ({ playing, heroIn, logoRef, setPlaying, setHeroIn }),
    [playing, heroIn],
  )

  return <IntroCtx.Provider value={value}>{children}</IntroCtx.Provider>
}

export function useIntro(): IntroValue {
  const ctx = useContext(IntroCtx)
  if (!ctx) throw new Error('useIntro, IntroProvider içinde kullanılmalıdır.')
  return ctx
}
