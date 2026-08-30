import { CampaignCard } from '@/components/campaign/CampaignCard'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { EmptyState } from '@/components/ui/States'
import { useCatalog } from '@/context/CatalogContext'
import { useSeo } from '@/lib/seo'

export default function Campaigns() {
  const { activeCampaigns, activeProducts } = useCatalog()

  useSeo({
    title: 'Kampanyalar | Gönülden Tatlar',
    description:
      'İkili cup menüler, hafta sonu waffle fırsatı ve öğrenci menüsü. Gönülden Tatlar kampanyalarını kaçırma.',
    path: '/kampanyalar',
  })

  const campaignProductIds = new Set(activeCampaigns.flatMap((campaign) => campaign.productIds ?? []))
  const campaignProducts = activeProducts.filter(
    (product) => campaignProductIds.has(product.id) || product.discountPercentage !== undefined,
  )

  return (
    <>
      <header className="border-b border-line bg-blush-50">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blush-500">Kampanyalar</p>
          <h1 className="text-[2rem] leading-tight md:text-[2.75rem]">Tatlı Bir Fırsat Var!</h1>
          <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-muted">
            Birlikte gelenlere, hafta sonuna ve öğrencilere özel menüler. Kampanyalar mağazada ve pakette geçerlidir.
          </p>
        </div>
      </header>

      <Section>
        <div className="container-page">
          {activeCampaigns.length === 0 ? (
            <EmptyState
              emoji="🎁"
              title="Şu anda aktif kampanya yok."
              description="Yeni fırsatlar için Instagram hesabımızı takip edebilirsin."
              action={<ButtonLink to="/menu">Menüyü Keşfet</ButtonLink>}
            />
          ) : (
            <div className="space-y-6">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} id={campaign.slug} className="scroll-mt-28">
                  <CampaignCard campaign={campaign} size="lg" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {campaignProducts.length > 0 && (
        <Section tone="soft">
          <div className="container-page">
            <SectionHeader
              eyebrow="Fırsat ürünleri"
              title="Kampanyalara dahil tatlılar"
              description="Kampanya menülerinde yer alan ve indirimli ürünler."
            />
            <ProductGrid products={campaignProducts} />
          </div>
        </Section>
      )}
    </>
  )
}
