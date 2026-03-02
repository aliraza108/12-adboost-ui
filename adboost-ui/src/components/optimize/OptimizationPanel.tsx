'use client'

import { Button } from '@/components/ui/Button'
import type { CampaignResponse } from '@/lib/types'

interface OptimizationPanelProps {
  campaigns: CampaignResponse[]
  selectedId?: string
  iterations: number
  mode: 'loop' | 'auto'
  onSelectCampaign: (id: string) => void
  onIterationsChange: (value: number) => void
  onModeChange: (value: 'loop' | 'auto') => void
  onRun: () => void
  loading?: boolean
}

export function OptimizationPanel({
  campaigns,
  selectedId,
  iterations,
  mode,
  onSelectCampaign,
  onIterationsChange,
  onModeChange,
  onRun,
  loading
}: OptimizationPanelProps) {
  return (
    <div className="card p-6 space-y-6">
      <div>
        <p className="text-sm text-sand-700 mb-2">Campaign</p>
        <select
          value={selectedId}
          onChange={(event) => onSelectCampaign(event.target.value)}
          className="w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
        >
          <option value="">Select campaign</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-sm text-sand-700 mb-2">Optimization Loops</p>
        <input
          type="range"
          min={1}
          max={5}
          value={iterations}
          onChange={(event) => onIterationsChange(Number(event.target.value))}
          className="w-full"
        />
        <p className="text-sm text-sand-600 mt-1">{iterations} iterations</p>
      </div>
      <div>
        <p className="text-sm text-sand-700 mb-2">Mode</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onModeChange('loop')}
            className={`rounded-full border px-3 py-1 text-xs ${
              mode === 'loop'
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-sand-200 text-sand-600'
            }`}
          >
            Optimize Loop
          </button>
          <button
            type="button"
            onClick={() => onModeChange('auto')}
            className={`rounded-full border px-3 py-1 text-xs ${
              mode === 'auto'
                ? 'border-terracotta bg-terracotta/10 text-terracotta'
                : 'border-sand-200 text-sand-600'
            }`}
          >
            Auto Experiment
          </button>
        </div>
      </div>
      <Button className="w-full" onClick={onRun} loading={loading}>
        Run Optimization
      </Button>
    </div>
  )
}
