/**
 * Analytics olay katmanı.
 * Bugün yalnızca dataLayer'a yazıyor; ileride GA4 / Meta Pixel bağlanınca
 * tek noktadan yönlendirilebilir.
 */
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

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...payload })
}
