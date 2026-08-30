import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  emoji = '🍓',
  title,
  description,
  action,
}: {
  emoji?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cream-300 bg-cream-100/60 px-6 py-14 text-center">
      <span className="mb-4 grid size-16 place-items-center rounded-full bg-surface text-3xl shadow-soft" aria-hidden>
        {emoji}
      </span>
      <h3 className="text-lg">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-blush-200 bg-blush-50 px-6 py-14 text-center">
      <h3 className="text-lg">Ürünler yüklenirken bir hata oluştu.</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{message ?? 'Lütfen tekrar deneyin.'}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          <RefreshCw className="size-4" /> Tekrar Dene
        </Button>
      )}
    </div>
  )
}
