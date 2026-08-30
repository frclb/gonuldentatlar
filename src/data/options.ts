import type { ProductOption } from '@/types'

/**
 * Paylaşılan ürün seçenekleri.
 * Her ürün yalnızca kendisiyle ilgili seçenekleri alır — hepsi her üründe
 * gösterilmez (bkz. prompt §23).
 */

export const sizeOption = (bigDelta = 45): ProductOption => ({
  id: 'boyut',
  name: 'Boyut',
  type: 'single',
  required: true,
  values: [
    { id: 'standart', name: 'Standart', priceDelta: 0, isDefault: true },
    { id: 'buyuk', name: 'Büyük', priceDelta: bigDelta },
  ],
})

export const sauceOption: ProductOption = {
  id: 'sos',
  name: 'Sos',
  type: 'single',
  required: true,
  values: [
    { id: 'sutlu-cikolata', name: 'Sütlü Çikolata', priceDelta: 0, isDefault: true },
    { id: 'beyaz-cikolata', name: 'Beyaz Çikolata', priceDelta: 0 },
    { id: 'karamel', name: 'Karamel', priceDelta: 0 },
    { id: 'cilek', name: 'Çilek', priceDelta: 0 },
  ],
}

export const fruitOption: ProductOption = {
  id: 'meyve',
  name: 'Meyve',
  type: 'multiple',
  maxSelect: 3,
  values: [
    { id: 'cilek', name: 'Çilek', priceDelta: 25 },
    { id: 'muz', name: 'Muz', priceDelta: 15 },
    { id: 'yaban-mersini', name: 'Yaban Mersini', priceDelta: 35 },
  ],
}

export const toppingOption: ProductOption = {
  id: 'topping',
  name: 'Topping',
  type: 'multiple',
  maxSelect: 3,
  values: [
    { id: 'oreo', name: 'Oreo', priceDelta: 20 },
    { id: 'lotus', name: 'Lotus', priceDelta: 25 },
    { id: 'kinder', name: 'Kinder', priceDelta: 25 },
    { id: 'findik', name: 'Fındık', priceDelta: 20 },
    { id: 'hindistan-cevizi', name: 'Hindistan Cevizi', priceDelta: 15 },
  ],
}

export const extraOption: ProductOption = {
  id: 'ekstra',
  name: 'Ekstra',
  type: 'multiple',
  maxSelect: 3,
  values: [
    { id: 'dondurma', name: 'Dondurma Topu', priceDelta: 40 },
    { id: 'ekstra-meyve', name: 'Ekstra Meyve', priceDelta: 30 },
    { id: 'ekstra-cikolata', name: 'Ekstra Çikolata', priceDelta: 25 },
  ],
}

export const scoopOption: ProductOption = {
  id: 'top',
  name: 'Top Sayısı',
  type: 'single',
  required: true,
  values: [
    { id: 'tek', name: 'Tek Top', priceDelta: 0, isDefault: true },
    { id: 'ikili', name: 'İki Top', priceDelta: 45 },
    { id: 'uclu', name: 'Üç Top', priceDelta: 85 },
  ],
}

export const servingOption: ProductOption = {
  id: 'sunum',
  name: 'Sunum',
  type: 'single',
  required: true,
  values: [
    { id: 'kulah', name: 'Külah', priceDelta: 0, isDefault: true },
    { id: 'kase', name: 'Kâse', priceDelta: 10 },
  ],
}

export const iceOption: ProductOption = {
  id: 'buz',
  name: 'Buz',
  type: 'single',
  required: true,
  values: [
    { id: 'normal', name: 'Normal', priceDelta: 0, isDefault: true },
    { id: 'az', name: 'Az Buz', priceDelta: 0 },
    { id: 'buzsuz', name: 'Buzsuz', priceDelta: 0 },
  ],
}

export const creamOption: ProductOption = {
  id: 'krema',
  name: 'Üzeri',
  type: 'multiple',
  maxSelect: 2,
  values: [
    { id: 'krema', name: 'Krema', priceDelta: 20 },
    { id: 'sos-gezdir', name: 'Sos Gezdirme', priceDelta: 15 },
  ],
}

/** Cup tatlıların standart seçenek seti */
export const cupOptions: ProductOption[] = [sizeOption(45), sauceOption, toppingOption, fruitOption, extraOption]

/** Waffle'ların standart seçenek seti */
export const waffleOptions: ProductOption[] = [sizeOption(60), fruitOption, toppingOption, sauceOption, extraOption]

/** Milkshake seçenek seti */
export const milkshakeOptions: ProductOption[] = [sizeOption(40), creamOption]

/** Dondurma seçenek seti */
export const iceCreamOptions: ProductOption[] = [scoopOption, servingOption, toppingOption]

/** İçecek seçenek seti */
export const drinkOptions: ProductOption[] = [sizeOption(30), iceOption]
