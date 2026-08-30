import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Info } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useToast, type ToastTone } from '@/context/ToastContext'

const icons: Record<ToastTone, typeof Check> = {
  success: Check,
  error: AlertCircle,
  info: Info,
}

const tones: Record<ToastTone, string> = {
  success: 'bg-cocoa-800 text-cream-100',
  error: 'bg-[var(--color-error)] text-white',
  info: 'bg-olive-600 text-white',
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4.75rem)] z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:left-auto lg:right-6 lg:top-auto lg:items-end lg:px-0"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.tone]
          return (
            <motion.button
              key={toast.id}
              type="button"
              onClick={() => dismiss(toast.id)}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-full px-4 py-3 text-sm font-medium shadow-lift ${tones[toast.tone]}`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2.6} />
              <span className="text-left">{toast.message}</span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
