import { lazy, type ComponentType } from 'react'

const KEY = 'gt-chunk-reload'
/** Bu süre içinde ikinci kez yenilenmez: sunucuda gerçekten eksik bir parça döngüye sokmasın */
const WINDOW = 10_000

/**
 * Sayfa parçası yüklenemezse sayfayı bir kez yeniler.
 *
 * Her yayında parça dosyalarının adı değişiyor ve eskileri sunucudan
 * kalkıyor. Yayından önce açılmış bir sekme, ilk kez gittiği sayfanın artık
 * olmayan eski parçasını ister; yükleme 404 ile düşer. Yakalanmasaydı bütün
 * uygulama çöküp beyaz ekranda kalıyordu. Yenileme yeni sürümü getirir.
 * Yine düşerse hata, ErrorBoundary'nin "Sayfayı yenile" ekranına gider.
 */
export function retryImport<T>(factory: () => Promise<T>): () => Promise<T> {
  return () =>
    factory().catch((error: unknown) => {
      let last = 0
      try {
        last = Number(sessionStorage.getItem(KEY) ?? 0)
      } catch {
        /* gizli sekmede sessionStorage kapalı olabilir */
      }
      if (Date.now() - last < WINDOW) throw error
      try {
        sessionStorage.setItem(KEY, String(Date.now()))
      } catch {
        /* yok say */
      }
      window.location.reload()
      // Sayfa yenilenene kadar yükleme ekranı kalsın
      return new Promise<T>(() => {})
    })
}

/**
 * React.lazy + yüklenemezse bir kez yenileme + önceden indirme.
 *
 * `preload()` boşta çağrılır: parça sayfaya gidilmeden iner, tıklamada bekleme
 * olmaz. Önceden indirme başarısız olursa sessizce geçilir — kullanıcı bir
 * şey okurken sayfa yenilenmesin; yenileme yalnızca sayfa gerçekten açılmaya
 * çalışılırken devreye girer.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyPage<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  let pending: Promise<{ default: T }> | null = null

  const component = lazy(retryImport(() => pending ?? factory()))

  const preload = () => {
    if (pending) return
    pending = factory()
    // Düşerse unut: sayfa açılırken taze bir deneme yapılsın
    pending.catch(() => {
      pending = null
    })
  }

  return Object.assign(component, { preload })
}
