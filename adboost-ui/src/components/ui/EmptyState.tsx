import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title: string
  subtitle: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sand-100 text-terracotta">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-2xl text-sand-900">{title}</h3>
      <p className="mt-2 text-sm text-sand-600">{subtitle}</p>
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}
