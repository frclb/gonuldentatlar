import type { ReactNode, Ref } from 'react'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  gridRef,
  reveal = true,
  renderCard,
}: {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  /** useFlipGrid'in grid ref'i — filtre geçişi kartları buradan bulur */
  gridRef?: Ref<HTMLDivElement>
  /** Kartların kaydırınca belirme animasyonu; bkz. ProductCard */
  reveal?: boolean
  /** Bir ürün için özel kart (ör. menüde katmanlı magnolya kartı). undefined dönerse ProductCard */
  renderCard?: (product: Product, index: number) => ReactNode | undefined
}) {
  return (
    <div ref={gridRef} className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: skeletonCount }, (_, index) => <ProductCardSkeleton key={index} />)
        : products.map(
            (product, index) =>
              renderCard?.(product, index) ?? (
                <ProductCard key={product.id} product={product} priority={index < 4} reveal={reveal} />
              ),
          )}
    </div>
  )
}
