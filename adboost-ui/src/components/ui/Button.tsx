'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' &&
          'bg-terracotta text-warm-white hover:bg-[#b65425] shadow-sm',
        variant === 'secondary' &&
          'bg-sand-100 text-sand-700 border border-sand-200 hover:border-terracotta hover:text-sand-900',
        variant === 'ghost' &&
          'bg-transparent text-sand-600 hover:bg-sand-100 hover:text-sand-900',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-warm-white/60 border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}
