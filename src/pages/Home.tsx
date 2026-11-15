import { useEffect } from 'react'
import { BrandStory } from '@/components/home/BrandStory'
import { CampaignSection } from '@/components/home/CampaignSection'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { Hero } from '@/components/home/Hero'
import { InstagramSection } from '@/components/home/InstagramSection'
import { LocationSection } from '@/components/home/LocationSection'
import { OrderCTA } from '@/components/home/OrderCTA'
import { MagnolyaShowcase } from '@/components/home/MagnolyaShowcase'
import { PopularProducts } from '@/components/home/PopularProducts'
import { ServingCompare } from '@/components/home/ServingCompare'
import { track } from '@/lib/analytics'
import { PAGE_SEO } from '@/data/pageSeo'
import { useSeo } from '@/lib/seo'

export default function Home() {
  useSeo(PAGE_SEO.home)

  useEffect(() => track('view_home'), [])

  return (
    <>
      <Hero />
      <CategoryStrip />
      <MagnolyaShowcase />
      <ServingCompare />
      <CampaignSection />
      <BrandStory />
      <PopularProducts />
      <InstagramSection />
      <LocationSection />
      <OrderCTA />
    </>
  )
}
