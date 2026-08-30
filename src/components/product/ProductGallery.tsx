import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { assetUrl } from '@/lib/assets'

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const gallery = images.length > 0 ? images : ['/images/products/cilekli-magnolya.webp']

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-100 shadow-soft">
        <AnimatePresence mode="wait">
          <motion.img
            key={gallery[active]}
            src={assetUrl(gallery[active])}
            alt={alt}
            width={900}
            height={900}
            decoding="async"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="size-full object-cover"
          />
        </AnimatePresence>
      </div>

      {gallery.length > 1 && (
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Ürün görselleri">
          {gallery.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`${alt} — görsel ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                'size-[4.5rem] shrink-0 overflow-hidden rounded-md border-2 bg-cream-100 transition-colors md:size-20',
                index === active ? 'border-cocoa-500' : 'border-transparent hover:border-cocoa-200',
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
