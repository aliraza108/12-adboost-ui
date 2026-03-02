'use client'

import { useEffect, useState } from 'react'
import { listCampaigns, getCampaignOverview } from '@/lib/api/campaigns'
import { getOptimizationStatus } from '@/lib/api/optimize'
import Link from 'next/link'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { StatCard } from '@/components/ui/StatCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import type { CampaignResponse } from '@/lib/types'

interface CampaignOverviewSummary {
  variants: number
  experiments: number
  bestCtr?: number
  winners?: number
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [stats, setStats] = useState<CampaignOverviewSummary>({ variants: 0, experiments: 0 })
  const [winners, setWinners] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<{ text: string; time: string }[]>([])
  const [overviewMap, setOverviewMap] = useState<Record<string, CampaignOverviewSummary>>({})

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const list = await listCampaigns()
        setCampaigns(list.campaigns)

        const overviews = await Promise.all(
          list.campaigns.map((campaign) => getCampaignOverview(campaign.id).catch(() => null))
        )

        const totals = overviews.reduce(
          (acc, overview) => {
            if (!overview) return acc
            acc.variants += overview.total_variants ?? 0
            acc.experiments += overview.total_experiments ?? 0
            acc.winners += overview.winners_identified ?? 0
            acc.bestCtr = Math.max(acc.bestCtr ?? 0, overview.best_ctr ?? 0)
            return acc
          },
          { variants: 0, experiments: 0, winners: 0, bestCtr: 0 }
        )

        setStats({ variants: totals.variants, experiments: totals.experiments, bestCtr: totals.bestCtr })
        setWinners(totals.winners)
        setOverviewMap(
          overviews.reduce((acc, overview) => {
            if (!overview) return acc
            acc[overview.id] = {
              variants: overview.total_variants ?? 0,
              experiments: overview.total_experiments ?? 0,
              bestCtr: overview.best_ctr ?? undefined,
              winners: overview.winners_identified ?? 0
            }
            return acc
          }, {} as Record<string, CampaignOverviewSummary>)
        )

        const statusResponses = await Promise.all(
          list.campaigns.slice(0, 3).map((campaign) => getOptimizationStatus(campaign.id).catch(() => null))
        )

        setActivity(
          statusResponses
            .filter(Boolean)
            .map((status) => ({
              text: status?.phase ?? 'Optimization update',
              time: `${status?.progress_pct ?? 0}% complete`
            }))
        )
        setError(null)
      } catch (err) {
        setError('Unable to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (error) {
    return <ErrorState message={error} onRetry={() => location.reload()} />
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-28" />)
        ) : (
          <>
            <StatCard
              label="Total Campaigns"
              value={campaigns.length}
              badge={`${campaigns.filter((campaign) => campaign.status === 'active').length} active`}
              footnote="Active in studio"
            />
            <StatCard label="Variants Generated" value={stats.variants} />
            <StatCard label="Experiments Run" value={stats.experiments} />
            <StatCard label="Winners Found" value={winners} />
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h2 className="section-title text-2xl text-sand-900">Recent Campaigns</h2>
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  variantsCount={overviewMap[campaign.id]?.variants ?? 0}
                  experimentsCount={overviewMap[campaign.id]?.experiments ?? 0}
                  bestCtr={overviewMap[campaign.id]?.bestCtr}
                />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h2 className="section-title text-2xl text-sand-900">Optimization Activity</h2>
          <div className="card p-5 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-6" />)
            ) : activity.length ? (
              activity.map((item, idx) => (
                <div key={`${item.text}-${idx}`} className="flex items-start gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-terracotta" />
                  <div>
                    <p className="text-sm text-sand-700">{item.text}</p>
                    <p className="text-xs text-sand-500">{item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-sand-600">No activity yet. Start an optimization loop.</p>
            )}
          </div>
        </div>
      </section>

      <section className="card p-8 bg-terracotta text-warm-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl">Start Optimizing Today</h2>
          <p className="text-sm text-warm-white/80 mt-2">
            Trigger an optimization loop to discover your next breakthrough creative.
          </p>
        </div>
        <Link href="/optimize">
          <Button className="bg-warm-white text-terracotta hover:bg-sand-50">Launch Optimization</Button>
        </Link>
      </section>
    </div>
  )
}
