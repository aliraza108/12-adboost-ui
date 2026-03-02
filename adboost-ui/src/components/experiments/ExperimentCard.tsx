'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatSignificanceMeter } from '@/components/experiments/StatSignificanceMeter'
import type { Experiment, Variant } from '@/lib/types'

interface ExperimentCardProps {
  experiment: Experiment
  variants: Variant[]
  onSimulate?: (events: number) => void
  onAnalyze?: () => void
}

export function ExperimentCard({ experiment, variants, onSimulate, onAnalyze }: ExperimentCardProps) {
  const [events, setEvents] = useState(500)
  const splitSource = experiment.traffic_split ?? {}
  const splitEntries = variants.map((variant) => ({
    id: variant.id,
    label: variant.creative.headline.slice(0, 18),
    pct: splitSource[variant.id] ?? 0
  }))
  const totalPct = splitEntries.reduce((acc, entry) => acc + entry.pct, 0)
  const normalizedSplits =
    totalPct > 0
      ? splitEntries
      : splitEntries.map((entry) => ({ ...entry, pct: Number((100 / Math.max(variants.length, 1)).toFixed(2)) }))

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-sand-500">{experiment.id.slice(0, 10)}...</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge status={experiment.status === 'running' ? 'active' : 'paused'}>{experiment.status}</Badge>
            <span className="text-xs text-sand-500">{(experiment.confidence_level * 100).toFixed(0)}% confidence</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onSimulate?.(events)}>
            Simulate Traffic
          </Button>
          <Button variant="ghost" onClick={onAnalyze}>Analyze</Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {variants.map((variant) => (
          <span key={variant.id} className="rounded-full bg-sand-100 px-3 py-1 text-xs text-sand-700">
            {variant.creative.headline.slice(0, 24)}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs text-sand-600 mb-2">Traffic split</p>
        <div className="flex h-2 overflow-hidden rounded-full bg-sand-200">
          {normalizedSplits.map((entry, idx) => (
            <div
              key={entry.id}
              className={idx % 2 === 0 ? 'bg-terracotta/70' : 'bg-sand-400'}
              style={{ width: `${entry.pct}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-sand-500">
          {normalizedSplits.map((entry) => (
            <span key={`${entry.id}-label`}>
              {entry.label}: {entry.pct.toFixed(0)}%
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <StatSignificanceMeter value={experiment.statistical_significance ?? 0} />
      </div>
      <div className="mt-4">
        <p className="text-xs text-sand-600 mb-2">Simulation events</p>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={events}
          onChange={(event) => setEvents(Number(event.target.value))}
          className="w-full"
        />
        <p className="text-xs text-sand-500 mt-1">{events} events</p>
      </div>
      {experiment.winner_id ? (
        <div className="mt-4 relative overflow-hidden rounded-lg border border-sage/40 bg-gradient-to-r from-sage-light via-warm-white to-terracotta/10 p-4">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(200, 96, 42, 0.25) 0 2px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(74, 124, 111, 0.3) 0 2px, transparent 2px), radial-gradient(circle at 50% 80%, rgba(200, 96, 42, 0.2) 0 2px, transparent 2px)'
            }}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-sand-600">Winner announced</p>
            <p className="mt-2 font-display text-xl text-sand-900">
              {variants.find((v) => v.id === experiment.winner_id)?.creative.headline ?? 'TBD'}
            </p>
            <p className="mt-1 text-xs text-sand-600">Confetti! Winner locked for rollout.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
