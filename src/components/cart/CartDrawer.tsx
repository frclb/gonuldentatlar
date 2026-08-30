import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/States'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { track } from '@/lib/analytics'
import { formatPrice } from '@/lib/format'
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { CartLine } from './CartLine'

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, itemCount } = useCart()
  const { settings } = useCatalog()
  const navigate = useNavigate()

  const belowMinimum = subtotal > 0 && subtotal < settings.minOrderTotal

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    buildOrderMessage({
      items,
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      deliveryType: 'pickup',
    }),
  )

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={itemCount > 0 ? `Sepetin (${itemCount})` : 'Sepetin'}
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Ara toplam</span>
              <span className="text-[1.05rem] font-semibold text-cocoa-800">{formatPrice(subtotal)}</span>
            </div>

            {belowMinimum && (
              <p className="rounded-md bg-cream-200 px-3 py-2 text-xs text-cocoa-700">
                Paket servis için minimum sipariş tutarı {formatPrice(settings.minOrderTotal)}. Gel al siparişlerde
                alt limit yok.
              </p>
            )}

            <Button
              fullWidth
              size="lg"
              onClick={() => {
                track('start_checkout', { value: subtotal })
                closeCart()
                navigate('/siparis')
              }}
            >
              Siparişi Tamamla
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track('click_whatsapp', { from: 'cart' })}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-olive-200 bg-olive-100 text-[0.95rem] font-semibold text-olive-700 transition-colors hover:bg-olive-200"
            >
              <MessageCircle className="size-4" />
              WhatsApp'tan Sipariş Ver
            </a>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          title="Sepetin biraz tatlıya ihtiyaç duyuyor."
          description="Favorini seç ve sepete ekle."
          action={
            <ButtonLink to="/menu" onClick={closeCart}>
              Menüyü Keşfet
            </ButtonLink>
          }
        />
      ) : (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <CartLine key={item.key} item={item} />
          ))}
        </ul>
      )}
    </Drawer>
  )
}
