'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCampaignOverview, listCampaigns } from '@/lib/api/campaigns'
import { CampaignCard } from '@/components/campaigns/CampaignCard'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import type { CampaignResponse } from '@/lib/types'
import type { CampaignOverview } from '@/lib/types'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([])
  const [overviewMap, setOverviewMap] = useState<Record<string, CampaignOverview>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await listCampaigns()
        setCampaigns(data.campaigns)
        const overviews = await Promise.all(
          data.campaigns.map((campaign) => getCampaignOverview(campaign.id).catch(() => null))
        )
        setOverviewMap(
          overviews.reduce((acc, overview) => {
            if (!overview) return acc
            acc[overview.id] = overview
            return acc
          }, {} as Record<string, CampaignOverview>)
        )
        setError(null)
      } catch (err) {
        setError('Unable to load campaigns.')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title text-2xl text-sand-900">Campaigns</h2>
        <Link href="/campaigns/new">
          <Button>New Campaign</Button>
        </Link>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          subtitle="Create your first campaign to start generating variants."
          actionLabel="Create Campaign"
          onAction={() => (window.location.href = '/campaigns/new')}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              variantsCount={overviewMap[campaign.id]?.total_variants ?? 0}
              experimentsCount={overviewMap[campaign.id]?.total_experiments ?? 0}
              bestCtr={overviewMap[campaign.id]?.best_ctr}
            />
          ))}
        </div>
      )}
    </div>
  )
}
