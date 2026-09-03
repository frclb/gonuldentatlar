import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { RouteFallback } from '@/components/ui/RouteFallback'
import { Toaster } from '@/components/ui/Toaster'
import { CartProvider } from '@/context/CartContext'
import { CatalogProvider } from '@/context/CatalogContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ToastProvider } from '@/context/ToastContext'
import Home from '@/pages/Home'

/* Route-level code splitting — ana sayfa hariç hepsi tembel yüklenir. */
const Menu = lazy(() => import('@/pages/Menu'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))
const Campaigns = lazy(() => import('@/pages/Campaigns'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const Kvkk = lazy(() => import('@/pages/Kvkk'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const NotFound = lazy(() => import('@/pages/NotFound'))
/*
 * Yönetim paneli yalnızca geliştirme sunucusunda var.
 * Site tamamen statik yayınlanıyor; panelin yaptığı düzenlemeler zaten sadece
 * o tarayıcının kendi hafızasında kalıyor, canlı siteye yansımıyor. Buna
 * karşılık giriş şifresi herkesin indirebildiği pakete gömülüyordu. Koşul
 * derleme sırasında sabitlendiği için üretim paketinde admin kodu hiç yer almaz.
 */
const AdminRoutes = import.meta.env.DEV ? lazy(() => import('@/pages/admin/AdminRoutes')) : null

/** Alt yolda yayınlandığında (ör. /gonuldentatlar/) router'ın tabanı. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <CatalogProvider>
        <ToastProvider>
          <FavoritesProvider>
            <CartProvider>
                <ScrollToTop />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route element={<SiteLayout />}>
                      <Route index element={<Home />} />
                      <Route path="menu" element={<Menu />} />
                      <Route path="menu/:slug" element={<ProductDetail />} />
                      <Route path="kampanyalar" element={<Campaigns />} />
                      <Route path="hakkimizda" element={<About />} />
                      <Route path="iletisim" element={<Contact />} />
                      <Route path="sepet" element={<Cart />} />
                      <Route path="siparis" element={<Checkout />} />
                      <Route path="kvkk" element={<Kvkk />} />
                      <Route path="gizlilik" element={<Privacy />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                    {AdminRoutes && <Route path="/admin/*" element={<AdminRoutes />} />}
                  </Routes>
                </Suspense>
                <Toaster />
            </CartProvider>
          </FavoritesProvider>
        </ToastProvider>
      </CatalogProvider>
    </BrowserRouter>
  )
}
