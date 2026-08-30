import { useId } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

/**
 * Kubbeli Kupa — Gönülden Tatlar marka işareti.
 *
 * Kubbe kapak + krema katmanları + kalp garnitür. Parçalar `currentColor`
 * yerine sınıflarla boyanır ki krem zemin ve kakao zemin varyantları aynı
 * bileşenden çıksın.
 */
export function LogoMark({
  className,
  tone = 'default',
  /** 24px altında kubbe ve kalp okunmuyor; sade sürüm kullanılır. */
  simple = false,
}: {
  className?: string
  tone?: 'default' | 'light'
  simple?: boolean
}) {
  // Aynı sayfada birden çok işaret olabiliyor; clipPath kimliği benzersiz olmalı
  const clipId = useId()
  const body = tone === 'light' ? 'fill-cream-100' : 'fill-cocoa-600'
  const layer = tone === 'light' ? 'fill-cocoa-600' : 'fill-cream-100'
  const dome = tone === 'light' ? 'fill-cream-100/30' : 'fill-cocoa-600/25'

  return (
    <svg viewBox="0 0 96 96" className={cn('size-9', className)} aria-hidden focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d="M21 38H75l-6.6 33.5Q66.9 81 57.4 81H38.6Q29.1 81 27.6 71.5Z" />
        </clipPath>
      </defs>

      {!simple && (
        <>
          <path d="M25.5 30a22.5 20 0 0 1 45 0Z" className={dome} />
          <path
            d="M48 28.6c-5.1-3.8-11.6-7.2-11.6-12.2a5.9 5.9 0 0 1 11.6-2.8 5.9 5.9 0 0 1 11.6 2.8c0 5-6.5 8.4-11.6 12.2Z"
            className="fill-blush-400"
          />
        </>
      )}

      <rect x="17.5" y="29" width="61" height="9.5" rx="4.75" className={body} />
      <path d="M21 38H75l-6.6 33.5Q66.9 81 57.4 81H38.6Q29.1 81 27.6 71.5Z" className={body} />
      <g clipPath={`url(#${clipId})`} className={layer}>
        <rect x="16" y="45" width="66" height="9" />
        <rect x="16" y="62" width="66" height="7" />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  showWordmark = true,
  compact = false,
  tone = 'default',
}: {
  className?: string
  showWordmark?: boolean
  /** Çok dar ekranlarda (<420px) yazıyı gizler — navbar'da CTA'ya yer açar. */
  compact?: boolean
  tone?: 'default' | 'light'
}) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex min-w-0 items-center gap-2 sm:gap-2.5', className)}
      aria-label="Gönülden Tatlar — ana sayfa"
    >
      <LogoMark
        tone={tone}
        className="size-8 shrink-0 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-rotate-6 sm:size-9 md:size-10"
      />
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
