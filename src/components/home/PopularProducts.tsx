import { Section, SectionHeader } from '@/components/ui/Section'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCatalog } from '@/context/CatalogContext'

export function PopularProducts() {
  const { activeProducts } = useCatalog()
  const popular = activeProducts.filter((p) => p.isPopular).slice(0, 4)

  if (popular.length === 0) return null

  return (
    <Section>
      <div className="container-page">
        <SectionHeader
          eyebrow="Bu hafta"
          title="En çok sipariş edilenler"
          description="Kararsız kaldıysan buradan başlayabilirsin."
        />
        <ProductGrid products={popular} />
      </div>
    </Section>
  )
}
