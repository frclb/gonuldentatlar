import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useCatalog } from '@/context/CatalogContext'
import { cn } from '@/lib/cn'
import type { Category } from '@/types'
import { assetUrl } from '@/lib/assets'

const tones: Record<Category['tone'], string> = {
  cocoa: 'bg-cocoa-100',
  olive: 'bg-olive-100',
  blush: 'bg-blush-100',
  cream: 'bg-cream-200',
}

export function CategoryStrip() {
  const { activeCategories, countByCategory } = useCatalog()

  return (
    <Section className="pt-4 md:pt-8">
      <div className="container-page">
        <SectionHeader
          eyebrow="Kategoriler"
          title="Bugün canın ne çekiyor?"
          description="Kategorini seç, sana en yakın tatlıyı bulalım."
        />
      </div>

      <div className="no-scrollbar edge-fade-x flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 md:mx-auto md:max-w-7xl md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:px-8 lg:grid-cols-7 xl:px-10">
        {activeCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="w-[8.5rem] shrink-0 snap-start md:w-auto"
          >
            <Link
              to={`/menu?kategori=${category.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div
                className={cn(
                  'relative w-full overflow-hidden rounded-lg p-2 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-translate-y-1',
                  tones[category.tone],
                )}
              >
                <img
                  src={assetUrl(category.image)}
                  alt=""
                  width={640}
                  height={640}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-[1.02rem] font-semibold text-cocoa-800">
                  {category.name}
                </p>
                <p className="mt-0.5 text-[0.72rem] text-muted">{countByCategory(category.id)} ürün</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
