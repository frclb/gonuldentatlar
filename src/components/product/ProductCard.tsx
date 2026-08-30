import { motion } from 'framer-motion'
import { Heart, Plus, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useToast } from '@/context/ToastContext'
import { buildCartItem } from '@/lib/cart'
import { cn } from '@/lib/cn'
import type { Product } from '@/types'
import { assetUrl } from '@/lib/assets'

/**
 * Sitenin en önemli UI parçası. Tek bir tasarımı vardır; menü, ana sayfa ve
 * kampanya listelerinde aynı bileşen kullanılır.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem, openCart } = useCart()
  const { settings } = useCatalog()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { notify } = useToast()

  const hasOptions = (product.options?.length ?? 0) > 0
  const favorite = isFavorite(product.id)

  const quickAdd = () => {
    addItem(buildCartItem(product))
    notify('Ürün sepete eklendi')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-surface shadow-soft transition-shadow duration-300 hover:shadow-card"
    >
      <Link to={`/menu/${product.slug}`} className="relative block overflow-hidden" tabIndex={-1} aria-hidden>
        <div className="aspect-square w-full overflow-hidden bg-cream-100">
          <img
            src={assetUrl(product.image)}
            alt=""
            width={900}
            height={900}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.06]"
          />
        </div>
      </Link>

      {/* rozetler */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
        {product.badge && <Badge tone={product.badge.tone ?? 'dark'}>{product.badge.label}</Badge>}
        {product.isNew && <Badge tone="new">Yeni</Badge>}
        {product.discountPercentage ? <Badge tone="discount">%{product.discountPercentage} indirim</Badge> : null}
      </div>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-label={favorite ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
        aria-pressed={favorite}
        className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-surface/85 text-cocoa-600 shadow-soft backdrop-blur transition-colors hover:bg-surface"
      >
        <Heart className={cn('size-[1.05rem] transition-all', favorite && 'fill-blush-400 text-blush-400')} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[1.05rem] leading-snug">
          <Link to={`/menu/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-muted">{product.description}</p>

        <div className={cn('mt-4 flex items-end gap-3 pt-1', settings.showPrices ? 'justify-between' : 'justify-end')}>
          <Price value={product.price} oldValue={product.oldPrice} />

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              quickAdd()
              openCart()
            }}
            aria-label={`${product.name} sepete ekle`}
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-cocoa-600 text-cream-50 shadow-soft transition-[background-color,transform] duration-200 hover:bg-cocoa-700 active:scale-90"
          >
            <Plus className="size-5" strokeWidth={2.6} />
          </button>
        </div>

        {hasOptions && (
          <p className="mt-2.5 flex items-center gap-1.5 text-[0.72rem] font-medium text-olive-600">
            <SlidersHorizontal className="size-3.5" />
            Özelleştirilebilir
          </p>
        )}
      </div>
    </motion.article>
  )
}
