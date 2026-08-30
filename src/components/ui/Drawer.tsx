import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

/**
 * Desktop'ta sağdan açılan drawer, mobilde bottom sheet.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  useEscapeKey(open, onClose)

  const panelMotion = isDesktop
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-cocoa-900/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.aside
            {...panelMotion}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className={cn(
              'absolute flex flex-col bg-background shadow-lift',
              'inset-x-0 bottom-0 max-h-[88svh] rounded-t-xl',
              'lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:max-h-none lg:w-[26rem] lg:rounded-none lg:rounded-l-xl',
              className,
            )}
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 lg:px-6">
              <h2 className="text-lg">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="grid size-9 place-items-center rounded-full text-cocoa-600 transition-colors hover:bg-cream-200"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 lg:px-6">{children}</div>

            {footer && <div className="border-t border-line bg-surface px-5 py-4 lg:px-6">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
