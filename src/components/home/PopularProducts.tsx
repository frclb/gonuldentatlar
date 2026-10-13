import { ProductGrid } from '@/components/product/ProductGrid'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useCatalog } from '@/context/CatalogContext'
import { useMagnolyaCards } from '@/hooks/useMagnolyaCards'

export function PopularProducts() {
  const { activeProducts } = useCatalog()
  const popular = activeProducts.filter((p) => p.isPopular).slice(0, 4)
  // Katmanlı kartlar: üzerine gelince katmanlar, tıklayınca vitrindeki sahne
  const { renderCard, stage, preload } = useMagnolyaCards(popular)

  if (popular.length === 0) return null

  return (
    <Section>
      <div className="container-page">
        <SectionHeader
          eyebrow="Bu hafta"
          title="En çok sipariş edilenler"
          description="Kararsız kaldıysan buradan başlayabilirsin."
        />
        <div {...preload}>
          <ProductGrid products={popular} renderCard={renderCard} />
        </div>
      </div>
      {stage}
    </Section>
  )
}
