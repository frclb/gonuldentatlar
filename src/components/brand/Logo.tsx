import { Link } from 'react-router-dom'
import { useIntro } from '@/context/IntroContext'
import { cn } from '@/lib/cn'
import { DOME_FILL } from './colors'

/**
 * Gönülden Tatlar marka işareti: kâse, üstünde krema tepesi, tepede kalp.
 * Gövdede iki krema katmanı görünür.
 *
 * Geometri IntroSplash ile birebir aynı (viewBox 0 0 64 64). Açılışta işaret
 * navbar'daki bu logoya uçuyor; çizimler ayrışırsa son karede sıçrama olur.
 *
 * Kendi zemini yok; koyu zeminde krem bir kutuya alınmalı (bkz. Footer).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden focusable="false">
      {/* krema tepesi */}
      <path d="M14 20A18 15.5 0 0 1 50 20Z" fill={DOME_FILL} />
      {/* gövde */}
      <path
        d="M11 26h42l-3.6 29.2a6 6 0 0 1-5.95 5.3H20.55a6 6 0 0 1-5.95-5.3L11 26Z"
        className="fill-cocoa-600"
      />
      {/* kenar */}
      <rect x="7.5" y="19.5" width="49" height="7" rx="2.6" className="fill-cocoa-600" />
      {/* krema katmanları */}
      <path d="M11.86 33H52.14L51.45 38.6H12.55Z" className="fill-cream-100" />
      <path d="M13.47 46H50.53L49.92 51H14.08Z" className="fill-cream-100" />
      {/* kalp */}
      <path
        d="M32 19.5c-4.76-3.5-8.96-6.44-8.96-10.36a4.76 4.76 0 0 1 8.96-2.38 4.76 4.76 0 0 1 8.96 2.38c0 3.92-4.2 6.86-8.96 10.36Z"
        className="fill-blush-400"
      />
    </svg>
  )
}

export function Logo({
  className,
  showWordmark = true,
  compact = false,
  tone = 'default',
  introTarget = false,
}: {
  className?: string
  showWordmark?: boolean
  /** Çok dar ekranlarda (<420px) yazıyı gizler — navbar'da CTA'ya yer açar. */
  compact?: boolean
  tone?: 'default' | 'light'
  /** Açılış animasyonundaki işaret buraya uçar. Yalnızca Navbar'da true olmalı;
      MobileMenu'deki logo da hedef sayılsaydı uçuş yanlış yere giderdi. */
  introTarget?: boolean
}) {
  const { playing, logoRef } = useIntro()

  return (
    <Link
      to="/"
      className={cn('group inline-flex min-w-0 items-center gap-2 sm:gap-2.5', className)}
      aria-label="Gönülden Tatlar — ana sayfa"
    >
      {/* Açılış sürerken gizli: işaret oraya uçana kadar iki logo birden görünmesin */}
      <span
        ref={introTarget ? logoRef : undefined}
        className={cn('inline-flex shrink-0', introTarget && playing && 'opacity-0')}
      >
        <LogoMark
          className={cn(
            'size-8 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-rotate-6 sm:size-9 md:size-10',
            // Koyu zeminde işaret kendi zemini olmadığı için krem kutuya alınır
            tone === 'light' && 'rounded-lg bg-cream-100 p-[3px]',
          )}
        />
      </span>
      {showWordmark && (
        <span className={cn('flex-col leading-none', compact ? 'hidden min-[420px]:flex' : 'flex')}>
          <span
            className={cn(
              'font-[family-name:var(--font-display)] text-[1.02rem] font-semibold tracking-[-0.01em] sm:text-[1.15rem] md:text-[1.3rem]',
              tone === 'light' ? 'text-cream-100' : 'text-cocoa-800',
            )}
          >
            Gönülden Tatlar
          </span>
          <span
            className={cn(
              'mt-0.5 hidden text-[0.6rem] font-semibold uppercase tracking-[0.22em] sm:block',
              tone === 'light' ? 'text-cream-300/80' : 'text-olive-600',
            )}
          >
            Magnolya & Cup
          </span>
        </span>
      )}
    </Link>
  )
}
