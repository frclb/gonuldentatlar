import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useOverlayTransition } from '@/hooks/useOverlayTransition'
import { cn } from '@/lib/cn'

/**
 * Desktop'ta sağdan açılan drawer, mobilde bottom sheet.
 *
 * Geçişler CSS ile yapılır ve kapanışta eleman zamanlayıcıyla kaldırılır —
 * bkz. `useOverlayTransition`.
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
  const { mounted, entered } = useOverlayTransition(open, 300)
  useEscapeKey(open, onClose)

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-cocoa-900/35 backdrop-blur-[2px] transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        className={cn(
          'absolute flex flex-col bg-background shadow-lift',
          'transition-transform duration-300 ease-[var(--ease-soft)] will-change-transform',
          'inset-x-0 bottom-0 max-h-[88svh] rounded-t-xl',
          'lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:max-h-none lg:w-[26rem] lg:rounded-none lg:rounded-l-xl',
          entered ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full',
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
      </aside>
    </div>,
    document.body,
  )
}
