import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * Uygulamanın en dışındaki hata yakalayıcı. Yoktu: bir sayfada çıkan tek bir
 * hata bütün uygulamayı söküp beyaz ekran bırakıyordu. Artık kullanıcı ne
 * olduğunu görüyor ve tek dokunuşla yenileyebiliyor.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Sayfa hatası:', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="grid min-h-svh place-items-center bg-background px-6 text-center">
        <div className="max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-olive-600">Bir sorun çıktı</p>
          <h1 className="mt-3 text-[1.9rem] leading-tight">Sayfa yüklenemedi.</h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
            Site az önce güncellenmiş olabilir. Sayfayı yenilediğinde kaldığın yerden devam edebilirsin.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center rounded-full bg-cocoa-600 px-6 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-cocoa-700"
            >
              Sayfayı yenile
            </button>
            <a
              href={import.meta.env.BASE_URL}
              className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-cocoa-700 transition hover:bg-cream-100"
            >
              Ana sayfa
            </a>
          </div>
        </div>
      </div>
    )
  }
}
