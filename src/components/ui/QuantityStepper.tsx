import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 30,
  size = 'md',
  className,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const dimensions = size === 'sm' ? 'h-9 [--btn:1.75rem]' : 'h-12 [--btn:2.25rem]'
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1',
        dimensions,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Adedi azalt"
        className="grid size-[var(--btn)] place-items-center rounded-full text-cocoa-700 transition-colors hover:bg-cream-200 disabled:opacity-35"
      >
        <Minus className="size-4" strokeWidth={2.5} />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-cocoa-800" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Adedi artır"
        className="grid size-[var(--btn)] place-items-center rounded-full text-cocoa-700 transition-colors hover:bg-cream-200 disabled:opacity-35"
      >
        <Plus className="size-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
