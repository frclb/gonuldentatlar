import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Rota değişiminde sayfayı başa al (hash varsa dokunma). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
