import { Outlet, useLocation } from 'react-router-dom'
import { IntroSplash } from '@/components/brand/IntroSplash'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useIntro } from '@/context/IntroContext'
import { Footer } from './Footer'
import { MobileStickyBar } from './MobileStickyBar'
import { Navbar } from './Navbar'

export function SiteLayout() {
  const { playing, logoRef, setPlaying, setHeroIn } = useIntro()
  const { pathname } = useLocation()
  // Açılış yalnızca ana sayfada; derin bağlantıyla gelen kullanıcıyı bekletmez
  const showIntro = playing && pathname === '/'

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-cocoa-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream-50"
      >
        İçeriğe geç
      </a>

      <Navbar />

      {showIntro && (
        <IntroSplash
          targetRef={logoRef}
          onFlyStart={() => setHeroIn(true)}
          onDone={() => setPlaying(false)}
        />
      )}

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
      <MobileStickyBar />
    </div>
  )
}
