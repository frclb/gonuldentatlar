import { ButtonLink } from '@/components/ui/Button'
import { useSeo } from '@/lib/seo'
import { assetUrl } from '@/lib/assets'

export default function NotFound() {
  useSeo({
    title: 'Sayfa bulunamadı',
    description: 'Aradığın sayfayı bulamadık. Menüye göz atarak devam edebilirsin.',
    path: '/404',
  })

  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <img
        src={assetUrl('/images/products/cilekli-magnolya.webp')}
        alt=""
        width={900}
        height={900}
        className="size-40 rounded-full object-cover shadow-card"
      />
      <p className="mt-8 font-[family-name:var(--font-display)] text-6xl text-cocoa-300">404</p>
      <h1 className="mt-2 text-[1.8rem] md:text-[2.2rem]">Tatlı yolunu biraz kaybettin.</h1>
      <p className="mt-3 max-w-sm text-[0.95rem] text-muted">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Menüye dönüp favorini bulabilirsin.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/" size="lg">
          Ana Sayfaya Dön
        </ButtonLink>
        <ButtonLink to="/menu" size="lg" variant="outline">
          Menüyü Keşfet
        </ButtonLink>
      </div>
    </div>
  )
}
