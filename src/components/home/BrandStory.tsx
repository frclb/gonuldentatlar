import { motion } from 'framer-motion'
import { HandHeart, Sprout, Sun } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { assetUrl } from '@/lib/assets'

const pillars = [
  { icon: Sprout, title: 'Taze malzeme', text: 'Meyveler her sabah seçilir, kremalar günlük çırpılır.' },
  { icon: Sun, title: 'Günlük hazırlık', text: 'Waffle hamuru ve soslar her gün yeniden hazırlanır.' },
  { icon: HandHeart, title: 'Özenli sunum', text: 'Her tabak, bize gelen misafire hazırlanır gibi hazırlanır.' },
]

export function BrandStory() {
  return (
    <Section tone="soft">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-xl shadow-card"
            >
              <img
                src={assetUrl('/images/hero/story-1.svg')}
                alt="Günlük hazırlanan waffle hamuru ve taze meyveler"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="absolute -bottom-6 -right-2 w-40 overflow-hidden rounded-lg border-4 border-cream-100 shadow-lift sm:w-48"
            >
              <img
                src={assetUrl('/images/hero/story-2.svg')}
                alt="Taze çilekli cup tatlı"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">Hikayemiz</p>
            <h2 className="text-[1.9rem] leading-tight md:text-[2.4rem]">Her Tatlı Bir Hikâyeden Doğar.</h2>
            <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted">
              Küçük bir mutfakta, sevdiklerimize hazırladığımız tariflerle başladık. Bugün de aynı yerden
              devam ediyoruz: iyi malzeme, sabırlı hazırlık ve ikram ederken hissedilen o küçük heyecan.
            </p>

            <ul className="mt-8 space-y-5">
              {pillars.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-olive-600 shadow-soft">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-[1.02rem]">{title}</h3>
                    <p className="mt-0.5 text-[0.88rem] leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ButtonLink to="/hakkimizda" variant="outline" className="mt-8">
              Hakkımızda
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}
