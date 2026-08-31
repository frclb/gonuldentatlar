import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/brand/Logo'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { formatPhone } from '@/lib/format'
import { buildContactUrl } from '@/lib/whatsapp'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'

const categoryColumn = {
  title: 'Kategoriler',
  links: [
    { label: 'Çilekli', to: '/menu?kategori=cilekli' },
    { label: 'Çikolatalı', to: '/menu?kategori=cikolatali' },
    { label: 'Kakaolu Bisküvili', to: '/menu?kategori=kakaolu-biskuvili' },
    { label: 'Oreolu', to: '/menu?kategori=oreolu' },
  ],
}

export function Footer() {
  const { settings, activeCampaigns } = useCatalog()
  const { itemCount } = useCart()

  const columns = [
    {
      title: 'Keşfet',
      links: [
        { label: 'Menü', to: '/menu' },
        ...(activeCampaigns.length > 0 ? [{ label: 'Kampanyalar', to: '/kampanyalar' }] : []),
        { label: 'Hakkımızda', to: '/hakkimizda' },
        { label: 'İletişim', to: '/iletisim' },
      ],
    },
    categoryColumn,
  ]
  const today = new Date().getDay()
  const todayHours = settings.hours.find((h) => h.day === today)

  return (
    <footer className="mt-16 bg-cocoa-800 text-cream-200">
      <div
        className={cn(
          'container-page py-14 md:py-16',
          /* mobil sticky sepet çubuğunun altında içerik kalmasın */
          itemCount > 0 && 'pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:pb-16',
        )}
      >
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark tone="light" className="size-10" />
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-cream-100">
                Gönülden Tatlar
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-300/75">
              Her gün taze malzemelerle, gönülden hazırlanan magnolya ve cup tatlılar.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={buildContactUrl(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                onClick={() => track('click_whatsapp', { from: 'footer' })}
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-full bg-cocoa-700 text-cream-100 transition-colors hover:bg-olive-600"
              >
                <MessageCircle className="size-[1.1rem]" />
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={() => track('click_instagram', { from: 'footer' })}
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full bg-cocoa-700 text-cream-100 transition-colors hover:bg-blush-400 hover:text-cocoa-800"
              >
                <Instagram className="size-[1.1rem]" />
              </a>
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                aria-label="Telefon"
                className="grid size-10 place-items-center rounded-full bg-cocoa-700 text-cream-100 transition-colors hover:bg-cream-200 hover:text-cocoa-800"
              >
                <Phone className="size-[1.1rem]" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cream-100">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream-300/75 transition-colors hover:text-blush-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-cream-100">İletişim</h3>
            <ul className="mt-4 space-y-3 text-sm text-cream-300/75">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-olive-300" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-olive-300" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-blush-200">
                  {formatPhone(settings.phone)}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-olive-300" />
                <span>
                  {todayHours && !todayHours.isClosed
                    ? `Bugün ${todayHours.open} – ${todayHours.close}`
                    : 'Bugün kapalıyız'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-cocoa-700 pt-6 text-center text-xs text-cream-300/60 sm:flex-row sm:justify-between sm:text-left">
          <p>Gönülden hazırladık, afiyetle yiyin.</p>
          <p>© {new Date().getFullYear()} Gönülden Tatlar. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
