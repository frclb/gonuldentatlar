import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { useSeo } from '@/lib/seo'

const ALL = 'tumu'
const CAMPAIGN = 'kampanyalar'

export default function Menu() {
  const { activeCategories, activeProducts, activeCampaigns } = useCatalog()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const activeFilter = searchParams.get('kategori') ?? ALL
  const campaignSlug = searchParams.get('kampanya')
  const selectedCampaign = campaignSlug
    ? activeCampaigns.find((campaign) => campaign.slug === campaignSlug)
    : undefined

  useSeo({
    title: 'Menü | Gönülden Tatlar',
    description:
      'Magnolya ve cup tatlılar: çilekli, muzlu, çikolatalı, bisküvili çeşitler. Gönülden Tatlar menüsünü keşfet.',
    path: '/menu',
  })

  useEffect(() => track('view_menu', { filter: activeFilter }), [activeFilter])

  const campaignProductIds = useMemo(
    () => new Set(activeCampaigns.flatMap((campaign) => campaign.productIds ?? [])),
    [activeCampaigns],
  )

  const filters = useMemo(
    () => [
      { id: ALL, label: 'Tümü' },
      ...activeCategories.map((category) => ({ id: category.slug, label: category.name })),
      ...(activeCampaigns.length > 0 ? [{ id: CAMPAIGN, label: 'Kampanyalar' }] : []),
    ],
    [activeCategories, activeCampaigns],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR')
    const campaignIds = selectedCampaign?.productIds

    return activeProducts.filter((product) => {
      if (campaignIds && !campaignIds.includes(product.id)) return false
      const matchesFilter =
        activeFilter === ALL
          ? true
          : activeFilter === CAMPAIGN
            ? campaignProductIds.has(product.id) || product.discountPercentage !== undefined
            : product.categoryId === activeFilter
      if (!matchesFilter) return false
      if (!normalized) return true
      return (
        product.name.toLocaleLowerCase('tr-TR').includes(normalized) ||
        product.description.toLocaleLowerCase('tr-TR').includes(normalized)
      )
    })
  }, [activeProducts, activeFilter, campaignProductIds, query, selectedCampaign])

  const selectFilter = (id: string) => {
    startTransition(() => {
      setSearchParams(id === ALL ? {} : { kategori: id }, { replace: true })
    })
  }

  return (
    <>
      <header className="border-b border-line bg-cream-100">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">Menü</p>
          <h1 className="text-[2rem] leading-tight md:text-[2.75rem]">Gönülden Gelen Lezzetler</h1>
          <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-muted">
            {activeProducts.length} çeşit seni bekliyor. Kategoriye göre filtrele, favorini seç ve sepete ekle.
          </p>
        </div>
      </header>

      <div className="sticky top-16 z-30 border-b border-line bg-background/90 backdrop-blur-xl lg:top-[4.5rem]">
        <div className="container-page">
          <div className="flex items-center gap-3 py-3">
            <div className="no-scrollbar edge-fade-x -mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
              {filters.map((filter) => {
                const isActive = filter.id === activeFilter
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => selectFilter(filter.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
                      isActive
                        ? 'border-cocoa-600 bg-cocoa-600 text-cream-50'
                        : 'border-line bg-surface text-cocoa-700 hover:border-cocoa-300 hover:bg-cream-100',
                    )}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <div className="relative hidden w-56 shrink-0 sm:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tatlı ara…"
                aria-label="Menüde ara"
                className="h-10 w-full rounded-full border border-line bg-surface pl-9 pr-8 text-sm text-cocoa-800 placeholder:text-muted/70 focus:border-cocoa-400 focus:outline-none focus:ring-4 focus:ring-cocoa-100"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Aramayı temizle"
                  className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8 md:py-12">
        {selectedCampaign && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blush-200 bg-blush-50 px-4 py-3">
            <p className="text-sm text-cocoa-700">
              <strong className="font-semibold">{selectedCampaign.title}</strong> kampanyasına dahil ürünler
              gösteriliyor.
            </p>
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              className="text-sm font-semibold text-blush-500 underline-offset-4 hover:underline"
            >
              Filtreyi kaldır
            </button>
          </div>
        )}

        {filtered.length === 0 && !isPending ? (
          <EmptyState
            title="Bu kategoride henüz ürün bulunmuyor."
            description={query ? `"${query}" için sonuç yok. Başka bir şey deneyebilirsin.` : undefined}
            action={
              <ButtonLink to="/menu" onClick={() => setQuery('')} variant="outline">
                Tüm menüyü gör
              </ButtonLink>
            }
          />
        ) : (
          <ProductGrid products={filtered} loading={isPending} skeletonCount={8} />
        )}
      </div>
    </>
  )
}
