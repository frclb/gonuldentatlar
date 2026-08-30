import { Skeleton } from './Skeleton'

/** Route-level lazy loading sırasında gösterilen iskelet. */
export function RouteFallback() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-4 h-4 w-80" />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="aspect-[3/4]" />
        ))}
      </div>
    </div>
  )
}
