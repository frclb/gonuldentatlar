import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-soft)] ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-cocoa-600 text-cream-50 shadow-soft hover:bg-cocoa-700 hover:shadow-card',
  secondary: 'bg-olive-500 text-white shadow-soft hover:bg-olive-600',
  accent: 'bg-blush-400 text-cocoa-800 shadow-soft hover:bg-blush-500 hover:text-white',
  outline: 'border border-line bg-surface text-cocoa-700 hover:border-cocoa-300 hover:bg-cream-100',
  ghost: 'text-cocoa-700 hover:bg-cream-200',
  whatsapp: 'bg-olive-100 text-olive-700 border border-olive-200 hover:bg-olive-200',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
}

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, ...props },
  ref,
) {
  return <button ref={ref} className={buttonStyles(variant, size, cn(fullWidth && 'w-full', className))} {...props} />
})

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function ButtonLink({ variant = 'primary', size = 'md', fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles(variant, size, cn(fullWidth && 'w-full', className))} {...props} />
}

interface ButtonAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function ButtonAnchor({ variant = 'primary', size = 'md', fullWidth, className, ...props }: ButtonAnchorProps) {
  return <a className={buttonStyles(variant, size, cn(fullWidth && 'w-full', className))} {...props} />
}
