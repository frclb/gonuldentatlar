import { Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { ButtonAnchor } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { formatPhone } from '@/lib/format'
import { buildContactUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'

export function LocationSection() {
  const { settings } = useCatalog()
  const today = new Date().getDay()

  return (
    <Section tone="soft" id="lokasyon">
      <div className="container-page">
        <SectionHeader eyebrow="Bizi ziyaret et" title="Tatlı molan burada başlıyor." />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Harita alanı — ileride Google Maps embed ile değiştirilebilir */}
          <a
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('click_location', { from: 'home' })}
            className="group relative min-h-[18rem] overflow-hidden rounded-xl bg-olive-100 shadow-soft"
            aria-label="Konumu haritada aç"
          >
            <svg viewBox="0 0 800 480" className="absolute inset-0 size-full" aria-hidden>
              <rect width="800" height="480" fill="#e8ecda" />
              <g stroke="#d2dab9" strokeWidth="14" fill="none">
                <path d="M-20 120h840M-20 300h840M170 -20v520M470 -20v520M640 -20v520" />
              </g>
              <g fill="#f4f6ee">
                <rect x="200" y="150" width="230" height="120" rx="10" />
                <rect x="500" y="40" width="110" height="230" rx="10" />
                <rect x="60" y="330" width="90" height="120" rx="10" />
                <rect x="500" y="330" width="120" height="120" rx="10" />
              </g>
              <path d="M170 300 Q300 260 470 300 T800 260" stroke="#b5c194" strokeWidth="20" fill="none" />
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <span className="grid size-12 place-items-center rounded-full bg-cocoa-600 text-cream-50 shadow-lift transition-transform duration-300 group-hover:-translate-y-1">
                <MapPin className="size-6" />
              </span>
              <span className="mx-auto mt-1 block size-2 rounded-full bg-cocoa-800/25" />
            </div>

            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-cocoa-700 shadow-soft">
              <Navigation className="size-4" /> Konumu Gör
            </span>
          </a>

          <div className="rounded-xl bg-surface p-6 shadow-soft md:p-8">
            <h3 className="text-xl">{settings.name}</h3>
            <p className="mt-1.5 flex items-start gap-2 text-[0.92rem] leading-relaxed text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-olive-500" />
              {settings.address}
            </p>

            <div className="mt-6 space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-cocoa-700">
                <Clock className="size-4 text-olive-500" /> Çalışma saatleri
              </p>
              <ul className="mt-2 divide-y divide-line text-sm">
                {settings.hours.map((hour) => (
                  <li
                    key={hour.day}
                    className={cn(
                      'flex items-center justify-between py-2',
                      hour.day === today ? 'font-semibold text-cocoa-800' : 'text-muted',
                    )}
                  >
                    <span>{hour.label}</span>
                    <span className="tabular-nums">
                      {hour.isClosed ? 'Kapalı' : `${hour.open} – ${hour.close}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <ButtonAnchor href={`tel:${settings.phone.replace(/\s/g, '')}`} variant="outline" size="sm">
                <Phone className="size-4" /> {formatPhone(settings.phone)}
              </ButtonAnchor>
              <ButtonAnchor
                href={buildContactUrl(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="sm"
                onClick={() => track('click_whatsapp', { from: 'location' })}
              >
                <MessageCircle className="size-4" /> WhatsApp
              </ButtonAnchor>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
