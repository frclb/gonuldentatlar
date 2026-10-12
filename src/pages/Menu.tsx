import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { assetUrl } from '@/lib/assets'
import { LogoMark } from '@/components/brand/Logo'
import { FilterChips } from '@/components/product/FilterChips'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { useCatalog } from '@/context/CatalogContext'
import { useFlipGrid } from '@/hooks/useFlipGrid'
import { track } from '@/lib/analytics'
import { useSeo } from '@/lib/seo'
import { rise } from '@/lib/motion'

const ALL = 'tumu'
const CAMPAIGN = 'kampanyalar'

export default function Menu() {
  const { activeCategories, activeProducts, activeCampaigns } = useCatalog()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  // Tıklanan sekme, adres güncellenene kadar. Adres çıkış animasyonundan sonra
  // değişiyor; hap ona bağlı kalsaydı tıklamadan ~370 ms sonra kıpırdardı
  const [chosen, setChosen] = useState<string | null>(null)

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

  /**
   * Hem ekrandaki listeyi hem de bir sonraki filtrenin listesini hesaplar.
   * İkisi aynı fonksiyondan çıkmalı: geçiş, hangi kartların çıkacağını
   * buradan öğreniyor.
   */
  const filterProducts = (filterId: string, campaignIds?: string[], search = query) => {
    const normalized = search.trim().toLocaleLowerCase('tr-TR')
    return activeProducts.filter((product) => {
      if (campaignIds && !campaignIds.includes(product.id)) return false
      const matchesFilter =
        filterId === ALL
          ? true
          : filterId === CAMPAIGN
            ? campaignProductIds.has(product.id) || product.discountPercentage !== undefined
            : product.categoryIds.includes(filterId)
      if (!matchesFilter) return false
      if (!normalized) return true
      return (
        product.name.toLocaleLowerCase('tr-TR').includes(normalized) ||
        product.description.toLocaleLowerCase('tr-TR').includes(normalized)
      )
    })
  }

  const filtered = filterProducts(activeFilter, selectedCampaign?.productIds)
  const { grid, exitThen } = useFlipGrid(filtered.map((product) => product.id))

  // startTransition kaldırıldı: geçişi animasyon yönetiyor, isPending'in
  // gösterdiği iskelet kartlar da FLIP ölçümlerini bozuyordu
  /**
   * @param nextQuery Verilirse arama da geçişle birlikte değişir. Sonraki liste
   * yeni aramayla hesaplanmalı: eski aramayla boş çıkar ve geçiş "değişiklik
   * yok" sanıp kartları yükseltmez.
   */
  const applyFilter = (id: string, nextQuery?: string) => {
    // Filtre seçilince kampanya parametresi de düşüyor; sonraki liste ona göre
    const nextIds = filterProducts(id, undefined, nextQuery ?? query).map((product) => product.id)
    setChosen(id)
    exitThen(nextIds, () => {
      setSearchParams(id === ALL ? {} : { kategori: id }, { replace: true })
      if (nextQuery !== undefined) setQuery(nextQuery)
      setChosen(null)
    })
  }

  const selectFilter = (id: string) => {
    if (id === (chosen ?? activeFilter) && !selectedCampaign) return
    applyFilter(id)
  }

  // Boş durumdan dönüş: zaten "Tümü"deyken aramada boş kalındıysa da çalışmalı
  const showAll = () => applyFilter(ALL, '')

  const activeLabel = filters.find((filter) => filter.id === activeFilter)?.label
  const emptyDescription = query
    ? `"${query}" için sonuç yok. Başka bir şey deneyebilirsin.`
    : activeFilter === CAMPAIGN
      ? 'Şu an kampanyalı ürün yok. Diğer tatlara göz atabilirsin.'
      : `${activeLabel ?? 'Bu tat'} çeşitler şu an menüde yok. Diğer tatlara göz atabilirsin.`

  return (
    <>
      <header className="border-b border-line bg-cream-100">
        <div className="container-page grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <motion.p {...rise(0)} className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">Menü</motion.p>
            <motion.h1 {...rise(0.07)} className="text-[2rem] leading-tight md:text-[2.75rem]">Gönülden Gelen Lezzetler</motion.h1>
            <motion.p {...rise(0.14)} className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-muted">
              {activeProducts.length} çeşit seni bekliyor. Kategoriye göre filtrele, favorini seç ve sepete ekle.
            </motion.p>
          </div>
          {/* Başlıkla birlikte görünür, bu yüzden gecikmeli yükleme yok */}
          <img
            src={assetUrl('/images/genel/karisik-dortlu-kavanoz.webp')}
            alt=""
            width={1600}
            height={1067}
            decoding="async"
            /* Sabit yükseklik: başlık şişip ürünleri ekranın altına itmesin */
            className="hidden h-44 w-[22rem] rounded-xl object-cover shadow-soft lg:block xl:h-48 xl:w-[26rem]"
          />
        </div>
      </header>

      <div className="sticky top-16 z-30 border-b border-line bg-background/90 backdrop-blur-xl lg:top-[4.5rem]">
        <div className="container-page">
          <div className="flex items-start gap-3 py-3 lg:items-center">
            {/* Mobilde yatay kaydırma, geniş ekranda alt satıra sarma */}
            <FilterChips
              filters={filters}
              active={chosen ?? activeFilter}
              onSelect={selectFilter}
              className="no-scrollbar edge-fade-x -mx-1 flex flex-1 gap-2 overflow-x-auto px-1 lg:flex-wrap lg:overflow-visible"
            />

            <div className="relative hidden w-56 shrink-0 sm:block lg:mt-0">
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

        {/* Sayaç: her değişimde yukarıdan düşerek güncellenir */}
        <p aria-live="polite" className="mb-5 text-sm font-semibold text-cocoa-700">
          <motion.span
            key={`${activeFilter}-${filtered.length}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {filtered.length} çeşit
          </motion.span>
        </p>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <EmptyState
              icon={<LogoMark className="size-14" />}
              title={query ? 'Aradığın tatlıyı bulamadık.' : 'Bu tat çok yakında burada.'}
              description={emptyDescription}
              action={
                <Button onClick={showAll} variant="outline">
                  Tümünü gör
                </Button>
              }
            />
          </motion.div>
        ) : (
          <ProductGrid gridRef={grid} products={filtered} reveal={false} />
        )}
      </div>
    </>
  )
}
