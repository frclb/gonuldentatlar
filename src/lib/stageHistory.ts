/**
 * Magnolya sahnesi için tarayıcı geçmişi kaydı.
 *
 * Sahne bir sayfa değil, sayfanın üstünde açılan tam ekran bir katman. Geçmişe
 * kayıt düşmeseydi telefondaki geri hareketi sahneyi kapatmak yerine kullanıcıyı
 * sayfadan çıkarırdı. Sahne açılırken aynı adrese bir kayıt eklenir; geri
 * tuşu bu kaydı geri alır ve sahne kapanır.
 *
 * React Router'ın kendi alanları (key, idx) kopyalanır ki yönlendirici kaydı
 * aynı sayfa olarak görsün.
 */
const FLAG = 'magnolyaStage'

export function pushStageEntry() {
  const current = (window.history.state as Record<string, unknown> | null) ?? {}
  window.history.pushState({ ...current, [FLAG]: true }, '')
}

/** Geçmişin en üstünde sahnenin kaydı mı var */
export function isStageEntryOnTop() {
  return Boolean((window.history.state as Record<string, unknown> | null)?.[FLAG])
}
