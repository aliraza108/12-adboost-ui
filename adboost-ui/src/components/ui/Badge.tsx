import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  goal?: 'clicks' | 'signups' | 'sales' | 'impressions' | 'leads'
  status?: 'winner' | 'testing' | 'active' | 'paused' | 'draft' | 'loser'
}

const goalStyles: Record<string, string> = {
  clicks: 'bg-sand-200 text-sand-700',
  signups: 'bg-sage/20 text-sage',
  sales: 'bg-terracotta/20 text-terracotta',
  impressions: 'bg-sand-300 text-sand-800',
  leads: 'bg-sage-light text-sage'
}

const statusStyles: Record<string, string> = {
  winner: 'bg-[#e0b46a] text-sand-900',
  testing: 'bg-sand-300 text-sand-800',
  active: 'bg-sage-light text-sage',
  paused: 'bg-sand-200 text-sand-700',
  draft: 'bg-sand-100 text-sand-600',
  loser: 'bg-sand-100 text-sand-600'
}

export function Badge({ goal, status, className, ...props }: BadgeProps) {
  const tone = goal ? goalStyles[goal] : status ? statusStyles[status] : 'bg-sand-200 text-sand-700'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        tone,
        className
      )}
      {...props}
    />
  )
}
