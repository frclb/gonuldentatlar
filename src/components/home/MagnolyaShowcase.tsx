import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { MagnolyaCard } from '@/components/product/MagnolyaCard'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ServingToggle } from '@/components/ui/ServingToggle'
import { useCatalog } from '@/context/CatalogContext'
import { layeredSlugs } from '@/data/layers'

/**
 * Katman vitrini — ana sayfadaki "Öne çıkanlar" bölümünün yerini alır.
 * Yalnızca katman haritası ölçülmüş ürünleri, layers.ts'teki sırayla gösterir.
 */
export function MagnolyaShowcase() {
  const { activeProducts } = useCatalog()
  const [jar, setJar] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  // Bir kez açıldıktan sonra kapanmaz: kavanoz katmanı DOM'da kalsın ki
  // ileri geri geçişlerde dolum animasyonu tekrar beklemesin
  const [jarMounted, setJarMounted] = useState(false)

  const items = layeredSlugs
    .map((slug) => activeProducts.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.serving))

  if (items.length === 0) return null

  return (
    <Section tone="soft">
      <div className="container-page">
        <SectionHeader
          eyebrow="Magnolya"
          title="Katman katman mutluluk"
          description="Üzerine gel ya da dokun — her magnolyanın katmanlarını tek tek gör."
          action={
            <div className="flex flex-wrap items-center gap-3">
              <ServingToggle
                jar={jar}
                onIntent={() => setJarMounted(true)}
                onChange={(value) => {
                  setJarMounted(true)
                  setJar(value)
                }}
              />
              <ButtonLink to="/menu" variant="outline">
                Tüm menü <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          }
        />

        {/* mobilde yatay kaydırma şeridi, sm+ grid */}
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
          {items.map((product, index) => (
            <MagnolyaCard
              key={product.id}
              product={product}
              index={index}
              jarMode={jar}
              mountJar={jarMounted}
              active={activeId === product.id}
              onActive={(value) => setActiveId(value ? product.id : null)}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
