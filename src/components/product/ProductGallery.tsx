import { useEffect, useState } from 'react'
import { assetUrl } from '@/lib/assets'
import { cn } from '@/lib/cn'

/**
 * Ürün galerisi. Geçiş CSS ile yapılır; framer-motion'ın AnimatePresence'ı
 * çıkış animasyonu tamamlanmadan yeni görseli basmıyor ve sekme arka plandayken
 * animasyon hiç başlamadığı için görsel takılı kalıyordu.
 */
export function ProductGallery({
  images,
  alt,
  /** Seçeneğe göre dışarıdan gösterilecek görseli belirlemek için. */
  activeIndex,
}: {
  images: string[]
  alt: string
  activeIndex?: number
}) {
  const [active, setActive] = useState(activeIndex ?? 0)
  const gallery = images.length > 0 ? images : ['/images/products/cilekli-magnolya.webp']

  /* Sunum seçimi değişince galeriyi ona getir; kullanıcı yine elle gezebilir. */
  useEffect(() => {
    if (activeIndex !== undefined) setActive(activeIndex)
  }, [activeIndex])

  const current = Math.min(active, gallery.length - 1)

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-100 shadow-soft">
        <img
          key={gallery[current]}
          src={assetUrl(gallery[current])}
          alt={alt}
          width={900}
          height={900}
          decoding="async"
          className="size-full animate-[gallery-fade_300ms_ease-out] object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Ürün görselleri">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`${alt} — görsel ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                'size-[4.5rem] shrink-0 overflow-hidden rounded-md border-2 bg-cream-100 transition-colors md:size-20',
                index === current ? 'border-cocoa-500' : 'border-transparent hover:border-cocoa-200',
              )}
            >
              <img
                src={assetUrl(image)}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
