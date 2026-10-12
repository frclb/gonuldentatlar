import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import { useRef } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useToast } from '@/context/ToastContext'
import { useCanHover } from '@/hooks/useCanHover'
import { assetUrl } from '@/lib/assets'
import { buildCartItem, defaultSelections } from '@/lib/cart'
import { cn } from '@/lib/cn'
import { flyToCart } from '@/lib/flyToCart'
import type { Product } from '@/types'
import { LayerReveal } from './LayerReveal'

/**
 * ProductCard'ın katmanlı kardeşi. Kabuk aynı; görsel alanında LayerReveal var.
 *
 * Görsele ya da başlığa tıklamak ürün sayfasına gitmez, Magnolya sahnesini
 * açar (MagnolyaStage). Katmanları masaüstünde hover, dokunmatikte çip açar.
 */
export function MagnolyaCard({
  product,
  jarMode,
  index,
  active,
  onActive,
  split,
  mountJar,
  onOpen,
  variant = 'strip',
  reveal = true,
}: {
  product: Product
  jarMode: boolean
  index: number
  active: boolean
  onActive: (value: boolean) => void
  split?: boolean
  mountJar: boolean
  /** Sahneyi açar; kartın görsel kutusunun konumuyla */
  onOpen: (rect: DOMRect) => void
  /** strip: ana sayfadaki yatay şerit (mobilde %78 genişlik); grid: menü ızgarası */
  variant?: 'strip' | 'grid'
  /** Kaydırınca belirme. Menüde kapalı — filtre geçişini useFlipGrid yönetiyor */
  reveal?: boolean
}) {
  const canHover = useCanHover()
  const { addItem } = useCart()
  const { settings } = useCatalog()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { notify } = useToast()
  const imageBox = useRef<HTMLDivElement>(null)

  const favorite = isFavorite(product.id)
  const serving = product.serving
  if (!serving) return null

  const shot = jarMode ? serving.jar : serving.cup

  /** Karttaki sunum seçimi sepete de taşınsın */
  const selections = { ...defaultSelections(product), sunum: [jarMode ? 'kavanoz' : 'cup'] }
  const unitPrice = buildCartItem(product, { selections }).unitPrice

  const add = () => {
    // Drawer açılmıyor: uçuş ve sayaç zıplaması yeterli geri bildirim,
    // açılan panel uçuşun üstünü kapatıyordu
    flyToCart(imageBox.current, assetUrl(shot.image))
    addItem(buildCartItem(product, { selections }))
    notify(`${product.name} sepete eklendi`)
  }

  return (
    <motion.article
      data-flip-id={product.id}
      initial={reveal ? { opacity: 0, y: 18 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => canHover && onActive(true)}
      onMouseLeave={() => canHover && onActive(false)}
      // Sahne kapanırken görsel doğru karta geri dönsün diye
      data-magnolya-card={product.id}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl bg-surface shadow-soft transition-shadow duration-300 hover:shadow-card',
        variant === 'strip' && 'w-[78%] shrink-0 snap-start sm:w-auto',
      )}
    >
      <div ref={imageBox}>
        <LayerReveal
          cup={serving.cup}
          jar={serving.jar}
          jarMode={jarMode}
          active={active}
          split={split}
          canHover={canHover}
          onToggle={() => onActive(!active)}
          index={index}
          alt={product.name}
          mountJar={mountJar}
          onOpen={onOpen}
        >
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
            {product.badge && <Badge tone={product.badge.tone ?? 'dark'}>{product.badge.label}</Badge>}
            {product.isNew && <Badge tone="new">Yeni</Badge>}
            {product.discountPercentage ? <Badge tone="discount">%{product.discountPercentage} indirim</Badge> : null}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              toggleFavorite(product.id)
            }}
            aria-label={favorite ? `${product.name} favorilerden çıkar` : `${product.name} favorilere ekle`}
            aria-pressed={favorite}
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-surface/85 text-cocoa-600 shadow-soft backdrop-blur transition-colors hover:bg-surface"
          >
            <Heart className={cn('size-[1.05rem] transition-all', favorite && 'fill-blush-400 text-blush-400')} />
          </button>
        </LayerReveal>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[1.05rem] leading-snug">
          {/* Sahnenin klavyeyle açılabilen yolu; görsele tıklamak da aynı işi yapar */}
          <button
            type="button"
            onClick={() => imageBox.current && onOpen(imageBox.current.getBoundingClientRect())}
            className="text-left transition-colors hover:text-cocoa-600"
          >
            {product.name}
          </button>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-muted">{product.description}</p>

        <div
          className={cn(
            'mt-auto flex items-end gap-3 pt-4',
            settings.showPrices ? 'justify-between' : 'justify-end',
          )}
        >
          <Price value={unitPrice} oldValue={product.oldPrice} />

          <button
            type="button"
            onClick={add}
            aria-label={`${product.name} sepete ekle`}
            className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-cocoa-600 text-cream-50 shadow-soft transition-[background-color,transform] duration-200 hover:bg-cocoa-700 active:scale-90"
          >
            <Plus className="size-5" strokeWidth={2.6} />
          </button>
        </div>

        <p className="mt-2.5 text-[0.72rem] font-medium text-olive-600">
          {jarMode ? 'Kavanozda' : 'Cup içinde'}
        </p>
      </div>
    </motion.article>
  )
}
