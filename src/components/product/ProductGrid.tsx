import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
}: {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: skeletonCount }, (_, index) => <ProductCardSkeleton key={index} />)
        : products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
    </div>
  )
}
