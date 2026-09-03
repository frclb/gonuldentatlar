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
import { ServingCompare } from '@/components/home/ServingCompare'
import { track } from '@/lib/analytics'
import { useSeo } from '@/lib/seo'

export default function Home() {
  useSeo({
    title: 'Gönülden Tatlar | Magnolya ve Cup Tatlılar',
    description:
      "Gönülden Tatlar'ın taze meyveli, bisküvili ve çikolatalı magnolya ile cup tatlılarını keşfet. Favorini seç, WhatsApp'tan kolayca sipariş ver.",
    path: '/',
  })

  useEffect(() => track('view_home'), [])

  return (
    <>
      <Hero />
      <CategoryStrip />
      <FeaturedProducts />
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
