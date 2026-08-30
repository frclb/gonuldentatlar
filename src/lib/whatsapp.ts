import type { CartItem, Customer, DeliveryType, Address } from '@/types'
import { formatPrice } from './format'

export interface WhatsAppOrderPayload {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  deliveryType: DeliveryType
  customer?: Partial<Customer>
  address?: Partial<Address>
  note?: string
  /** Fiyatlar sitede gizliyse mesajda da tutar yazılmaz. */
  showPrices?: boolean
}

const deliveryLabel: Record<DeliveryType, string> = {
  pickup: 'Gel Al',
  delivery: 'Paket Servis',
}

/** Sepetteki seçenekleri tek satırlık okunur bir özete çevirir. */
export function optionsSummary(item: CartItem): string {
  return item.selectedOptions
    .filter((o) => o.valueNames.length > 0)
    .map((o) => `${o.optionName}: ${o.valueNames.join(', ')}`)
    .join(' · ')
}

/** Sepeti WhatsApp mesaj gövdesine dönüştürür. */
export function buildOrderMessage(payload: WhatsAppOrderPayload): string {
  const { items, subtotal, deliveryFee, total, deliveryType, customer, address, note, showPrices = true } = payload

  const lines: string[] = ['Merhaba Gönülden Tatlar,', '', 'sipariş vermek istiyorum.', '']

  for (const item of items) {
    const price = showPrices ? ` — ${formatPrice(item.unitPrice * item.quantity)}` : ''
    lines.push(`${item.quantity} x ${item.name}${price}`)
    const summary = optionsSummary(item)
    if (summary) lines.push(`   ${summary}`)
    if (item.note) lines.push(`   Not: ${item.note}`)
  }

  if (showPrices) {
    lines.push('', `Ara toplam: ${formatPrice(subtotal)}`)
    if (deliveryFee > 0) lines.push(`Teslimat: ${formatPrice(deliveryFee)}`)
    lines.push(`Toplam: ${formatPrice(total)}`)
  } else {
    lines.push('', 'Tutarı iletebilir misiniz?')
  }

  lines.push('', `Teslimat: ${deliveryLabel[deliveryType]}`)

  if (customer?.fullName) lines.push('', `Ad Soyad: ${customer.fullName}`)
  if (customer?.phone) lines.push(`Telefon: ${customer.phone}`)

  if (deliveryType === 'delivery' && address?.fullAddress) {
    lines.push(`Adres: ${address.fullAddress}`)
    if (address.directions) lines.push(`Adres tarifi: ${address.directions}`)
  }

  if (note) lines.push('', `Not: ${note}`)

  return lines.join('\n')
}

/** wa.me linki üretir. Numara .env üzerinden gelir, koda gömülmez. */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** Sepetsiz, genel "bilgi almak istiyorum" mesajı. */
export function buildContactUrl(phone: string, message = 'Merhaba Gönülden Tatlar, bilgi almak istiyorum.'): string {
  return buildWhatsAppUrl(phone, message)
}
