import type { ProductOption } from '@/types'

/**
 * Ürünlere yönetim panelinden iliştirilebilen seçenek setleri.
 * Menüdeki çeşitler ayrı ürün olarak tanımlı olduğu için varsayılan olarak
 * hiçbir ürüne seçenek bağlı değildir; ihtiyaç olursa buradan seçilir.
 */

export const sizeOption = (bigDelta = 40): ProductOption => ({
  id: 'boyut',
  name: 'Boyut',
  type: 'single',
  required: true,
  values: [
    { id: 'standart', name: 'Standart', priceDelta: 0, isDefault: true },
    { id: 'buyuk', name: 'Büyük', priceDelta: bigDelta },
  ],
})

export const extraOption: ProductOption = {
  id: 'ekstra',
  name: 'Ekstra',
  type: 'multiple',
  maxSelect: 3,
  values: [
    { id: 'ekstra-meyve', name: 'Ekstra Meyve', priceDelta: 30 },
    { id: 'ekstra-cikolata', name: 'Ekstra Çikolata Sosu', priceDelta: 25 },
    { id: 'ekstra-biskuvi', name: 'Ekstra Bisküvi', priceDelta: 20 },
  ],
}

/** Boyut seçimi olan ürünler için */
export const sizeOnly: ProductOption[] = [sizeOption()]

/** Boyut + ekstra seçimi olan ürünler için */
export const sizeAndExtras: ProductOption[] = [sizeOption(), extraOption]
