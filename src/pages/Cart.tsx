import { MessageCircle } from 'lucide-react'
import { CartLine } from '@/components/cart/CartLine'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { EmptyState } from '@/components/ui/States'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { formatPrice } from '@/lib/format'
import { useSeo } from '@/lib/seo'
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const { settings } = useCatalog()
  const navigate = useNavigate()

  useSeo({
    title: 'Sepetim | Gönülden Tatlar',
    description: 'Sepetindeki tatlıları gözden geçir ve siparişini tamamla.',
    path: '/sepet',
  })

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    buildOrderMessage({
      items,
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      deliveryType: 'pickup',
      showPrices: settings.showPrices,
    }),
  )

  return (
    <Section>
      <div className="container-page">
        <h1 className="text-[2rem] leading-tight md:text-[2.5rem]">Sepetin</h1>

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Sepetin şu anda boş 🍓"
              description="Favorini seç ve sepete ekle."
              action={<ButtonLink to="/menu">Menüyü Keşfet</ButtonLink>}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <div>
              <ul className="divide-y divide-line rounded-xl bg-surface px-5 shadow-soft">
                {items.map((item) => (
                  <CartLine key={item.key} item={item} />
                ))}
              </ul>
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 text-sm font-medium text-muted underline-offset-4 hover:text-[var(--color-error)] hover:underline"
              >
                Sepeti boşalt
              </button>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl bg-surface p-6 shadow-soft">
                <h2 className="text-lg">Sipariş özeti</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-muted">
                    <dt>Ürünler</dt>
                    <dd className="font-medium text-cocoa-800">{itemCount} adet</dd>
                  </div>
                  <div className="flex justify-between text-muted">
                    <dt>Teslimat</dt>
                    <dd>Sonraki adımda</dd>
                  </div>
                  {settings.showPrices && (
                    <div className="flex items-baseline justify-between border-t border-line pt-3">
                      <dt className="text-[0.95rem] font-semibold text-cocoa-800">Toplam</dt>
                      <dd className="text-xl font-semibold text-cocoa-800">{formatPrice(subtotal)}</dd>
                    </div>
                  )}
                </dl>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-6"
                  onClick={() => {
                    track('start_checkout', { value: subtotal })
                    navigate('/siparis')
                  }}
                >
                  Siparişi Tamamla
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('click_whatsapp', { from: 'cart-page' })}
                  className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-olive-200 bg-olive-100 text-[0.95rem] font-semibold text-olive-700 transition-colors hover:bg-olive-200"
                >
                  <MessageCircle className="size-4" /> WhatsApp'tan Sipariş Ver
                </a>

                <p className="mt-4 text-center text-[0.78rem] text-muted">
                  {settings.showPrices
                    ? `Paket serviste minimum sipariş ${formatPrice(settings.minOrderTotal)}.`
                    : 'Tutar siparişin onaylanırken iletilir.'}
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Section>
  )
}
