import { useMemo } from 'react'
import { EmptyState } from '@/components/ui/States'
import { useCatalog } from '@/context/CatalogContext'
import { formatDateTime, formatPhone, formatPrice } from '@/lib/format'
import { sum } from '@/lib/money'
import { AdminHeader, Td, TableWrap, Th } from './components'

/** Müşteriler sipariş geçmişinden türetilir — ayrı bir müşteri kaydı tutulmaz. */
export function AdminCustomers() {
  const { orders } = useCatalog()

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; count: number; total: number; last: string }>()
    for (const order of orders) {
      const key = order.customer.phone.replace(/\D/g, '')
      const current = map.get(key) ?? {
        name: order.customer.fullName,
        phone: order.customer.phone,
        count: 0,
        total: 0,
        last: order.createdAt,
      }
      current.count += 1
      current.total = sum(current.total, order.total)
      if (new Date(order.createdAt) > new Date(current.last)) {
        current.last = order.createdAt
        current.name = order.customer.fullName
      }
      map.set(key, current)
    }
    return [...map.values()].sort((a, b) => b.total - a.total)
  }, [orders])

  return (
    <div>
      <AdminHeader title="Müşteriler" description={`${customers.length} müşteri`} />

      {customers.length === 0 ? (
        <EmptyState emoji="👋" title="Henüz müşteri kaydı yok" description="İlk sipariş geldiğinde burada görünür." />
      ) : (
        <TableWrap>
          <table className="w-full min-w-[40rem]">
            <thead className="border-b border-line bg-cream-100">
              <tr>
                <Th>Müşteri</Th>
                <Th>Sipariş</Th>
                <Th>Toplam harcama</Th>
                <Th>Son sipariş</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((customer) => (
                <tr key={customer.phone} className="hover:bg-cream-50">
                  <Td>
                    <p className="font-semibold text-cocoa-800">{customer.name}</p>
                    <p className="text-[0.75rem] text-muted">{formatPhone(customer.phone)}</p>
                  </Td>
                  <Td>{customer.count}</Td>
                  <Td className="font-semibold text-cocoa-800">{formatPrice(customer.total)}</Td>
                  <Td className="text-[0.82rem]">{formatDateTime(customer.last)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  )
}
