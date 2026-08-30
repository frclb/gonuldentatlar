import { AnimatePresence, motion } from 'framer-motion'
import { Instagram, MessageCircle, Phone, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { useCatalog } from '@/context/CatalogContext'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { buildContactUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'
import { navLinks } from './navLinks'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useCatalog()
  useEscapeKey(open, onClose)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menü">
          <motion.div
            className="absolute inset-0 bg-cocoa-900/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-background shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Menüyü kapat"
                className="grid size-10 place-items-center rounded-full text-cocoa-600 transition-colors hover:bg-cream-200"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-3 py-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.045 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-4 py-3.5 font-[family-name:var(--font-display)] text-xl transition-colors',
                        isActive ? 'bg-cream-200 text-cocoa-800' : 'text-cocoa-700 hover:bg-cream-100',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-line px-5 py-5">
              <ButtonLink to="/menu" size="lg" fullWidth onClick={onClose}>
                Menüyü Keşfet
              </ButtonLink>
              <div className="flex items-center justify-center gap-2">
                <ButtonAnchor
                  href={buildContactUrl(settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="sm"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </ButtonAnchor>
                <ButtonAnchor href={`tel:${settings.phone.replace(/\s/g, '')}`} variant="outline" size="sm">
                  <Phone className="size-4" /> Ara
                </ButtonAnchor>
                <ButtonAnchor href={settings.instagram} target="_blank" rel="noreferrer" variant="outline" size="sm">
                  <Instagram className="size-4" />
                </ButtonAnchor>
              </div>
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
