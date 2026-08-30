import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-cream-200', className)} />
}

/** Ürün grid'i için iskelet — gerçek kart oranlarıyla aynı, layout shift olmaz. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-soft">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
