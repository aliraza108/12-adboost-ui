'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { listVariantsByCampaign, generateVariants } from '@/lib/api/variants'
import { VariantCard } from '@/components/variants/VariantCard'
import { GenerateVariantsForm } from '@/components/variants/GenerateVariantsForm'
import { AgentThinking } from '@/components/ui/AgentThinking'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Variant } from '@/lib/types'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api/error'

export default function VariantsPage() {
  const params = useParams()
  const id = params?.id as string
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [generating, setGenerating] = useState(false)

  const loadVariants = async () => {
    try {
      setLoading(true)
      const data = await listVariantsByCampaign(id)
      setVariants(data.variants)
      setError(null)
    } catch (err) {
      setError('Unable to load variants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) loadVariants()
  }, [id])

  if (error) {
    return <ErrorState message={error} onRetry={loadVariants} />
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="section-title text-2xl text-sand-900">Variants</h2>
        <Button onClick={() => setDrawerOpen(true)}>Generate Variants</Button>
      </div>

      {generating ? <AgentThinking message="AI is writing variants" /> : null}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-64" />
          ))}
        </div>
      ) : variants.length === 0 ? (
        <EmptyState
          title="No variants yet"
          subtitle="Generate AI variants to start testing creative directions."
          actionLabel="Generate Variants"
          onAction={() => setDrawerOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant) => (
            <VariantCard key={variant.id} variant={variant} />
          ))}
        </div>
      )}

      {drawerOpen ? (
        <div className="fixed inset-0 bg-sand-900/20 z-40" onClick={() => setDrawerOpen(false)} />
      ) : null}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-warm-white shadow-2xl border-l border-sand-200 p-6 z-50 transform transition-transform ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-sand-900">Generate Variants</h3>
          <button className="text-sand-500" onClick={() => setDrawerOpen(false)}>
            Close
          </button>
        </div>
        <GenerateVariantsForm
          loading={generating}
          onGenerate={async ({ num_variants, focus_element, tones }) => {
            try {
              setGenerating(true)
              await generateVariants({ campaign_id: id, num_variants, focus_element, tones })
              toast.success('Variants generated')
              setDrawerOpen(false)
              await loadVariants()
            } catch (err) {
              toast.error(getErrorMessage(err, 'Unable to generate variants'))
            } finally {
              setGenerating(false)
            }
          }}
        />
      </div>
    </div>
  )
}
