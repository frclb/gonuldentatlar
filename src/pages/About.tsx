import { HandHeart, Sparkles, Sprout, Sun } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useSeo } from '@/lib/seo'
import { assetUrl } from '@/lib/assets'

const values = [
  {
    icon: Sprout,
    title: 'İyi malzeme',
    text: 'Meyveleri her sabah seçiyor, kremaları günlük çırpıyoruz. Kısayol yok.',
  },
  {
    icon: Sun,
    title: 'Günlük hazırlık',
    text: 'Krema, bisküvi katmanları ve soslar her gün yeniden hazırlanır.',
  },
  {
    icon: HandHeart,
    title: 'Özenli sunum',
    text: 'Her tabağı, evimize gelen misafire hazırlıyormuş gibi hazırlıyoruz.',
  },
  {
    icon: Sparkles,
    title: 'Her damak zevkine',
    text: 'Çilekli, muzlu, çikolatalı, bisküvili — 23 çeşit arasından seç.',
  },
]

export default function About() {
  useSeo({
    title: 'Hakkımızda | Gönülden Tatlar',
    description:
      'Gönülden Tatlar; taze malzeme, günlük hazırlık ve özenli sunumla hazırlanan magnolya ve cup tatlılar.',
    path: '/hakkimizda',
  })

  return (
    <>
      <header className="border-b border-line bg-cream-100">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">Hakkımızda</p>
          <h1 className="max-w-2xl text-[2rem] leading-tight md:text-[2.75rem]">
            Gönülden Hazırlıyoruz.
          </h1>
          <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted">
            Küçük bir mutfakta, sevdiklerimize hazırladığımız tariflerle başladık. Bugün de aynı yerden devam
            ediyoruz.
          </p>
        </div>
      </header>

      <Section>
        <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={assetUrl('/images/products/lotuslu-magnolya.webp')}
              alt="Lotuslu magnolya"
              width={800}
              height={800}
              loading="lazy"
              className="aspect-[3/4] w-full rounded-xl object-cover shadow-soft"
            />
            <img
              src={assetUrl('/images/products/cilekli-cikolatali-cup.webp')}
              alt="Çilekli çikolatalı cup"
              width={800}
              height={800}
              loading="lazy"
              className="mt-8 aspect-[3/4] w-full rounded-xl object-cover shadow-soft"
            />
          </div>

          <div>
            <h2 className="text-[1.75rem] leading-tight md:text-[2.1rem]">Her Lokmada Gönülden Bir Dokunuş.</h2>
            <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-muted">
              <p>
                Gönülden Tatlar, tatlının sadece bir tarif değil, bir paylaşma biçimi olduğuna inanan küçük bir
                ekiple kuruldu. İlk magnolyamızı komşularımıza ikram ettik; bugün aynı özenle hazırlıyoruz.
              </p>
              <p>
                Menümüzü sade tutuyoruz: iyi yaptığımız işi, iyi malzemeyle yapmak. Çikolatayı erittiğimiz
                tencere de, çilekleri ayıkladığımız tezgâh da her gün aynı saatte hazır oluyor.
              </p>
              <p>Bize uğradığında bunu tabakta göreceksin.</p>
            </div>
            <ButtonLink to="/menu" size="lg" className="mt-8">
              Menüyü Keşfet
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="soft">
        <div className="container-page">
          <SectionHeader eyebrow="Değerlerimiz" title="Neye önem veriyoruz?" align="center" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl bg-surface p-6 shadow-soft">
                <span className="grid size-11 place-items-center rounded-full bg-olive-100 text-olive-600">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-[1.05rem]">{title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
