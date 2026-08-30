import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

/** Monogram: kâse + kalp, üstünde dalgalı krema çizgisi. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden focusable="false">
      <rect width="64" height="64" rx="16" className="fill-cocoa-600" />
      <path
        d="M18 22h28l-3.2 20.2A6 6 0 0 1 36.9 47H27.1a6 6 0 0 1-5.9-4.8L18 22Z"
        className="fill-cream-100"
      />
      <path
        d="M32 39.6c-3.4-2.5-6.4-4.6-6.4-7.4a3.4 3.4 0 0 1 6.4-1.7 3.4 3.4 0 0 1 6.4 1.7c0 2.8-3 4.9-6.4 7.4Z"
        className="fill-blush-400"
      />
      <path
        d="M17.4 17.6c3.1-1.9 6.2-1.9 9.3 0s6.2 1.9 9.3 0 6.2-1.9 9.3 0"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        className="stroke-olive-300"
      />
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
      <LogoMark className="size-8 shrink-0 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:-rotate-6 sm:size-9 md:size-10" />
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
