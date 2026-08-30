import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'new' | 'discount' | 'soft' | 'olive' | 'dark'

const tones: Record<BadgeTone, string> = {
  new: 'bg-olive-500 text-white',
  discount: 'bg-blush-400 text-cocoa-800',
  soft: 'bg-cream-200 text-cocoa-700',
  olive: 'bg-olive-100 text-olive-700',
  dark: 'bg-cocoa-700 text-cream-100',
}

export function Badge({
  tone = 'soft',
  children,
  className,
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
