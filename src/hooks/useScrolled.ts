import { useEffect, useState } from 'react'

/** Sayfa belirli bir eşiğin altına kaydırıldı mı — sticky navbar için. */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
