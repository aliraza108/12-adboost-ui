'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAnalyticsReport, getAnalyticsTrends } from '@/lib/api/analytics'
import { CTRChart } from '@/components/analytics/CTRChart'
import { WinnerBanner } from '@/components/analytics/WinnerBanner'
import { PatternsList } from '@/components/analytics/PatternsList'
import { AgentThinking } from '@/components/ui/AgentThinking'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Copy } from 'lucide-react'
import type { AnalyticsReport, AnalyticsTrends } from '@/lib/types'

function renderMarkdownBlocks(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return (
        <h4 key={index} className="font-display text-xl text-sand-900 mt-4">
          {line.replace('### ', '')}
        </h4>
      )
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={index} className="font-display text-2xl text-sand-900 mt-5">
          {line.replace('## ', '')}
        </h3>
      )
    }
    if (line.startsWith('# ')) {
      return (
        <h2 key={index} className="font-display text-3xl text-sand-900 mt-6">
          {line.replace('# ', '')}
        </h2>
      )
    }
    return (
      <p key={index} className="text-sm text-sand-600 mt-2">
        {line}
      </p>
    )
  })
}

export default function AnalyticsPage() {
  const params = useParams()
  const id = params?.id as string
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [reportData, trendData] = await Promise.all([
          getAnalyticsReport(id),
          getAnalyticsTrends(id)
        ])
        setReport(reportData)
        setTrends(trendData)
        setError(null)
      } catch (err) {
        setError('Unable to load analytics')
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [id])

  const chartData = useMemo(() => {
    if (!trends) return []
    return trends.all_variants_ranked.map((variant) => ({
      name: variant.creative.headline.slice(0, 12),
      predicted: variant.predictions.predicted_ctr,
      actual: variant.ctr ?? 0
    }))
  }, [trends])

  const patterns = useMemo(() => {
    if (!trends) return []
    return Object.entries(trends.tone_performance_avg)
      .slice(0, 4)
      .map(([tone, value]) => ({
        title: tone.replace(/_/g, ' '),
        description: `Average CTR ${(value * 100).toFixed(2)}% across this tone.`
      }))
  }, [trends])

  if (error) {
    return <ErrorState message={error} onRetry={() => location.reload()} />
  }

  if (!loading && (!report || !trends)) {
    return (
      <EmptyState
        title="No analytics yet"
        subtitle="Complete an experiment to unlock AI insights and performance trends."
        actionLabel="Go to Experiments"
        onAction={() => (window.location.href = `/campaigns/${id}/experiments`)}
      />
    )
  }

  return (
    <div className="space-y-8">
      {loading ? <AgentThinking message="Compiling analytics report" /> : null}

      {loading ? (
        <Skeleton className="h-80" />
      ) : (
        <>
          <CTRChart data={chartData} />
          <WinnerBanner winner={report?.winners?.[0]} significance={0.95} />
          <section className="space-y-4">
            <h3 className="section-title text-2xl text-sand-900">Winning Patterns</h3>
            <PatternsList patterns={patterns} />
          </section>
          <section className="card p-6">
            <details open>
              <summary className="font-display text-2xl text-sand-900 cursor-pointer">AI Report</summary>
              <div className="mt-4">{report?.ai_report ? renderMarkdownBlocks(report.ai_report) : null}</div>
            </details>
          </section>
          <section className="space-y-4">
            <h3 className="section-title text-2xl text-sand-900">Recommendations</h3>
            <div className="grid gap-4">
              {(patterns.slice(0, 3) || []).map((pattern, index) => (
                <div key={pattern.title} className="card p-5 flex items-start gap-4">
                  <div className="font-display text-3xl text-terracotta">{index + 1}</div>
                  <div>
                    <p className="text-sm text-sand-700">{pattern.description}</p>
                  </div>
                  <Button variant="ghost" className="ml-auto" aria-label="Copy recommendation">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
