import type { OrderStatus } from '@/types'

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'Bekliyor',
  CONFIRMED: 'Onaylandı',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  OUT_FOR_DELIVERY: 'Yolda',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
}

export const orderStatusOrder: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
]

export const orderStatusTones: Record<OrderStatus, string> = {
  PENDING: 'bg-cream-200 text-cocoa-700',
  CONFIRMED: 'bg-olive-100 text-olive-700',
  PREPARING: 'bg-blush-100 text-blush-500',
  READY: 'bg-olive-200 text-olive-700',
  OUT_FOR_DELIVERY: 'bg-cocoa-100 text-cocoa-700',
  COMPLETED: 'bg-olive-500 text-white',
  CANCELLED: 'bg-cream-300 text-muted',
}
