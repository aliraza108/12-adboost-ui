import { Trophy } from 'lucide-react'
import type { Variant } from '@/lib/types'

interface WinnerBannerProps {
  winner?: Variant
  significance?: number
}

export function WinnerBanner({ winner, significance }: WinnerBannerProps) {
  if (!winner) return null

  return (
    <div className="card p-6 bg-gradient-to-r from-terracotta/90 via-terracotta/70 to-sage/60 text-warm-white">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-warm-white/20 flex items-center justify-center">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em]">Winning Variant</p>
          <h3 className="font-display text-3xl">{winner.creative.headline}</h3>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span>CTR: {(winner.ctr ?? winner.predictions.predicted_ctr * 1).toFixed(3)}</span>
        <span>CVR: {(winner.cvr ?? winner.predictions.predicted_cvr * 1).toFixed(3)}</span>
        {typeof significance === 'number' ? <span>{(significance * 100).toFixed(1)}% confidence</span> : null}
      </div>
    </div>
  )
}
