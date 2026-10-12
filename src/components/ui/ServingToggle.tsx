import { cn } from '@/lib/cn'

/** Cup ↔ Kavanoz seçici. Kayan beyaz hap seçili tarafı gösterir. */
export function ServingToggle({
  jar,
  onChange,
  onIntent,
  className,
}: {
  jar: boolean
  onChange: (value: boolean) => void
  /** Kavanoz'a niyetlenildi — görselleri tıklamadan önce indirmeye başlat.
      Dokunmatikte hover yok, orada dolum süresi indirmeyi örtüyor. */
  onIntent?: () => void
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label="Sunum"
      className={cn('relative flex w-[212px] rounded-full bg-cream-200 p-1', className)}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-surface shadow-soft transition-transform duration-[450ms] ease-[var(--ease-soft)]"
        style={{ transform: jar ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {[false, true].map((value) => (
        <button
          key={String(value)}
          type="button"
          aria-pressed={jar === value}
          onMouseEnter={value ? onIntent : undefined}
          onFocus={value ? onIntent : undefined}
          onClick={() => onChange(value)}
          className={cn(
            'relative h-9 flex-1 rounded-full text-sm font-semibold transition-colors duration-300',
            jar === value ? 'text-cocoa-800' : 'text-muted',
          )}
        >
          {value ? 'Kavanoz' : 'Cup'}
        </button>
      ))}
    </div>
  )
}
