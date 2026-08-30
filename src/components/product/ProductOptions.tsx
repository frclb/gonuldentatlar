import { Check } from 'lucide-react'
import type { Selections } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/types'

/**
 * Ürün tipine göre gelen dinamik seçenekleri render eder.
 * `single` seçenekler radio, `multiple` seçenekler limitli checkbox gibi çalışır.
 */
export function ProductOptions({
  product,
  selections,
  onChange,
}: {
  product: Product
  selections: Selections
  /** Fonksiyonel güncelleme — arka arkaya hızlı seçimlerde durum kaybolmaz. */
  onChange: (updater: (prev: Selections) => Selections) => void
}) {
  const options = product.options ?? []
  if (options.length === 0) return null

  const toggle = (optionId: string, valueId: string, type: 'single' | 'multiple', maxSelect?: number) => {
    onChange((prev) => {
      const current = prev[optionId] ?? []
      if (type === 'single') return { ...prev, [optionId]: [valueId] }

      const exists = current.includes(valueId)
      if (!exists && maxSelect && current.length >= maxSelect) return prev
      return {
        ...prev,
        [optionId]: exists ? current.filter((id) => id !== valueId) : [...current, valueId],
      }
    })
  }

  return (
    <div className="space-y-7">
      {options.map((option) => {
        const selected = selections[option.id] ?? []
        const limitReached = option.type === 'multiple' && option.maxSelect
          ? selected.length >= option.maxSelect
          : false

        return (
          <fieldset key={option.id}>
            <legend className="flex w-full items-baseline justify-between gap-3">
              <span className="text-[0.95rem] font-semibold text-cocoa-800">
                {option.name}
                {option.required && <span className="ml-1 text-blush-500">*</span>}
              </span>
              <span className="text-[0.72rem] font-medium text-muted">
                {option.type === 'multiple'
                  ? option.maxSelect
                    ? `En fazla ${option.maxSelect} seçim`
                    : 'İstediğin kadar'
                  : 'Bir seçim'}
              </span>
            </legend>

            <div className="mt-3 flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selected.includes(value.id)
                const disabled = !isSelected && limitReached
                return (
                  <button
                    key={value.id}
                    type="button"
                    role={option.type === 'single' ? 'radio' : 'checkbox'}
                    aria-checked={isSelected}
                    disabled={disabled}
                    onClick={() => toggle(option.id, value.id, option.type, option.maxSelect)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200',
                      isSelected
                        ? 'border-cocoa-600 bg-cocoa-50 text-cocoa-800 shadow-soft'
                        : 'border-line bg-surface text-cocoa-700 hover:border-cocoa-300',
                      disabled && 'cursor-not-allowed opacity-40 hover:border-line',
                    )}
                  >
                    {isSelected && <Check className="size-3.5 text-cocoa-600" strokeWidth={3} />}
                    {value.name}
                    {value.priceDelta > 0 && (
                      <span className={cn('text-xs', isSelected ? 'text-cocoa-600' : 'text-muted')}>
                        +{formatPrice(value.priceDelta)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
