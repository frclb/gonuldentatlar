/**
 * Yüklenemeyen görseller için tek bir sayfa geneli önlem.
 *
 * Bağlantı anlık koparsa tarayıcı görselin yerine kırık simge ve alt metni
 * gösterip bir daha denemiyor (ana sayfadaki sunum kartında böyle olmuştu).
 * Hata olayı kabarcıklanmadığı için yakalama aşamasında dinlenir:
 *   1. hata: aynı adres önbelleği atlayan bir ekle bir kez daha istenir,
 *   2. hata: görsel gizlenir; kart zemini boş görünür, kırık simge çıkmaz.
 */
export function initImageRetry() {
  document.addEventListener(
    'error',
    (event) => {
      const img = event.target
      if (!(img instanceof HTMLImageElement) || !img.src || img.src.startsWith('data:')) return
      if (img.dataset.retried) {
        img.style.visibility = 'hidden'
        return
      }
      img.dataset.retried = '1'
      const url = new URL(img.src, window.location.href)
      url.searchParams.set('r', Date.now().toString(36))
      window.setTimeout(() => {
        img.src = url.toString()
      }, 600)
    },
    true,
  )
  // Yeniden deneme başarılı olursa işaret kalksın; görsel sonra değişirse yine denenebilsin
  document.addEventListener(
    'load',
    (event) => {
      const img = event.target
      if (img instanceof HTMLImageElement && img.dataset.retried) {
        delete img.dataset.retried
        img.style.visibility = ''
      }
    },
    true,
  )
}
