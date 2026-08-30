import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ProductGrid } from '@/components/product/ProductGrid'
import { useCatalog } from '@/context/CatalogContext'

export function FeaturedProducts() {
  const { activeProducts } = useCatalog()
  const featured = activeProducts.filter((p) => p.isFeatured).slice(0, 8)

  if (featured.length === 0) return null

  return (
    <Section tone="soft">
      <div className="container-page">
        <SectionHeader
          eyebrow="Öne çıkanlar"
          title="Gönülden Gelen Favoriler"
          description="En çok sevilen tatlarımızı keşfet."
          action={
            <ButtonLink to="/menu" variant="outline">
              Tüm menü <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <ProductGrid products={featured} />
      </div>
    </Section>
  )
}
