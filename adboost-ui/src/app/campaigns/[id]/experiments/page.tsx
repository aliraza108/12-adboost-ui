'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { listExperimentsByCampaign, createExperiment, simulateExperiment, analyzeExperiment } from '@/lib/api/experiments'
import { listVariantsByCampaign } from '@/lib/api/variants'
import { ExperimentCard } from '@/components/experiments/ExperimentCard'
import { CreateExperimentForm } from '@/components/experiments/CreateExperimentForm'
import { AgentThinking } from '@/components/ui/AgentThinking'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Experiment, Variant } from '@/lib/types'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api/error'

export default function ExperimentsPage() {
  const params = useParams()
  const id = params?.id as string
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [thinking, setThinking] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const [expData, variantData] = await Promise.all([
        listExperimentsByCampaign(id),
        listVariantsByCampaign(id)
      ])
      setExperiments(expData.experiments)
      setVariants(variantData.variants)
      setError(null)
    } catch (err) {
      setError('Unable to load experiments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) load()
  }, [id])

  if (error) {
    return <ErrorState message={error} onRetry={load} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title text-2xl text-sand-900">Experiments</h2>
        <Button onClick={() => setModalOpen(true)}>Create Experiment</Button>
      </div>

      {thinking ? <AgentThinking message="Analyzing experiment" /> : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40" />
          ))}
        </div>
      ) : experiments.length === 0 ? (
        <EmptyState
          title="No experiments yet"
          subtitle="Choose variants to begin an A/B experiment."
          actionLabel="Create Experiment"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              variants={variants.filter((variant) => experiment.variant_ids.includes(variant.id))}
              onSimulate={async (events) => {
                try {
                  setThinking(true)
                  await simulateExperiment({ experiment_id: experiment.id, num_events: events })
                  toast.success('Simulation complete')
                } catch (err) {
                  toast.error(getErrorMessage(err, 'Simulation failed'))
                } finally {
                  setThinking(false)
                }
              }}
              onAnalyze={async () => {
                try {
                  setThinking(true)
                  await analyzeExperiment(experiment.id)
                  toast.success('Analysis complete')
                } catch (err) {
                  toast.error(getErrorMessage(err, 'Analysis failed'))
                } finally {
                  setThinking(false)
                }
              }}
            />
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-40 bg-sand-900/20" onClick={() => setModalOpen(false)} />
      ) : null}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          modalOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`card w-full max-w-lg p-6 transition ${
            modalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-2xl text-sand-900">Create Experiment</h3>
            <button className="text-sand-500" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
          <CreateExperimentForm
            campaignId={id}
            variants={variants.filter((variant) => variant.status === 'draft')}
            onSubmit={async (payload) => {
              try {
                setThinking(true)
                await createExperiment(payload)
                toast.success('Experiment created')
                setModalOpen(false)
                await load()
              } catch (err) {
                toast.error(getErrorMessage(err, 'Unable to create experiment'))
              } finally {
                setThinking(false)
              }
            }}
            loading={thinking}
          />
        </div>
      </div>
    </div>
  )
}
