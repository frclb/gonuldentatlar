const priceFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/**
 * Site genelinde tek fiyat formatı: ₺185 / ₺185,50
 * Kuruş yoksa ondalık gösterilmez.
 */
export function formatPrice(value: number): string {
  return `₺${priceFormatter.format(value)}`
}

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso))
export const formatDateTime = (iso: string): string => dateTimeFormatter.format(new Date(iso))

/** "0532 123 45 67" gibi görsel telefon formatı */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^90/, '')
  if (digits.length !== 10) return raw
  return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
}

export const slugify = (value: string): string =>
  value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
