import { cn } from '@/lib/utils'

interface StatSignificanceMeterProps {
  value: number
  threshold?: number
}

export function StatSignificanceMeter({ value, threshold = 0.95 }: StatSignificanceMeterProps) {
  const pct = Math.min(Math.max(value, 0), 1)
  const isSignificant = pct >= threshold

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-sand-600 mb-2">
        <span>{isSignificant ? 'Statistically Significant' : 'Gathering Confidence'}</span>
        <span className="font-mono">{(pct * 100).toFixed(1)}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-sand-200 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all',
            isSignificant ? 'bg-terracotta shadow-[0_0_12px_rgba(200,96,42,0.35)]' : 'bg-sand-400'
          )}
          style={{ width: `${pct * 100}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 border-r border-dashed border-sand-700/60"
          style={{ left: `${threshold * 100}%` }}
        />
      </div>
    </div>
  )
}
