import { Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'
import { useSeo } from '@/lib/seo'
import { AdminCampaigns } from './AdminCampaigns'
import { AdminCategories } from './AdminCategories'
import { AdminCustomers } from './AdminCustomers'
import { AdminDashboard } from './AdminDashboard'
import { AdminLayout } from './AdminLayout'
import { AdminLogin } from './AdminLogin'
import { AdminOrders } from './AdminOrders'
import { AdminProducts } from './AdminProducts'
import { AdminSettings } from './AdminSettings'

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      {/* Site sayfalarında başa kaydırmayı PageTransition yapıyor; panelin
          kendi geçişi yok, burada eskisi gibi anında kaydırılıyor */}
      <ScrollToTop />
      <AdminScreens />
    </AdminAuthProvider>
  )
}

function AdminScreens() {
  const { isAuthenticated } = useAdminAuth()

  useSeo({
    title: 'Yönetim Paneli | Gönülden Tatlar',
    description: 'Gönülden Tatlar yönetim paneli.',
    path: '/admin',
  })

  if (!isAuthenticated) return <AdminLogin />

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="urunler" element={<AdminProducts />} />
        <Route path="kategoriler" element={<AdminCategories />} />
        <Route path="kampanyalar" element={<AdminCampaigns />} />
        <Route path="siparisler" element={<AdminOrders />} />
        <Route path="musteriler" element={<AdminCustomers />} />
        <Route path="ayarlar" element={<AdminSettings />} />
        <Route path="*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}
