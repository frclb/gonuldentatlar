/**
 * Para hesaplamaları.
 * Tüm toplama/çarpma işlemleri kuruş (integer) üzerinden yapılır; float
 * yuvarlama hataları (0.1 + 0.2) böylece oluşmaz.
 */

export const toKurus = (tl: number): number => Math.round(tl * 100)
export const toTL = (kurus: number): number => kurus / 100

/** TL değerleri toplar, sonucu TL olarak döner. */
export const sum = (...values: number[]): number =>
  toTL(values.reduce((acc, v) => acc + toKurus(v), 0))

/** TL değerini adetle çarpar. */
export const multiply = (tl: number, qty: number): number => toTL(toKurus(tl) * qty)

/** İki TL değerini çıkarır. */
export const subtract = (a: number, b: number): number => toTL(toKurus(a) - toKurus(b))

/** Yüzde indirimi uygular. */
export const applyDiscount = (tl: number, percentage: number): number =>
  toTL(Math.round((toKurus(tl) * (100 - percentage)) / 100))

/** İki fiyattan indirim oranını hesaplar. */
export const discountRate = (oldPrice: number, price: number): number =>
  oldPrice <= 0 ? 0 : Math.round(((oldPrice - price) / oldPrice) * 100)
