import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { MobileMenu } from './MobileMenu'
import { navLinks } from './navLinks'

export function Navbar() {
  const scrolled = useScrolled(8)
  const { itemCount, openCart } = useCart()
  const { settings } = useCatalog()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  /* Rota değişince mobil menü kapansın */
  useEffect(() => setMenuOpen(false), [location.pathname])

  const orderTarget = itemCount > 0 ? '/siparis' : '/menu'

  return (
    <>
      {!settings.isOpen && (
        <div className="bg-cocoa-800 px-4 py-2 text-center text-xs font-medium text-cream-200">
          Şu anda kapalıyız — menüyü inceleyip siparişini hazırlayabilirsin.
        </div>
      )}

      <header
        className={cn(
          'sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[var(--ease-soft)]',
          scrolled
            ? 'bg-background/85 shadow-soft backdrop-blur-xl'
            : 'bg-background/0',
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-2 lg:h-[4.5rem] lg:gap-3">
            {/* mobil: hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              className="-ml-1.5 grid size-9 shrink-0 place-items-center rounded-full text-cocoa-700 transition-colors hover:bg-cream-200 lg:hidden"
            >
              <Menu className="size-5" strokeWidth={2.2} />
            </button>

            <Logo compact className="min-w-0 shrink-0" />

            <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors duration-200',
                      isActive ? 'text-cocoa-800' : 'text-muted hover:text-cocoa-700',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-blush-300"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={openCart}
                aria-label={`Sepet — ${itemCount} ürün`}
                className="relative grid size-9 place-items-center rounded-full text-cocoa-700 transition-colors hover:bg-cream-200 lg:size-10"
              >
                <ShoppingBag className="size-[1.25rem] lg:size-[1.35rem]" strokeWidth={2} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="count"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                      className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-blush-400 px-1 text-[0.68rem] font-bold text-cocoa-800"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <ButtonLink to={orderTarget} size="sm" className="px-3.5 sm:px-5">
                Sipariş&nbsp;Ver
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
