/**
 * Sayfa başlıklarının ortak giriş animasyonu (framer-motion varyantı).
 * `custom` gecikmeyi saniye olarak verir: eyebrow 0, başlık 0.07, metin 0.14.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/** Sayfa başlığı öğelerine tek satırda yayılır: `<motion.h1 {...rise(0.07)}>` */
export const rise = (delay: number) => ({
  variants: fadeUp,
  initial: 'hidden',
  animate: 'show',
  custom: delay,
})
