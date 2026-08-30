import { useCatalog } from '@/context/CatalogContext'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * Site genelinde tek fiyat bileşeni.
 * İşletme ayarlarında fiyatlar kapalıysa hiçbir şey basmaz.
 */
export function Price({
  value,
  oldValue,
  size = 'md',
  className,
}: {
  value: number
  oldValue?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { settings } = useCatalog()
  if (!settings.showPrices) return null

  const sizes = {
    sm: 'text-sm',
    md: 'text-[1.05rem]',
    lg: 'text-2xl',
  }
  return (
    <span className={cn('inline-flex items-baseline gap-2 font-semibold text-cocoa-800', sizes[size], className)}>
      {formatPrice(value)}
      {oldValue !== undefined && oldValue > value && (
        <span className="text-[0.8em] font-medium text-muted line-through">{formatPrice(oldValue)}</span>
      )}
    </span>
  )
}
