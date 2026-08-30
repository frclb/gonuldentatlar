import { Trash2 } from 'lucide-react'
import { Price } from '@/components/ui/Price'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { useCart } from '@/context/CartContext'
import { multiply } from '@/lib/money'
import { optionsSummary } from '@/lib/whatsapp'
import type { CartItem } from '@/types'
import { assetUrl } from '@/lib/assets'

export function CartLine({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { setQuantity, removeItem } = useCart()
  const summary = optionsSummary(item)

  return (
    <li className="flex gap-3.5 py-4">
      <img
        src={assetUrl(item.image)}
        alt=""
        width={160}
        height={160}
        loading="lazy"
        decoding="async"
        className="size-20 shrink-0 rounded-md bg-cream-100 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.95rem] leading-snug">{item.name}</h3>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label={`${item.name} ürününü sepetten çıkar`}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-blush-50 hover:text-[var(--color-error)]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        {summary && <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-muted">{summary}</p>}
        {item.note && <p className="mt-1 text-[0.78rem] italic text-olive-600">Not: {item.note}</p>}

        <div className="mt-3 flex items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            onChange={(next) => setQuantity(item.key, next)}
          />
          <Price value={multiply(item.unitPrice, item.quantity)} size={compact ? 'sm' : 'md'} />
        </div>
      </div>
    </li>
  )
}
