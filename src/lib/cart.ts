import type { CartItem, Product, SelectedOption } from '@/types'
import { sum } from './money'

export type Selections = Record<string, string[]>

/** Zorunlu tekli seçenekler için varsayılan değerleri hazırlar. */
export function defaultSelections(product: Product): Selections {
  const selections: Selections = {}
  for (const option of product.options ?? []) {
    if (option.type === 'single') {
      const preferred = option.values.find((v) => v.isDefault) ?? option.values[0]
      if (preferred) selections[option.id] = [preferred.id]
    } else {
      selections[option.id] = []
    }
  }
  return selections
}

/** Seçilen değerleri okunur `SelectedOption[]` yapısına çevirir. */
export function buildSelectedOptions(product: Product, selections: Selections): SelectedOption[] {
  const result: SelectedOption[] = []
  for (const option of product.options ?? []) {
    const ids = selections[option.id] ?? []
    if (ids.length === 0) continue
    const values = option.values.filter((v) => ids.includes(v.id))
    result.push({
      optionId: option.id,
      optionName: option.name,
      valueIds: values.map((v) => v.id),
      valueNames: values.map((v) => v.name),
      priceDelta: sum(...values.map((v) => v.priceDelta)),
    })
  }
  return result
}

/** Temel fiyat + varyant + seçenek farkları. */
export function computeUnitPrice(product: Product, selections: Selections, variantId?: string): number {
  const variant = product.variants?.find((v) => v.id === variantId)
  const base = variant?.price ?? product.price
  const deltas = buildSelectedOptions(product, selections).map((o) => o.priceDelta)
  return sum(base, ...deltas)
}

/** Aynı ürün + aynı seçenekler tek satırda birleşsin diye kararlı anahtar. */
export function makeCartKey(product: Product, selections: Selections, variantId?: string, note?: string): string {
  const parts = Object.keys(selections)
    .sort()
    .map((optionId) => `${optionId}:${[...(selections[optionId] ?? [])].sort().join('+')}`)
    .filter((part) => !part.endsWith(':'))
  return [product.id, variantId ?? '', ...parts, note?.trim() ? `note:${note.trim()}` : '']
    .filter(Boolean)
    .join('|')
}

export function buildCartItem(
  product: Product,
  {
    selections = defaultSelections(product),
    quantity = 1,
    variantId,
    note,
  }: { selections?: Selections; quantity?: number; variantId?: string; note?: string } = {},
): CartItem {
  const variant = product.variants?.find((v) => v.id === variantId)
  return {
    key: makeCartKey(product, selections, variantId, note),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    basePrice: variant?.price ?? product.price,
    unitPrice: computeUnitPrice(product, selections, variantId),
    quantity,
    variantId,
    variantName: variant?.name,
    selectedOptions: buildSelectedOptions(product, selections),
    note: note?.trim() || undefined,
  }
}

/** Seçenek zorunluysa ve seçim yoksa hata döner. */
export function validateSelections(product: Product, selections: Selections): string | null {
  for (const option of product.options ?? []) {
    if (option.required && (selections[option.id]?.length ?? 0) === 0) {
      return `${option.name} seçimi gerekli.`
    }
  }
  return null
}
