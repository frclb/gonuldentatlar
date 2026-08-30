import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useOverlayTransition } from '@/hooks/useOverlayTransition'
import { cn } from '@/lib/cn'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}) {
  const { mounted, entered } = useOverlayTransition(open, 220)
  useEscapeKey(open, onClose)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-cocoa-900/40 backdrop-blur-[2px] transition-opacity duration-200',
          entered ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative flex max-h-[90svh] w-full flex-col overflow-hidden rounded-t-xl bg-background shadow-lift sm:rounded-xl',
          'transition-[opacity,transform] duration-200 ease-[var(--ease-soft)]',
          entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[0.98] opacity-0',
          size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-3xl',
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
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
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-line bg-surface px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
