import { Eye, Store, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/States'
import { useCatalog } from '@/context/CatalogContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/cn'
import { formatDateTime, formatPhone, formatPrice } from '@/lib/format'
import { multiply } from '@/lib/money'
import { orderStatusLabels, orderStatusOrder, orderStatusTones } from '@/lib/orderStatus'
import type { DeliveryType, Order, OrderStatus } from '@/types'
import { AdminHeader, Td, TableWrap, Th } from './components'

const ranges = [
  { id: 'today', label: 'Bugün', days: 0 },
  { id: '7', label: 'Son 7 gün', days: 7 },
  { id: '30', label: 'Son 30 gün', days: 30 },
  { id: 'all', label: 'Tümü', days: Infinity },
] as const

export function AdminOrders() {
  const { orders, updateOrderStatus } = useCatalog()
  const { notify } = useToast()
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL')
  const [delivery, setDelivery] = useState<DeliveryType | 'ALL'>('ALL')
  const [range, setRange] = useState<(typeof ranges)[number]['id']>('all')
  const [detail, setDetail] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const selected = ranges.find((entry) => entry.id === range)!
    const threshold = selected.days === Infinity ? -Infinity : startOfToday - selected.days * 86_400_000

    return orders.filter((order) => {
      if (status !== 'ALL' && order.status !== status) return false
      if (delivery !== 'ALL' && order.deliveryType !== delivery) return false
      return new Date(order.createdAt).getTime() >= threshold
    })
  }, [orders, status, delivery, range])

  return (
    <div>
      <AdminHeader title="Siparişler" description={`${filtered.length} sipariş listeleniyor`} />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Select label="Durum" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | 'ALL')}>
          <option value="ALL">Tümü</option>
          {orderStatusOrder.map((entry) => (
            <option key={entry} value={entry}>
              {orderStatusLabels[entry]}
            </option>
          ))}
        </Select>
        <Select
          label="Teslimat"
          value={delivery}
          onChange={(event) => setDelivery(event.target.value as DeliveryType | 'ALL')}
        >
          <option value="ALL">Tümü</option>
          <option value="pickup">Gel Al</option>
          <option value="delivery">Paket Servis</option>
        </Select>
        <Select label="Tarih" value={range} onChange={(event) => setRange(event.target.value as typeof range)}>
          {ranges.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          emoji="🧾"
          title="Sipariş bulunamadı"
          description="Siteden bir sipariş oluşturduğunda burada listelenir."
        />
      ) : (
        <TableWrap>
          <table className="w-full min-w-[52rem]">
            <thead className="border-b border-line bg-cream-100">
              <tr>
                <Th>Sipariş</Th>
                <Th>Müşteri</Th>
                <Th>Teslimat</Th>
                <Th>Tutar</Th>
                <Th>Durum</Th>
                <Th className="text-right">Detay</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50">
                  <Td>
                    <p className="font-semibold text-cocoa-800">{order.code}</p>
                    <p className="text-[0.75rem] text-muted">{formatDateTime(order.createdAt)}</p>
                  </Td>
                  <Td>
                    <p className="font-medium text-cocoa-800">{order.customer.fullName}</p>
                    <p className="text-[0.75rem] text-muted">{formatPhone(order.customer.phone)}</p>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5 text-[0.82rem]">
                      {order.deliveryType === 'pickup' ? (
                        <Store className="size-3.5 text-olive-500" />
                      ) : (
                        <Truck className="size-3.5 text-olive-500" />
                      )}
                      {order.deliveryType === 'pickup' ? 'Gel Al' : 'Paket'}
                    </span>
                  </Td>
                  <Td className="font-semibold text-cocoa-800">{formatPrice(order.total)}</Td>
                  <Td>
                    <select
                      value={order.status}
                      onChange={(event) => {
                        updateOrderStatus(order.id, event.target.value as OrderStatus)
                        notify('Sipariş durumu güncellendi')
                      }}
                      aria-label={`${order.code} durumu`}
                      className={cn(
                        'cursor-pointer rounded-full border-0 px-3 py-1.5 text-[0.78rem] font-semibold focus:outline-none focus:ring-2 focus:ring-cocoa-300',
                        orderStatusTones[order.status],
                      )}
                    >
                      {orderStatusOrder.map((entry) => (
                        <option key={entry} value={entry}>
                          {orderStatusLabels[entry]}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => setDetail(order)}
                      aria-label={`${order.code} detayını gör`}
                      className="grid size-9 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200"
                    >
                      <Eye className="size-4" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}

      <Modal open={detail !== null} onClose={() => setDetail(null)} title={detail ? `Sipariş ${detail.code}` : ''}>
        {detail && (
          <div className="space-y-5 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-wider text-muted">Müşteri</p>
                <p className="mt-1 font-medium text-cocoa-800">{detail.customer.fullName}</p>
                <p className="text-muted">{formatPhone(detail.customer.phone)}</p>
              </div>
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-wider text-muted">Teslimat</p>
                <p className="mt-1 font-medium text-cocoa-800">
                  {detail.deliveryType === 'pickup' ? 'Gel Al' : 'Paket Servis'}
                </p>
                {detail.address && <p className="text-muted">{detail.address.fullAddress}</p>}
                {detail.address?.directions && <p className="text-muted">{detail.address.directions}</p>}
              </div>
            </div>

            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-wider text-muted">Ürünler</p>
              <ul className="mt-2 divide-y divide-line">
                {detail.items.map((item, index) => (
                  <li key={`${item.productId}-${index}`} className="py-2.5">
                    <div className="flex justify-between gap-4">
                      <span className="font-medium text-cocoa-800">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="font-semibold text-cocoa-800">
                        {formatPrice(multiply(item.unitPrice, item.quantity))}
                      </span>
                    </div>
                    {item.optionsSummary && <p className="mt-0.5 text-[0.78rem] text-muted">{item.optionsSummary}</p>}
                    {item.note && <p className="mt-0.5 text-[0.78rem] italic text-olive-600">Not: {item.note}</p>}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="space-y-1.5 border-t border-line pt-4">
              <div className="flex justify-between text-muted">
                <dt>Ara toplam</dt>
                <dd>{formatPrice(detail.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Teslimat</dt>
                <dd>{detail.deliveryFee > 0 ? formatPrice(detail.deliveryFee) : 'Ücretsiz'}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-cocoa-800">
                <dt>Toplam</dt>
                <dd>{formatPrice(detail.total)}</dd>
              </div>
            </dl>

            {detail.note && (
              <p className="rounded-md bg-cream-100 px-3.5 py-2.5 text-[0.85rem] text-cocoa-700">
                <strong className="font-semibold">Sipariş notu:</strong> {detail.note}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
