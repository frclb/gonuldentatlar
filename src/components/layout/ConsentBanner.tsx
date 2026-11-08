import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyticsEnabled, getConsent, onConsentSettingsOpen, setConsent, type Consent } from '@/lib/analytics'

/**
 * Analitik çerez onayı. Yalnızca ölçüm kimliği tanımlıysa görünür; ziyaretçi bir seçim
 * yapana kadar Google Analytics yüklenmez. "Reddet" ile "Kabul et" eşit ağırlıkta durur.
 */
export function ConsentBanner() {
  const [acik, setAcik] = useState(() => analyticsEnabled && getConsent() === null)

  useEffect(() => onConsentSettingsOpen(() => setAcik(true)), [])

  if (!analyticsEnabled) return null

  const sec = (secim: Consent) => {
    setConsent(secim)
    setAcik(false)
  }

  return (
    <AnimatePresence>
      {acik && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihi"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm"
        >
          <div className="rounded-3xl border border-cocoa-100 bg-cream-50 p-5 text-sm leading-relaxed text-cocoa-700 shadow-lift">
            <p className="font-semibold text-cocoa-800">Ziyaretini ölçebilir miyiz?</p>
            <p className="mt-1.5 text-muted">
              Hangi sayfaların gezildiğini ve hangi butonlara tıklandığını Google Analytics ile sayıyoruz;
              bunun için çerez kullanılır. Onay vermezsen ölçüm yapılmaz, site aynı şekilde çalışır.{' '}
              <Link to="/gizlilik" className="font-semibold text-cocoa-700 underline underline-offset-2 hover:text-cocoa-800">
                Ayrıntılar
              </Link>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => sec('denied')}
                className="rounded-full border border-cocoa-200 px-4 py-2.5 font-semibold text-cocoa-700 transition-colors hover:bg-cocoa-50"
              >
                Reddet
              </button>
              <button
                type="button"
                onClick={() => sec('granted')}
                className="rounded-full bg-cocoa-700 px-4 py-2.5 font-semibold text-cream-50 transition-colors hover:bg-cocoa-800"
              >
                Kabul et
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
