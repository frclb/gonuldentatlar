import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { preloadMagnolyaStage } from '@/components/product/LazyMagnolyaStage'
import { RouteFallback } from '@/components/ui/RouteFallback'
import { Toaster } from '@/components/ui/Toaster'
import { CartProvider } from '@/context/CartContext'
import { CatalogProvider } from '@/context/CatalogContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { IntroProvider } from '@/context/IntroContext'
import { ToastProvider } from '@/context/ToastContext'
import { lazyPage } from '@/lib/lazyPage'
import Home from '@/pages/Home'

/*
 * Route-level code splitting — ana sayfa hariç hepsi tembel yüklenir.
 * lazyPage: yayından sonra açık kalmış sekmede parça bulunamazsa bir kez
 * yeniler; preload ile boşta önceden indirilebilir.
 */
const Menu = lazyPage(() => import('@/pages/Menu'))
const ProductDetail = lazyPage(() => import('@/pages/ProductDetail'))
const Campaigns = lazyPage(() => import('@/pages/Campaigns'))
const About = lazyPage(() => import('@/pages/About'))
const Contact = lazyPage(() => import('@/pages/Contact'))
const Cart = lazyPage(() => import('@/pages/Cart'))
const Checkout = lazyPage(() => import('@/pages/Checkout'))
const Kvkk = lazyPage(() => import('@/pages/Kvkk'))
const Privacy = lazyPage(() => import('@/pages/Privacy'))
const NotFound = lazyPage(() => import('@/pages/NotFound'))

/**
 * Ana sayfa açıldıktan sonra, tarayıcı boşta kalınca sipariş yolunun
 * parçalarını önceden indir: "Menüyü Keşfet"e basınca bekleme olmasın.
 * Yan etki olarak sekme açıkken yeni yayın gelse bile bu sayfalar zaten
 * bellekte olduğu için eski sekmede de açılır.
 */
function usePreloadRoutes() {
  useEffect(() => {
    const run = () => {
      Menu.preload()
      ProductDetail.preload()
      Cart.preload()
      Checkout.preload()
      preloadMagnolyaStage()
    }
    const idle = window.requestIdleCallback
    if (idle) {
      const id = idle(run, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    // Safari'de requestIdleCallback yok
    const timer = window.setTimeout(run, 1500)
    return () => window.clearTimeout(timer)
  }, [])
}

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
  usePreloadRoutes()

  return (
    // En dışta: herhangi bir hata beyaz ekran yerine "Sayfayı yenile" gösterir
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <CatalogProvider>
          <ToastProvider>
            <IntroProvider>
            <FavoritesProvider>
              <CartProvider>
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
            </IntroProvider>
          </ToastProvider>
        </CatalogProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
