import { useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'

/**
 * Menüdeki her tatlı hem cup hem kavanoz olarak hazırlanıyor ama ikisinin
 * farkını gösteren bir yer yoktu. Aynı diziliş iki sunumda da çekildiği için
 * kareler yan yana konunca fark tek bakışta anlaşılıyor.
 */
const families = [
  { id: 'klasik', label: 'Çilek & Muz', base: 'klasik-uclu' },
  { id: 'karisik', label: 'Karışık', base: 'karisik-dortlu' },
  { id: 'kakaolu', label: 'Kakaolu Bisküvili', base: 'kakaolu-uclu' },
  { id: 'kakaolu-dortlu', label: 'Kakaolu Karışık', base: 'kakaolu-dortlu' },
  { id: 'beyaz', label: 'Beyaz Çikolatalı', base: 'beyaz-cikolatali-uclu' },
  { id: 'oreolu', label: 'Oreolu', base: 'oreolu-uclu' },
  { id: 'cevizli', label: 'Cevizli', base: 'cevizli-ikili' },
]

const servings = [
  {
    id: 'kavanoz',
    name: 'Kavanoz',
    note: 'Cam ve kapaklı. Hediye etmeye, sofraya koymaya ve paylaşmaya uygun.',
  },
  {
    id: 'cup',
    name: 'Cup',
    note: 'Tek kişilik ve kapaklı. Yanında taşıması, ofise ya da yola götürmesi kolay.',
  },
]

export function ServingCompare() {
  const [active, setActive] = useState(families[0])

  return (
    <Section tone="cream">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Sunum"
          title="Cup mu, Kavanoz mu?"
          description="Tarif aynı, sunum sana kalmış. Aşağıdan bir çeşit seç, ikisini yan yana gör."
        />

        <div className="no-scrollbar edge-fade-x -mx-5 mb-8 flex snap-x gap-2 overflow-x-auto px-5 md:mx-0 md:mb-10 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
          {families.map((family) => {
            const isActive = family.id === active.id
            return (
              <button
                key={family.id}
                type="button"
                onClick={() => setActive(family)}
                aria-pressed={isActive}
                className={cn(
                  'shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
                  isActive
                    ? 'border-cocoa-600 bg-cocoa-600 text-cream-50'
                    : 'border-line bg-surface text-cocoa-700 hover:border-cocoa-300 hover:bg-cream-100',
                )}
              >
                {family.label}
              </button>
            )
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {servings.map((serving) => (
            <figure key={serving.id} className="overflow-hidden rounded-xl bg-surface shadow-card">
              <div className="relative">
                <img
                  /* key: çeşit değişince tarayıcı yeni görseli yeniden canlandırsın */
                  key={`${active.base}-${serving.id}`}
                  src={assetUrl(`/images/genel/${active.base}-${serving.id}.webp`)}
                  alt={`${active.label} tatlılar ${serving.name.toLowerCase()} sunumuyla`}
                  width={1600}
                  height={1067}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full animate-[gallery-fade_320ms_ease-out] object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-cream-50/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-cocoa-700 shadow-soft">
                  {serving.name}
                </span>
              </div>
              <figcaption className="p-5 text-[0.92rem] leading-relaxed text-muted md:p-6">
                {serving.note}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-9 text-center">
          <ButtonLink to="/menu" variant="outline">
            Menüde Hepsini Gör
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
