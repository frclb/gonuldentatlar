import { Outlet } from 'react-router-dom'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Footer } from './Footer'
import { MobileStickyBar } from './MobileStickyBar'
import { Navbar } from './Navbar'

export function SiteLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-cocoa-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-cream-50"
      >
        İçeriğe geç
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
      <MobileStickyBar />
    </div>
  )
}
