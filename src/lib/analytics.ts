/**
 * Ziyaret ve olay ölçümü: Google Analytics 4 (ücretsiz).
 *
 * - Ölçüm kimliği boşsa hiçbir şey yüklenmez; site ölçümsüz çalışır ve çerez bandı da çıkmaz.
 * - Kimlik tanımlıysa ziyaretçi bantta "Kabul et" diyene kadar Google'a tek istek gitmez
 *   (KVKK: analitik çerezler açık rızaya bağlıdır). Reddederse ölçüm hiç başlamaz.
 * - Sayfa görüntülemelerini GA4 kendisi sayar (sayfa değişimlerini tarayıcı geçmişinden izler);
 *   buradaki track() çağrıları buton tıklamaları ve sepet adımları gibi özel olayları gönderir.
 */
import { readStorage, writeStorage } from './storage'

/**
 * Google Analytics'teki web akışının ölçüm kimliği ("G-" ile başlar). Gizli bir bilgi değildir,
 * sayfa kaynağında herkes görür. VITE_GA_ID ile geçersiz kılınabilir (yerel deneme için).
 */
const OLCUM_KIMLIGI = 'G-38KFSQKC0L' // Analytics: Gönülden Tatlar › gonuldentatlar.com › web akışı

export const GA_ID = (import.meta.env.VITE_GA_ID || OLCUM_KIMLIGI).trim()
export const analyticsEnabled = /^G-[A-Z0-9]+$/.test(GA_ID)

export type AnalyticsEvent =
  | 'view_home'
  | 'view_menu'
  | 'view_product'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'start_checkout'
  | 'complete_order'
  | 'click_whatsapp'
  | 'click_instagram'
  | 'click_location'

export type Consent = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const RIZA_ANAHTARI = 'analytics-consent'
const TERCIH_AC = 'gt:consent-open'
let yuklendi = false

export function getConsent(): Consent | null {
  const kayit = readStorage<{ choice?: Consent } | null>(RIZA_ANAHTARI, null)
  return kayit?.choice === 'granted' || kayit?.choice === 'denied' ? kayit.choice : null
}

export function setConsent(choice: Consent): void {
  writeStorage(RIZA_ANAHTARI, { choice, at: new Date().toISOString() })
  if (choice === 'granted') yukle()
  else geriCek()
}

/** Çerez bandını yeniden açar (altbilgideki ve gizlilik sayfasındaki "Çerez tercihleri" için). */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(TERCIH_AC))
}

export function onConsentSettingsOpen(dinleyici: () => void): () => void {
  window.addEventListener(TERCIH_AC, dinleyici)
  return () => window.removeEventListener(TERCIH_AC, dinleyici)
}

/** Uygulama açılırken bir kez çağrılır: daha önce onay verilmişse ölçümü başlatır. */
export function initAnalytics(): void {
  if (analyticsEnabled && getConsent() === 'granted') yukle()
}

function yukle(): void {
  if (!analyticsEnabled || yuklendi || typeof window === 'undefined') return
  yuklendi = true
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // gtag.js yalnızca arguments nesnesini tanır, dizi değil
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  const betik = document.createElement('script')
  betik.async = true
  betik.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(betik)
}

function geriCek(): void {
  if (typeof window === 'undefined') return
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  // Daha önce yazılmış Analytics çerezlerini sil
  const alanlar = ['', location.hostname, `.${location.hostname.replace(/^www\./, '')}`]
  for (const parca of document.cookie.split(';')) {
    const ad = parca.split('=')[0].trim()
    if (!ad.startsWith('_ga')) continue
    for (const alan of alanlar) {
      document.cookie = `${ad}=; Max-Age=0; path=/${alan ? `; domain=${alan}` : ''}`
    }
  }
}

/** productId → product_id: GA4 parametre adları küçük harf ve alt çizgili olur. */
function parametreler(payload: Record<string, unknown>): Record<string, unknown> {
  const sonuc: Record<string, unknown> = {}
  for (const [anahtar, deger] of Object.entries(payload)) {
    sonuc[anahtar.replace(/[A-Z]/g, (h) => `_${h.toLowerCase()}`)] = deger
  }
  if (typeof sonuc.value === 'number') sonuc.currency = 'TRY'
  return sonuc
}

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  if (!yuklendi || !window.gtag) {
    if (import.meta.env.DEV) console.debug('[ölçüm kapalı]', event, payload)
    return
  }
  window.gtag('event', event, parametreler(payload))
}
