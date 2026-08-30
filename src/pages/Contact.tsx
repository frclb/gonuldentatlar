import { Clock, Instagram, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { LocationSection } from '@/components/home/LocationSection'
import { Button, ButtonAnchor } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { Section } from '@/components/ui/Section'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { track } from '@/lib/analytics'
import { formatPhone } from '@/lib/format'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { useSeo } from '@/lib/seo'

interface FormErrors {
  name?: string
  phone?: string
  message?: string
}

export default function Contact() {
  const { settings } = useCatalog()
  const { notify } = useToast()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})

  useSeo({
    title: 'İletişim | Gönülden Tatlar',
    description:
      'Gönülden Tatlar adres, telefon, WhatsApp ve çalışma saatleri. Sorularını bize buradan iletebilirsin.',
    path: '/iletisim',
  })

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (form.name.trim().length < 2) next.name = 'Adını yazar mısın?'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Geçerli bir telefon numarası gir.'
    if (form.message.trim().length < 5) next.message = 'Mesajını biraz açar mısın?'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    const message = `Merhaba Gönülden Tatlar,\n\n${form.message.trim()}\n\nAd Soyad: ${form.name.trim()}\nTelefon: ${form.phone.trim()}`
    track('click_whatsapp', { from: 'contact-form' })
    window.open(buildWhatsAppUrl(settings.whatsapp, message), '_blank', 'noopener')
    notify('Mesajın WhatsApp üzerinden iletiliyor')
    setForm({ name: '', phone: '', message: '' })
  }

  const contactCards = [
    {
      icon: MapPin,
      title: 'Adres',
      value: settings.address,
      href: settings.mapsUrl,
      cta: 'Haritada aç',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: formatPhone(settings.phone),
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
      cta: 'Ara',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: settings.instagramHandle,
      href: settings.instagram,
      cta: 'Takip et',
    },
  ]

  return (
    <>
      <header className="border-b border-line bg-cream-100">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">İletişim</p>
          <h1 className="text-[2rem] leading-tight md:text-[2.75rem]">Bize ulaş</h1>
          <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-muted">
            Sipariş, rezervasyon ya da özel gün siparişleri için en hızlı yol WhatsApp.
          </p>
        </div>
      </header>

      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div className="space-y-4">
            {contactCards.map(({ icon: Icon, title, value, href, cta }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-start gap-4 rounded-xl bg-surface p-5 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream-200 text-cocoa-600">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-cocoa-800">{title}</p>
                  <p className="mt-0.5 text-[0.9rem] leading-relaxed text-muted">{value}</p>
                  <p className="mt-1.5 text-[0.78rem] font-semibold text-olive-600">{cta} →</p>
                </div>
              </a>
            ))}

            <div className="rounded-xl bg-olive-100 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-olive-700">
                <Clock className="size-4" /> Çalışma saatleri
              </p>
              <ul className="mt-3 space-y-1.5 text-[0.88rem] text-olive-700/80">
                {settings.hours.map((hour) => (
                  <li key={hour.day} className="flex justify-between">
                    <span>{hour.label}</span>
                    <span className="tabular-nums">
                      {hour.isClosed ? 'Kapalı' : `${hour.open} – ${hour.close}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-surface p-6 shadow-soft md:p-8">
            <h2 className="text-[1.4rem]">Mesaj gönder</h2>
            <p className="mt-1.5 text-[0.9rem] text-muted">
              Formu doldur, mesajın WhatsApp üzerinden bize ulaşsın.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <Input
                label="Ad Soyad"
                required
                value={form.name}
                error={errors.name}
                autoComplete="name"
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Input
                label="Telefon"
                required
                type="tel"
                inputMode="tel"
                placeholder="0532 123 45 67"
                value={form.phone}
                error={errors.phone}
                autoComplete="tel"
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <Textarea
                label="Mesajın"
                required
                rows={5}
                value={form.message}
                error={errors.message}
                placeholder="Nasıl yardımcı olabiliriz?"
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              />

              <div className="flex flex-wrap gap-3">
                <Button type="submit" size="lg">
                  <Send className="size-4" /> Gönder
                </Button>
                <ButtonAnchor
                  href={buildWhatsAppUrl(settings.whatsapp, 'Merhaba Gönülden Tatlar, bilgi almak istiyorum.')}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="size-4" /> Direkt WhatsApp
                </ButtonAnchor>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <LocationSection />
    </>
  )
}
