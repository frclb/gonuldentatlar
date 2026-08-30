import { Check, MessageCircle, ShoppingBag, Store, Truck } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Field'
import { Section } from '@/components/ui/Section'
import { EmptyState } from '@/components/ui/States'
import { useCart } from '@/context/CartContext'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { multiply, subtract, sum } from '@/lib/money'
import { useSeo } from '@/lib/seo'
import { buildOrderMessage, buildWhatsAppUrl, optionsSummary } from '@/lib/whatsapp'
import type { DeliveryType, Order } from '@/types'
import { assetUrl } from '@/lib/assets'

interface FormState {
  fullName: string
  phone: string
  address: string
  directions: string
  note: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = { fullName: '', phone: '', address: '', directions: '', note: '' }

const deliveryOptions: { id: DeliveryType; label: string; description: string; icon: typeof Store }[] = [
  { id: 'pickup', label: 'Gel Al', description: 'Mağazadan teslim al', icon: Store },
  { id: 'delivery', label: 'Paket Servis', description: 'Adresine getirelim', icon: Truck },
]

export default function Checkout() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const { settings, addOrder } = useCatalog()
  const { notify } = useToast()

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [placedMessage, setPlacedMessage] = useState('')

  useSeo({
    title: 'Siparişi Tamamla | Gönülden Tatlar',
    description: 'Teslimat yöntemini seç, bilgilerini gir ve siparişini tamamla.',
    path: '/siparis',
  })

  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup') return 0
    if (subtotal >= settings.freeDeliveryOver) return 0
    return settings.deliveryFee
  }, [deliveryType, subtotal, settings])

  const total = sum(subtotal, deliveryFee)
  const belowMinimum = deliveryType === 'delivery' && subtotal < settings.minOrderTotal
  const missingForMinimum = subtract(settings.minOrderTotal, subtotal)

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Adını yazar mısın?'
    if (form.phone.replace(/\D/g, '').length < 10) next.phone = 'Geçerli bir telefon numarası gir.'
    if (deliveryType === 'delivery' && form.address.trim().length < 10) {
      next.address = 'Adresini biraz daha açık yazar mısın?'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const createOrder = (): Order => {
    const now = new Date()
    const code = `GT-${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate(),
    ).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

    return {
      id: `order-${now.getTime()}`,
      code,
      createdAt: now.toISOString(),
      status: 'PENDING',
      deliveryType,
      customer: { fullName: form.fullName.trim(), phone: form.phone.trim() },
      address:
        deliveryType === 'delivery'
          ? { fullAddress: form.address.trim(), directions: form.directions.trim() || undefined }
          : undefined,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        optionsSummary: optionsSummary(item),
        note: item.note,
      })),
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      note: form.note.trim() || undefined,
      channel: 'whatsapp',
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      notify('Lütfen eksik alanları tamamla.', 'error')
      return
    }
    if (belowMinimum) {
      notify(`Paket servis için minimum tutar ${formatPrice(settings.minOrderTotal)}.`, 'error')
      return
    }

    const order = createOrder()
    const message = buildOrderMessage({
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryType,
      customer: order.customer,
      address: order.address,
      note: order.note,
    })

    addOrder(order)
    track('complete_order', { orderId: order.id, value: total, deliveryType })
    window.open(buildWhatsAppUrl(settings.whatsapp, message), '_blank', 'noopener')

    setPlacedOrder(order)
    setPlacedMessage(message)
    clearCart()
    notify('Sipariş oluşturuldu')
  }

  /* -------------------------------------------------------------- Başarı */
  if (placedOrder) {
    return (
      <Section>
        <div className="container-page max-w-xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-olive-100 text-olive-600">
            <Check className="size-8" strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-[1.9rem] leading-tight md:text-[2.3rem]">Siparişin bize ulaştı!</h1>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
            Sipariş numaran <strong className="font-semibold text-cocoa-800">{placedOrder.code}</strong>. WhatsApp
            penceresi açılmadıysa aşağıdaki butondan tekrar deneyebilirsin.
          </p>

          <div className="mt-8 rounded-xl bg-surface p-6 text-left shadow-soft">
            <ul className="divide-y divide-line text-sm">
              {placedOrder.items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex justify-between gap-4 py-2.5">
                  <span className="text-cocoa-700">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium text-cocoa-800">
                    {formatPrice(multiply(item.unitPrice, item.quantity))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4">
              <span className="font-semibold text-cocoa-800">Toplam</span>
              <span className="text-lg font-semibold text-cocoa-800">{formatPrice(placedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonAnchor
              href={buildWhatsAppUrl(settings.whatsapp, placedMessage)}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="whatsapp"
            >
              <MessageCircle className="size-4" /> WhatsApp'ı tekrar aç
            </ButtonAnchor>
            <ButtonLink to="/menu" size="lg">
              Menüye Dön
            </ButtonLink>
            <ButtonLink to="/" size="lg" variant="outline">
              Ana Sayfa
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-muted">Afiyetle, Gönülden Tatlar.</p>
        </div>
      </Section>
    )
  }

  /* ---------------------------------------------------------- Boş sepet */
  if (items.length === 0) {
    return (
      <Section>
        <div className="container-page">
          <EmptyState
            title="Sepetin şu anda boş 🍓"
            description="Siparişe geçmek için önce birkaç tatlı seçelim."
            action={<ButtonLink to="/menu">Menüyü Keşfet</ButtonLink>}
          />
        </div>
      </Section>
    )
  }

  /* ------------------------------------------------------------- Form */
  return (
    <Section>
      <div className="container-page">
        <nav aria-label="Konum" className="text-[0.8rem] text-muted">
          <Link to="/sepet" className="hover:text-cocoa-700">
            Sepet
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-cocoa-700">Sipariş bilgileri</span>
        </nav>

        <h1 className="mt-3 text-[2rem] leading-tight md:text-[2.5rem]">Siparişi Tamamla</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div className="space-y-8">
            {/* teslimat yöntemi */}
            <fieldset>
              <legend className="text-[1.05rem] font-semibold text-cocoa-800">Teslimat yöntemi</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {deliveryOptions.map(({ id, label, description, icon: Icon }) => {
                  const isActive = deliveryType === id
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setDeliveryType(id)}
                      className={cn(
                        'flex items-center gap-3.5 rounded-lg border-2 bg-surface p-4 text-left transition-colors duration-200',
                        isActive ? 'border-cocoa-500 shadow-soft' : 'border-line hover:border-cocoa-200',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-11 shrink-0 place-items-center rounded-full',
                          isActive ? 'bg-cocoa-600 text-cream-50' : 'bg-cream-200 text-cocoa-600',
                        )}
                      >
                        <Icon className="size-5" strokeWidth={2} />
                      </span>
                      <span>
                        <span className="block text-[0.98rem] font-semibold text-cocoa-800">{label}</span>
                        <span className="mt-0.5 block text-[0.8rem] text-muted">{description}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* iletişim bilgileri */}
            <fieldset className="space-y-5">
              <legend className="text-[1.05rem] font-semibold text-cocoa-800">İletişim bilgilerin</legend>
              <Input
                label="Ad Soyad"
                required
                autoComplete="name"
                value={form.fullName}
                error={errors.fullName}
                onChange={(event) => update('fullName', event.target.value)}
              />
              <Input
                label="Telefon"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0532 123 45 67"
                value={form.phone}
                error={errors.phone}
                onChange={(event) => update('phone', event.target.value)}
              />

              {deliveryType === 'delivery' && (
                <>
                  <Textarea
                    label="Adres"
                    required
                    rows={3}
                    autoComplete="street-address"
                    placeholder="Mahalle, sokak, bina ve daire no"
                    value={form.address}
                    error={errors.address}
                    onChange={(event) => update('address', event.target.value)}
                  />
                  <Input
                    label="Adres tarifi"
                    placeholder="Örn: eczanenin yanı, 3. kat"
                    value={form.directions}
                    onChange={(event) => update('directions', event.target.value)}
                  />
                </>
              )}

              <Textarea
                label="Sipariş notu"
                rows={3}
                placeholder="Eklemek istediğin bir şey var mı?"
                value={form.note}
                onChange={(event) => update('note', event.target.value)}
              />
            </fieldset>
          </div>

          {/* özet */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-surface p-6 shadow-soft">
              <h2 className="text-lg">Sipariş özeti</h2>

              <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3">
                    <img
                      src={assetUrl(item.image)}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-md bg-cream-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cocoa-800">
                        {item.quantity} × {item.name}
                      </p>
                      {optionsSummary(item) && (
                        <p className="truncate text-[0.75rem] text-muted">{optionsSummary(item)}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-medium text-cocoa-800">
                      {formatPrice(multiply(item.unitPrice, item.quantity))}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>Ara toplam ({itemCount} ürün)</dt>
                  <dd className="font-medium text-cocoa-800">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>Teslimat</dt>
                  <dd className="font-medium text-cocoa-800">
                    {deliveryType === 'pickup'
                      ? 'Gel al'
                      : deliveryFee === 0
                        ? 'Ücretsiz'
                        : formatPrice(deliveryFee)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-[0.95rem] font-semibold text-cocoa-800">Toplam</dt>
                  <dd className="text-xl font-semibold text-cocoa-800">{formatPrice(total)}</dd>
                </div>
              </dl>

              {belowMinimum && (
                <p className="mt-4 rounded-md bg-blush-50 px-3.5 py-2.5 text-[0.8rem] text-[var(--color-error)]">
                  Paket servis için {formatPrice(missingForMinimum)} daha eklemen gerekiyor.
                </p>
              )}

              {deliveryType === 'delivery' && deliveryFee > 0 && !belowMinimum && (
                <p className="mt-4 rounded-md bg-cream-200 px-3.5 py-2.5 text-[0.8rem] text-cocoa-700">
                  {formatPrice(settings.freeDeliveryOver)} ve üzeri siparişlerde teslimat ücretsiz.
                </p>
              )}

              <Button type="submit" fullWidth size="lg" className="mt-6" disabled={belowMinimum}>
                <ShoppingBag className="size-[1.15rem]" />
                Siparişi Tamamla
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.78rem] text-muted">
                <MessageCircle className="size-3.5 text-olive-500" />
                Siparişin WhatsApp üzerinden bize iletilir.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </Section>
  )
}
