import { cn } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  delta?: number
  footnote?: string
  badge?: string
}

export function StatCard({ label, value, delta, footnote, badge }: StatCardProps) {
  const isUp = typeof delta === 'number' && delta >= 0

  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-sand-500">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="font-display text-3xl text-sand-900">{value}</span>
        {badge ? (
          <span className="inline-flex items-center rounded-full bg-sand-100 px-2 py-1 text-xs font-semibold text-sand-700">
            {badge}
          </span>
        ) : null}
        {typeof delta === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
              isUp ? 'bg-sage-light text-sage' : 'bg-terracotta/20 text-terracotta'
            )}
          >
            {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {footnote ? <p className="mt-2 text-xs text-sand-500">{footnote}</p> : null}
    </div>
  )
}
