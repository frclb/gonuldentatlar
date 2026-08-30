import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.75rem] md:text-[2rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </header>
  )
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-xl bg-surface shadow-soft', className)}>{children}</div>
}

/** Yatay kaydırmalı tablo sarmalayıcı — dar ekranlarda taşma olmaz. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </AdminCard>
  )
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn('whitespace-nowrap px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider text-muted', className)}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 align-middle text-sm text-cocoa-700', className)}>{children}</td>
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-olive-500' : 'bg-cream-300',
      )}
    >
      <span
        className={cn(
          'absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-soft transition-transform duration-200',
          checked ? 'translate-x-[1.25rem]' : 'translate-x-0',
        )}
      />
    </button>
  )
}
