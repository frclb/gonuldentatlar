import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Section({
  children,
  className,
  id,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  id?: string
  tone?: 'default' | 'soft' | 'cream'
}) {
  const tones = {
    default: '',
    soft: 'bg-cream-100',
    cream: 'bg-cream-200/60',
  }
  return (
    <section id={id} className={cn('py-14 md:py-20', tones[tone], className)}>
      {children}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-olive-600">{eyebrow}</p>
        )}
        <h2 className="text-[1.75rem] leading-tight md:text-[2.25rem]">{title}</h2>
        {description && <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
