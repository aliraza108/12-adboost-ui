'use client'

import { useEffect, useState } from 'react'
import { listCampaigns } from '@/lib/api/campaigns'
import { runOptimizationLoop, runAutoExperiment, getOptimizationStatus } from '@/lib/api/optimize'
import { OptimizationPanel } from '@/components/optimize/OptimizationPanel'
import { AgentThinking } from '@/components/ui/AgentThinking'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { CampaignResponse, OptimizationIteration, OptimizationStatus } from '@/lib/types'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api/error'

export default function OptimizePage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [iterations, setIterations] = useState(1)
  const [mode, setMode] = useState<'loop' | 'auto'>('loop')
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<OptimizationIteration[]>([])
  const [status, setStatus] = useState<OptimizationStatus | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await listCampaigns()
      setCampaigns(data.campaigns)
      setSelectedId(data.campaigns[0]?.id ?? '')
      setError(null)
    } catch (err) {
      setError('Unable to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const loadStatus = async () => {
      if (!selectedId) return
      try {
        const data = await getOptimizationStatus(selectedId)
        setStatus(data)
      } catch (err) {
        setStatus(null)
      }
    }
    loadStatus()
  }, [selectedId])

  if (error) {
    return <ErrorState message={error} onRetry={load} />
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {loading ? (
        <Skeleton className="h-80" />
      ) : (
        <OptimizationPanel
          campaigns={campaigns}
          selectedId={selectedId}
          iterations={iterations}
          mode={mode}
          onSelectCampaign={setSelectedId}
          onIterationsChange={setIterations}
          onModeChange={setMode}
          onRun={async () => {
            if (!selectedId) return
            try {
              setRunning(true)
              if (mode === 'loop') {
                const response = await runOptimizationLoop({ campaign_id: selectedId, iterations })
                setResults(response.iterations)
              } else {
                await runAutoExperiment(selectedId, 3)
                toast.success('Auto experiment started')
              }
            } catch (err) {
              toast.error(getErrorMessage(err, 'Optimization failed'))
            } finally {
              setRunning(false)
            }
          }}
          loading={running}
        />
      )}

      <div className="space-y-4">
        <h2 className="section-title text-2xl text-sand-900">Iteration Results</h2>
        {running ? <AgentThinking message="Optimization loop running" /> : null}
        {status ? (
          <div className="card p-5">
            <p className="text-sm text-sand-700">{status.phase}</p>
            <div className="mt-3 h-2 rounded-full bg-sand-200">
              <div className="h-full rounded-full bg-terracotta" style={{ width: `${status.progress_pct}%` }} />
            </div>
          </div>
        ) : null}
        <div className="space-y-4">
          {results.map((iteration) => (
            <div key={iteration.iteration} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl text-sand-900">Iteration {iteration.iteration}</p>
                <span className="text-xs text-sand-500">+{iteration.new_variants_created} variants</span>
              </div>
              <p className="mt-3 text-sm text-sand-600">{iteration.strategy}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {iteration.new_variants.map((variant) => (
                  <span key={variant.id} className="rounded-full bg-sand-100 px-3 py-1 text-xs text-sand-700">
                    {variant.creative.headline.slice(0, 24)}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-sand-500">
                Projected CTR: {iteration.current_best_ctr.toFixed(3)}
              </p>
            </div>
          ))}
          {results.length === 0 && !running ? (
            <p className="text-sm text-sand-600">No iterations yet. Run an optimization loop.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
