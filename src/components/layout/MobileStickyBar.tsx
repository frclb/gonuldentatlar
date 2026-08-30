import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/format'

/**
 * Mobilde ekranın altında sabit sipariş kısayolu.
 * Ürün detay ve checkout sayfalarında gizlenir — oralarda kendi CTA'ları var.
 */
const hiddenOn = [/^\/siparis/, /^\/sepet/, /^\/menu\/[^/]+$/, /^\/admin/]

export function MobileStickyBar() {
  const { itemCount, subtotal, openCart } = useCart()
  const { pathname } = useLocation()

  const hidden = hiddenOn.some((pattern) => pattern.test(pathname))
  const visible = itemCount > 0 && !hidden

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden"
        >
          <button
            type="button"
            onClick={openCart}
            className="flex w-full items-center justify-between gap-3 rounded-full bg-cocoa-600 px-5 py-3.5 text-cream-50 shadow-lift active:scale-[0.98]"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="relative grid size-7 place-items-center rounded-full bg-cream-50/15">
                <ShoppingBag className="size-4" />
              </span>
              Sepeti Gör
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="rounded-full bg-cream-50/15 px-2 py-0.5 text-xs">{itemCount} ürün</span>
              {formatPrice(subtotal)}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
