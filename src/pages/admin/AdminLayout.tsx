import {
  BarChart3,
  ExternalLink,
  Info,
  LayoutGrid,
  LogOut,
  Menu as MenuIcon,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogoMark } from '@/components/brand/Logo'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { useCatalog } from '@/context/CatalogContext'
import { cn } from '@/lib/cn'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/urunler', label: 'Ürünler', icon: Package },
  { to: '/admin/kategoriler', label: 'Kategoriler', icon: LayoutGrid },
  { to: '/admin/kampanyalar', label: 'Kampanyalar', icon: Tag },
  { to: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { to: '/admin/musteriler', label: 'Müşteriler', icon: Users },
  { to: '/admin/ayarlar', label: 'İşletme Ayarları', icon: Settings },
]

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const { orders } = useCatalog()
  const [navOpen, setNavOpen] = useState(false)

  const pendingCount = orders.filter((order) => order.status === 'PENDING').length

  return (
    <div className="flex min-h-svh bg-cream-100">
      {/* sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
          navOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
          <Link to="/admin" className="flex items-center gap-2.5">
            <LogoMark className="size-9" />
            <span className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-[0.98rem] font-semibold text-cocoa-800">
                Gönülden Tatlar
              </span>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-olive-600">
                Yönetim
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Menüyü kapat"
            className="grid size-9 place-items-center rounded-full text-cocoa-600 hover:bg-cream-200 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {adminLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setNavOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-cocoa-600 text-cream-50' : 'text-cocoa-700 hover:bg-cream-100',
                )
              }
            >
              <Icon className="size-4" strokeWidth={2} />
              {label}
              {to === '/admin/siparisler' && pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-blush-400 px-2 py-0.5 text-[0.68rem] font-bold text-cocoa-800">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-cocoa-700 transition-colors hover:bg-cream-100"
          >
            <ExternalLink className="size-4" /> Siteyi görüntüle
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-cocoa-700 transition-colors hover:bg-blush-50 hover:text-[var(--color-error)]"
          >
            <LogOut className="size-4" /> Çıkış yap
          </button>
        </div>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 bg-cocoa-900/30 lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Menüyü aç"
            className="grid size-10 place-items-center rounded-full text-cocoa-700 hover:bg-cream-200"
          >
            <MenuIcon className="size-5" />
          </button>
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-cocoa-800">
            Yönetim Paneli
          </span>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          {/* Statik dağıtımda panel değişiklikleri sunucuya yazılmaz — bu net olmalı. */}
          <p className="mb-5 flex items-start gap-2.5 rounded-lg border border-cream-300 bg-cream-200/70 px-4 py-3 text-[0.82rem] leading-relaxed text-cocoa-700">
            <Info className="mt-0.5 size-4 shrink-0 text-olive-600" />
            <span>
              Site statik olarak yayınlanıyor: buradaki değişiklikler yalnızca bu tarayıcıda geçerli, müşterilerin
              gördüğü menüyü değiştirmez. Kalıcı hale getirmek için{' '}
              <Link to="/admin/ayarlar" className="font-semibold underline underline-offset-2">
                İşletme Ayarları → Veri
              </Link>{' '}
              bölümünden yedek indirip geliştiriciye iletin.
            </span>
          </p>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
