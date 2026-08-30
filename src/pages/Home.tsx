import { useEffect } from 'react'
import { BrandStory } from '@/components/home/BrandStory'
import { CampaignSection } from '@/components/home/CampaignSection'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Hero } from '@/components/home/Hero'
import { InstagramSection } from '@/components/home/InstagramSection'
import { LocationSection } from '@/components/home/LocationSection'
import { OrderCTA } from '@/components/home/OrderCTA'
import { PopularProducts } from '@/components/home/PopularProducts'
import { track } from '@/lib/analytics'
import { useSeo } from '@/lib/seo'

export default function Home() {
  useSeo({
    title: 'Gönülden Tatlar | Cup, Waffle ve Tatlılar',
    description:
      "Gönülden Tatlar'ın birbirinden lezzetli cup, waffle, milkshake ve tatlılarını keşfet. Favori tatlılarını kolayca sipariş ver.",
    path: '/',
  })

  useEffect(() => track('view_home'), [])

  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
      <CampaignSection />
      <BrandStory />
      <PopularProducts />
      <InstagramSection />
      <LocationSection />
      <OrderCTA />
    </>
  )
}
