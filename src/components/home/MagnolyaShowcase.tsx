import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ServingToggle } from '@/components/ui/ServingToggle'
import { useCatalog } from '@/context/CatalogContext'
import { showcaseSlugs } from '@/data/layers'
import { useMagnolyaCards } from '@/hooks/useMagnolyaCards'
import type { Product } from '@/types'

/**
 * Katman vitrini — ana sayfadaki "Öne çıkanlar" bölümünün yerini alır.
 * layers.ts'teki vitrin listesini o sırayla gösterir.
 */
export function MagnolyaShowcase() {
  const { activeProducts } = useCatalog()

  const items = showcaseSlugs
    .map((slug) => activeProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product?.serving))

  // Sunum showcase ile sahne arasında ortak: sahnede kavanoza geçilirse kartlar da geçer
  const { renderCard, stage, jar, changeServing, prefetchJar, preload } = useMagnolyaCards(items, {
    variant: 'strip',
  })

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
              <ServingToggle jar={jar} onIntent={prefetchJar} onChange={changeServing} />
              <ButtonLink to="/menu" variant="outline">
                Tüm menü <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          }
        />

        {/* mobilde yatay kaydırma şeridi, sm+ grid */}
        <div
          {...preload}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {items.map((product, index) => renderCard(product, index))}
        </div>
      </div>

      {stage}
    </Section>
  )
}
