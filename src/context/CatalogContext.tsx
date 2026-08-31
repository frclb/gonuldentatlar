import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Campaign, Category, Order, OrderStatus, Product, StoreSettings } from '@/types'
import { campaigns as seedCampaigns, categories as seedCategories, products as seedProducts, storeSettings as seedSettings } from '@/data/catalog'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

/**
 * Katalog + işletme ayarları + siparişler için tek kaynak.
 * Bugün mock data ve localStorage üzerinden çalışır; `services/` katmanı
 * eklendiğinde bu provider'ın içi API çağrılarıyla değiştirilebilir.
 */

const STORAGE_KEY = 'catalog'
/**
 * Tohum veri her değiştiğinde artırılır. Sürüm uyuşmazsa tarayıcıda saklı
 * eski katalog atılır ve güncel menü yüklenir.
 */
const VERSION = 9

interface CatalogState {
  version: number
  categories: Category[]
  products: Product[]
  campaigns: Campaign[]
  settings: StoreSettings
  orders: Order[]
}

const seedState = (): CatalogState => ({
  version: VERSION,
  categories: seedCategories,
  products: seedProducts,
  campaigns: seedCampaigns,
  settings: seedSettings,
  orders: [],
})

interface CatalogContextValue extends Omit<CatalogState, 'version'> {
  /** Yalnızca aktif kategoriler, sıralı */
  activeCategories: Category[]
  /** Yalnızca aktif ürünler, sıralı */
  activeProducts: Product[]
  activeCampaigns: Campaign[]
  getProduct: (slug: string) => Product | undefined
  getCategory: (id: string) => Category | undefined
  productsByCategory: (categoryId: string) => Product[]
  countByCategory: (categoryId: string) => number

  upsertProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  upsertCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  upsertCampaign: (campaign: Campaign) => void
  deleteCampaign: (id: string) => void
  updateSettings: (patch: Partial<StoreSettings>) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  resetCatalog: () => void
  /** Katalogu JSON olarak dışa aktarır (yedek / geliştiriciye devretme). */
  exportCatalog: () => string
  /** Dışa aktarılmış JSON'u geri yükler. Geçersizse false döner. */
  importCatalog: (json: string) => boolean
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

function loadState(): CatalogState {
  const stored = readStorage<CatalogState | null>(STORAGE_KEY, null)
  if (!stored || stored.version !== VERSION) return seedState()
  return stored
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(loadState)

  useEffect(() => {
    writeStorage(STORAGE_KEY, state)
  }, [state])

  const patch = useCallback((updater: (prev: CatalogState) => CatalogState) => {
    setState((prev) => updater(prev))
  }, [])

  const upsertList = <T extends { id: string }>(list: T[], item: T): T[] => {
    const index = list.findIndex((entry) => entry.id === item.id)
    if (index === -1) return [...list, item]
    const next = [...list]
    next[index] = item
    return next
  }

  const value = useMemo<CatalogContextValue>(() => {
    const activeCategories = state.categories
      .filter((c) => c.isActive)
      .slice()
      .sort((a, b) => a.order - b.order)

    const activeProducts = state.products
      .filter((p) => p.isActive)
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    const activeCampaigns = state.campaigns.filter((c) => c.isActive)

    return {
      categories: state.categories,
      products: state.products,
      campaigns: state.campaigns,
      settings: state.settings,
      orders: state.orders,
      activeCategories,
      activeProducts,
      activeCampaigns,

      getProduct: (slug) => state.products.find((p) => p.slug === slug),
      getCategory: (id) => state.categories.find((c) => c.id === id),
      productsByCategory: (categoryId) => activeProducts.filter((p) => p.categoryIds.includes(categoryId)),
      countByCategory: (categoryId) => activeProducts.filter((p) => p.categoryIds.includes(categoryId)).length,

      upsertProduct: (product) => patch((prev) => ({ ...prev, products: upsertList(prev.products, product) })),
      deleteProduct: (id) => patch((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) })),
      upsertCategory: (category) => patch((prev) => ({ ...prev, categories: upsertList(prev.categories, category) })),
      /**
       * Kategori silinince ürünler silinmez; yalnızca o filtreden çıkarılır.
       * Hiç kategorisi kalmayan ürün pasife alınır ki menüde kaybolmasın.
       */
      deleteCategory: (id) =>
        patch((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c.id !== id),
          products: prev.products.map((product) => {
            if (!product.categoryIds.includes(id)) return product
            const categoryIds = product.categoryIds.filter((c) => c !== id)
            return { ...product, categoryIds, isActive: categoryIds.length > 0 && product.isActive }
          }),
        })),
      upsertCampaign: (campaign) => patch((prev) => ({ ...prev, campaigns: upsertList(prev.campaigns, campaign) })),
      deleteCampaign: (id) => patch((prev) => ({ ...prev, campaigns: prev.campaigns.filter((c) => c.id !== id) })),
      updateSettings: (settingsPatch) => patch((prev) => ({ ...prev, settings: { ...prev.settings, ...settingsPatch } })),
      addOrder: (order) => patch((prev) => ({ ...prev, orders: [order, ...prev.orders] })),
      updateOrderStatus: (id, status) =>
        patch((prev) => ({
          ...prev,
          orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      resetCatalog: () => {
        removeStorage(STORAGE_KEY)
        setState(seedState())
      },
      exportCatalog: () => JSON.stringify(state, null, 2),
      importCatalog: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<CatalogState>
          if (!Array.isArray(parsed.products) || !Array.isArray(parsed.categories) || !parsed.settings) {
            return false
          }
          setState({
            version: VERSION,
            categories: parsed.categories,
            products: parsed.products,
            campaigns: parsed.campaigns ?? [],
            settings: parsed.settings,
            orders: parsed.orders ?? [],
          })
          return true
        } catch {
          return false
        }
      },
    }
  }, [state, patch])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog, CatalogProvider içinde kullanılmalıdır.')
  return ctx
}
