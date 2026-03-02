'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import type { Variant } from '@/lib/types'

interface VariantCardProps {
  variant: Variant
}

export function VariantCard({ variant }: VariantCardProps) {
  const isWinner = variant.status === 'winner'
  const delta =
    typeof variant.ctr === 'number' && typeof variant.predictions.predicted_ctr === 'number'
      ? variant.ctr - variant.predictions.predicted_ctr
      : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      className={`card p-5 relative ${isWinner ? 'border border-terracotta/60 shadow-[0_0_20px_rgba(200,96,42,0.25)]' : ''}`}
    >
      {isWinner ? (
        <div className="absolute top-4 right-4 rounded-full bg-terracotta text-warm-white px-3 py-1 text-xs font-semibold">
          Winner
        </div>
      ) : null}
      <h3 className="font-display text-xl text-sand-900">{variant.creative.headline}</h3>
      <p className="mt-2 text-sm text-sand-600">{variant.creative.body ?? 'No body copy provided.'}</p>
      <div className="mt-4">
        <button className="rounded-lg bg-terracotta text-warm-white px-4 py-2 text-sm">
          {variant.creative.cta}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge status={variant.status}>{variant.status}</Badge>
        <Badge>{variant.creative.tone}</Badge>
        {variant.creative.emotional_trigger ? (
          <Badge className="bg-sand-100 text-sand-700">
            {variant.creative.emotional_trigger}
          </Badge>
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-sand-600">
        <div>
          <p className="font-mono text-sand-800">{variant.predictions.predicted_ctr.toFixed(4)}</p>
          <p>Pred CTR</p>
        </div>
        <div>
          <p className="font-mono text-sand-800">{variant.predictions.predicted_cvr.toFixed(4)}</p>
          <p>Pred CVR</p>
        </div>
        <div>
          <p className="font-mono text-sand-800">{variant.predictions.engagement_score.toFixed(1)}</p>
          <p>Eng Score</p>
        </div>
      </div>
      {variant.ctr !== null ? (
        <div className="mt-4 text-xs text-sand-600">
          Actual CTR: <span className="font-mono text-sand-800">{variant.ctr.toFixed(4)}</span>
          {delta !== null ? (
            <span className={`ml-2 ${delta >= 0 ? 'text-sage' : 'text-terracotta'}`}>
              {delta >= 0 ? 'up' : 'down'} {Math.abs(delta).toFixed(4)}
            </span>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  )
}
