import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const controlBase =
  'w-full rounded-md border border-line bg-surface px-4 text-[0.95rem] text-cocoa-800 placeholder:text-muted/70 ' +
  'transition-colors duration-200 hover:border-cocoa-200 focus:border-cocoa-400 focus:outline-none ' +
  'focus:ring-4 focus:ring-cocoa-100 disabled:opacity-60'

function FieldShell({
  label,
  error,
  hint,
  htmlFor,
  required,
  children,
}: {
  label?: string
  error?: string
  hint?: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-cocoa-700">
          {label}
          {required && <span className="ml-0.5 text-blush-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-[var(--color-error)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, required, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={inputId} required={required}>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(controlBase, 'h-12', error && 'border-[var(--color-error)] focus:ring-blush-100', className)}
        {...props}
      />
    </FieldShell>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, required, rows = 3, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={inputId} required={required}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, 'resize-none py-3 leading-relaxed', error && 'border-[var(--color-error)]', className)}
        {...props}
      />
    </FieldShell>
  )
})

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, required, children, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={inputId} required={required}>
      <select
        ref={ref}
        id={inputId}
        required={required}
        className={cn(controlBase, 'h-12 cursor-pointer appearance-none bg-[length:16px] pr-10', className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238c7c6e' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  )
})
