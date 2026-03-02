'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCampaignOverview } from '@/lib/api/campaigns'
import { getOptimizationStatus } from '@/lib/api/optimize'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import type { CampaignOverview, OptimizationStatus } from '@/lib/types'

export default function CampaignOverviewPage() {
  const params = useParams()
  const id = params?.id as string
  const [overview, setOverview] = useState<CampaignOverview | null>(null)
  const [status, setStatus] = useState<OptimizationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [overviewData, statusData] = await Promise.all([
          getCampaignOverview(id),
          getOptimizationStatus(id)
        ])
        setOverview(overviewData)
        setStatus(statusData)
        setError(null)
      } catch (err) {
        setError('Unable to load campaign overview')
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [id])

  if (error) {
    return <ErrorState message={error} onRetry={() => location.reload()} />
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-3 text-sm text-sand-600">
        {['overview', 'variants', 'experiments', 'analytics'].map((tab) => (
          <Link
            key={tab}
            href={tab === 'overview' ? `/campaigns/${id}` : `/campaigns/${id}/${tab}`}
            className={`rounded-full border px-3 py-1 ${
              tab === 'overview' ? 'border-terracotta text-terracotta' : 'border-sand-200'
            }`}
          >
            {tab}
          </Link>
        ))}
      </nav>

      {loading || !overview ? (
        <Skeleton className="h-60" />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-3xl text-sand-900">{overview.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge goal={overview.goal}>{overview.goal}</Badge>
              <Badge status={overview.status === 'active' ? 'active' : 'paused'}>{overview.status}</Badge>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-2xl text-sand-900">Base Creative</h3>
            <p className="mt-3 text-sm text-sand-700">{overview.base_creative?.headline}</p>
            <p className="mt-2 text-sm text-sand-600">{overview.base_creative?.body ?? 'No body copy.'}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-lg bg-terracotta px-3 py-2 text-sm text-warm-white">
                {overview.base_creative?.cta}
              </span>
              <span className="text-xs text-sand-500">{overview.base_creative?.image_description ?? 'No image'}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="card p-4">
              <p className="text-xs uppercase text-sand-500">Variants</p>
              <p className="font-display text-2xl text-sand-900">{overview.total_variants ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-sand-500">Experiments</p>
              <p className="font-display text-2xl text-sand-900">{overview.total_experiments ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-sand-500">Best CTR</p>
              <p className="font-display text-2xl text-sand-900">
                {typeof overview.best_ctr === 'number' ? overview.best_ctr.toFixed(3) : 'N/A'}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase text-sand-500">Winners</p>
              <p className="font-display text-2xl text-sand-900">{overview.winners_identified ?? 0}</p>
            </div>
          </div>

          {status ? (
            <div className="card p-6">
              <p className="text-sm text-sand-700">{status.phase}</p>
              <div className="mt-3 h-2 rounded-full bg-sand-200">
                <div
                  className="h-full rounded-full bg-terracotta"
                  style={{ width: `${status.progress_pct ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-sand-500">{status.progress_pct ?? 0}% complete</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link href={`/campaigns/${id}/variants`}>
              <Button>Generate Variants</Button>
            </Link>
            <Link href={`/campaigns/${id}/experiments`}>
              <Button variant="secondary">Run Auto-Experiment</Button>
            </Link>
            <Link href="/optimize">
              <Button variant="ghost">Optimize Loop</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
