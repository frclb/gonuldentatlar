import { lazy } from 'react'

/**
 * Magnolya sahnesi yalnızca bir karta tıklanınca gerekiyor; ana paketi
 * büyütmesin diye ayrı parça. Kartların üzerine gelinince önceden indirilir,
 * tıklamada bekleme olmaz. Ana sayfa vitrini ve menü aynı parçayı kullanır.
 */
export const preloadMagnolyaStage = () => import('./MagnolyaStage')

export const MagnolyaStage = lazy(() =>
  preloadMagnolyaStage().then((module) => ({ default: module.MagnolyaStage })),
)
