import { MessageCircle } from 'lucide-react'
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { buildContactUrl } from '@/lib/whatsapp'
import { assetUrl } from '@/lib/assets'

export function OrderCTA() {
  const { settings } = useCatalog()

  return (
    <section className="container-page py-14 md:py-20">
      <div className="relative overflow-hidden rounded-2xl bg-cocoa-700 px-6 py-12 text-center md:px-16 md:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 size-64 rounded-full bg-cocoa-600" />
          <div className="absolute -bottom-24 -right-10 size-72 rounded-full bg-cocoa-800/60" />
          <img
            src={assetUrl('/images/hero/hero-shake.svg')}
            alt=""
            width={900}
            height={900}
            loading="lazy"
            className="absolute -right-8 top-1/2 hidden size-64 -translate-y-1/2 rounded-full object-cover opacity-90 shadow-lift lg:block"
          />
        </div>

        <div className="relative mx-auto max-w-xl lg:mx-0 lg:max-w-lg lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blush-200">Sipariş</p>
          <h2 className="mt-3 text-[2rem] leading-tight text-cream-50 md:text-[2.5rem]">
            Tatlı bir mola vermenin tam zamanı.
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-cream-200/80">
            Gönülden Tatlar'dan favorini seç. Gel al ya da paket servis — birkaç dokunuşla sipariş hazır.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink to="/menu" size="lg" variant="accent">
              Menüyü Gör
            </ButtonLink>
            <ButtonAnchor
              href={buildContactUrl(settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="outline"
              onClick={() => track('click_whatsapp', { from: 'cta' })}
              className="border-cream-300/30 bg-transparent text-cream-100 hover:border-cream-300/60 hover:bg-cocoa-600"
            >
              <MessageCircle className="size-4" /> WhatsApp'tan Sipariş Ver
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </section>
  )
}
