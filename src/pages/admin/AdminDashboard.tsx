import { Clock, ShoppingCart, Tag, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '@/context/CatalogContext'
import { formatDateTime, formatPrice } from '@/lib/format'
import { sum } from '@/lib/money'
import { orderStatusLabels, orderStatusTones } from '@/lib/orderStatus'
import { cn } from '@/lib/cn'

const DAY_MS = 86_400_000

export function AdminDashboard() {
  const { orders, activeCampaigns, activeProducts } = useCatalog()

  const stats = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const paid = orders.filter((order) => order.status !== 'CANCELLED')

    const todayOrders = paid.filter((order) => new Date(order.createdAt).getTime() >= startOfToday)
    const weekOrders = paid.filter((order) => new Date(order.createdAt).getTime() >= startOfToday - 6 * DAY_MS)
    const monthOrders = paid.filter((order) => new Date(order.createdAt).getTime() >= startOfToday - 29 * DAY_MS)

    /* son 7 gün ciro dağılımı */
    const daily = Array.from({ length: 7 }, (_, index) => {
      const dayStart = startOfToday - (6 - index) * DAY_MS
      const dayOrders = paid.filter((order) => {
        const time = new Date(order.createdAt).getTime()
        return time >= dayStart && time < dayStart + DAY_MS
      })
      return {
        label: new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(new Date(dayStart)),
        total: sum(...dayOrders.map((order) => order.total)),
      }
    })

    /* en çok satan ürünler */
    const productTotals = new Map<string, { name: string; quantity: number; revenue: number }>()
    for (const order of paid) {
      for (const item of order.items) {
        const current = productTotals.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 }
        current.quantity += item.quantity
        current.revenue = sum(current.revenue, item.unitPrice * item.quantity)
        productTotals.set(item.productId, current)
      }
    }

    return {
      todayCount: todayOrders.length,
      todayRevenue: sum(...todayOrders.map((order) => order.total)),
      weekRevenue: sum(...weekOrders.map((order) => order.total)),
      monthRevenue: sum(...monthOrders.map((order) => order.total)),
      daily,
      topProducts: [...productTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
      pending: orders.filter((order) => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status)),
    }
  }, [orders])

  const maxDaily = Math.max(...stats.daily.map((day) => day.total), 1)

  const cards = [
    { label: 'Bugünkü sipariş', value: String(stats.todayCount), icon: ShoppingCart, tone: 'bg-cocoa-100 text-cocoa-700' },
    { label: 'Günlük ciro', value: formatPrice(stats.todayRevenue), icon: TrendingUp, tone: 'bg-olive-100 text-olive-700' },
    { label: 'Haftalık ciro', value: formatPrice(stats.weekRevenue), icon: TrendingUp, tone: 'bg-blush-100 text-blush-500' },
    { label: 'Aylık ciro', value: formatPrice(stats.monthRevenue), icon: TrendingUp, tone: 'bg-cream-200 text-cocoa-700' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[1.75rem] md:text-[2rem]">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          {activeProducts.length} aktif ürün · {activeCampaigns.length} aktif kampanya
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl bg-surface p-5 shadow-soft">
            <span className={cn('grid size-10 place-items-center rounded-full', tone)}>
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <p className="mt-4 text-2xl font-semibold text-cocoa-800">{value}</p>
            <p className="mt-0.5 text-[0.82rem] text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl bg-surface p-6 shadow-soft">
          <h2 className="text-lg">Son 7 gün</h2>
          {stats.daily.every((day) => day.total === 0) ? (
            <p className="mt-6 text-sm text-muted">
              Henüz sipariş yok. Siteden bir sipariş oluşturduğunda burada görünecek.
            </p>
          ) : (
            <div className="mt-6 flex h-52 gap-3">
              {stats.daily.map((day) => (
                <div key={day.label} className="flex h-full flex-1 flex-col items-center gap-2">
                  <span className="h-4 text-[0.7rem] font-medium text-muted">
                    {day.total > 0 ? formatPrice(day.total) : ''}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-cocoa-300 transition-[height] duration-500"
                      style={{ height: `${Math.max((day.total / maxDaily) * 100, 2)}%` }}
                    />
                  </div>
                  <span className="text-[0.72rem] font-medium capitalize text-muted">{day.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-surface p-6 shadow-soft">
          <h2 className="text-lg">En çok satanlar</h2>
          {stats.topProducts.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Sipariş geldikçe burada listelenecek.</p>
          ) : (
            <ol className="mt-5 space-y-3">
              {stats.topProducts.map((product, index) => (
                <li key={product.name} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cream-200 text-[0.75rem] font-bold text-cocoa-700">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-cocoa-800">{product.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-cocoa-700">{product.quantity} adet</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="rounded-xl bg-surface p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg">Bekleyen siparişler</h2>
          <Link to="/admin/siparisler" className="text-sm font-semibold text-olive-600 hover:underline">
            Tümünü gör →
          </Link>
        </div>

        {stats.pending.length === 0 ? (
          <p className="mt-5 flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4" /> Bekleyen sipariş yok.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-line">
            {stats.pending.slice(0, 5).map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-cocoa-800">
                    {order.code} · {order.customer.fullName}
                  </p>
                  <p className="text-[0.78rem] text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('rounded-full px-2.5 py-1 text-[0.7rem] font-semibold', orderStatusTones[order.status])}>
                    {orderStatusLabels[order.status]}
                  </span>
                  <span className="text-sm font-semibold text-cocoa-800">{formatPrice(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeCampaigns.length > 0 && (
        <section className="rounded-xl bg-surface p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-lg">
            <Tag className="size-4 text-olive-500" /> Aktif kampanyalar
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {activeCampaigns.map((campaign) => (
              <li key={campaign.id} className="rounded-full bg-cream-200 px-3.5 py-1.5 text-sm text-cocoa-700">
                {campaign.title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
