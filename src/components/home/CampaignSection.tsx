import { ArrowRight } from 'lucide-react'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useCatalog } from '@/context/CatalogContext'

export function CampaignSection() {
  const { activeCampaigns } = useCatalog()
  const featured = activeCampaigns.slice(0, 3)

  if (featured.length === 0) return null

  return (
    <Section>
      <div className="container-page">
        <SectionHeader
          eyebrow="Kampanyalar"
          title="Tatlı Bir Fırsat Var!"
          description="Birlikte daha tatlı: ikili menüler ve haftaya özel fırsatlar."
          action={
            <ButtonLink to="/kampanyalar" variant="outline">
              Kampanyaları Keşfet <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </Section>
  )
}
