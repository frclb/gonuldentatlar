import { lazyPage } from '@/lib/lazyPage'

/**
 * Magnolya sahnesi yalnızca bir karta tıklanınca gerekiyor; ana paketi
 * büyütmesin diye ayrı parça. Kartların üzerine gelinince önceden indirilir,
 * tıklamada bekleme olmaz. Yayından sonra açık kalmış bir sekmede parça
 * bulunamazsa sayfa bir kez yenilenir (bkz. lazyPage).
 */
export const MagnolyaStage = lazyPage(() =>
  import('./MagnolyaStage').then((module) => ({ default: module.MagnolyaStage })),
)

export const preloadMagnolyaStage = () => MagnolyaStage.preload()
