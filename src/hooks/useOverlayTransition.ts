import { useEffect, useState } from 'react'

/**
 * Panel/modal gibi ekranı kaplayan bileşenler için açılış-kapanış geçişi.
 *
 * Kapanışta eleman **zamanlayıcı** ile DOM'dan kaldırılır; animasyonun
 * tamamlanmasını beklemez. Sekme arka plana alındığında tarayıcı animasyonları
 * durdurduğu için animasyon callback'ine güvenen yaklaşımlar elemanı DOM'da
 * bırakıyor ve görünmez bir katman tüm sayfayı tıklanamaz hâle getiriyordu.
 *
 * @returns `mounted` — DOM'da olmalı mı; `entered` — açık duruma geçiş sınıfları uygulansın mı
 */
export function useOverlayTransition(open: boolean, duration = 300) {
  const [mounted, setMounted] = useState(open)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Açılış geçişinin çalışması için bir kare bekle. Sekme arka plandayken
      // requestAnimationFrame hiç tetiklenmediğinden zamanlayıcı yedeği bırakılır.
      const frame = requestAnimationFrame(() => setEntered(true))
      const fallback = window.setTimeout(() => setEntered(true), 80)
      return () => {
        cancelAnimationFrame(frame)
        window.clearTimeout(fallback)
      }
    }

    setEntered(false)
    const timer = window.setTimeout(() => setMounted(false), duration)
    return () => window.clearTimeout(timer)
  }, [open, duration])

  return { mounted, entered }
}
