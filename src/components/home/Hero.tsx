import { motion } from 'framer-motion'
import { Clock, Leaf, Sparkles } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { useCatalog } from '@/context/CatalogContext'
import { assetUrl } from '@/lib/assets'

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const trustPoints = [
  { icon: Leaf, label: 'Günlük taze malzeme' },
  { icon: Clock, label: '20 dk içinde hazır' },
  { icon: Sparkles, label: 'Kendi tatlını tasarla' },
]

export function Hero() {
  const { settings } = useCatalog()

  return (
    <section className="relative overflow-hidden">
      {/* dekoratif zemin */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-32 size-[26rem] rounded-full bg-blush-100/70 blur-[80px]" />
        <div className="absolute -left-32 top-40 size-[22rem] rounded-full bg-olive-100/70 blur-[80px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-cream-100" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-10 py-10 md:grid-cols-[1.05fr_1fr] md:gap-14 md:py-16 lg:py-20">
          <div className="order-2 md:order-1">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-surface/70 px-3.5 py-1.5 text-xs font-semibold text-olive-700 backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-olive-400" />
              Her gün taze hazırlanır
            </motion.p>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.07}
              className="mt-5 text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[4rem]"
            >
              Gönülden
              <br />
              <span className="relative inline-block">
                Tatlar
                <svg
                  viewBox="0 0 200 16"
                  className="absolute -bottom-1.5 left-0 h-3 w-full text-blush-300"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 11c38-8 78-9 116-5s60 6 80 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.14}
              className="mt-6 max-w-md font-[family-name:var(--font-display)] text-xl text-cocoa-600 md:text-[1.4rem]"
            >
              {settings.slogan}
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted"
            >
              Cup tatlılar, çıtır waffle, milkshake ve günlük dondurma. Favorini seç, sosunu ve topping'ini kendin
              belirle — gerisini bize bırak.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.27}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <ButtonLink to="/menu" size="lg">
                Menüyü Keşfet
              </ButtonLink>
              <ButtonLink to="/kampanyalar" size="lg" variant="outline">
                Kampanyalar
              </ButtonLink>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.34}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3"
            >
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-[0.82rem] font-medium text-cocoa-600">
                  <Icon className="size-4 text-olive-500" strokeWidth={2.2} />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* görsel */}
          <div className="relative order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-square w-full max-w-[26rem] md:max-w-none"
            >
              <div className="absolute inset-0 rotate-3 rounded-[38%_62%_55%_45%/45%_38%_62%_55%] bg-cream-200" />
              <img
                src={assetUrl('/images/hero/hero-cup.svg')}
                alt="Lotus cup tatlı — krema, bisküvi kırıkları ve çikolata katmanları"
                width={1100}
                height={1100}
                decoding="sync"
                className="relative size-full rounded-[38%_62%_55%_45%/45%_38%_62%_55%] object-cover"
              />
            </motion.div>

            {/* yüzen mini kartlar */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -left-1 bottom-6 flex items-center gap-2.5 rounded-full bg-surface/90 py-2 pl-2 pr-4 shadow-card backdrop-blur sm:left-2"
            >
              <img
                src={assetUrl('/images/hero/hero-waffle.svg')}
                alt=""
                width={120}
                height={120}
                loading="lazy"
                className="size-11 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="text-[0.8rem] font-semibold text-cocoa-800">Lotus Waffle</p>
                <p className="text-[0.7rem] text-muted">Bu haftanın favorisi</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="absolute -right-1 top-8 rounded-lg bg-surface/90 px-3.5 py-2.5 text-center shadow-card backdrop-blur sm:right-2"
            >
              <p className="font-[family-name:var(--font-display)] text-[1.35rem] leading-none text-cocoa-700">24+</p>
              <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-wider text-muted">tatlı çeşidi</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
