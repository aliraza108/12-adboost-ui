import { apiClient } from './client'
import type { AnalyticsReport, AnalyticsTrends } from '@/lib/types'

export const getAnalyticsReport = (campaignId: string) =>
  apiClient.get<AnalyticsReport>(`/api/v1/analytics/campaign/${campaignId}/report`).then((r) => r.data)

export const getAnalyticsTrends = (campaignId: string) =>
  apiClient.get<AnalyticsTrends>(`/api/v1/analytics/campaign/${campaignId}/trends`).then((r) => r.data)

export const getExperimentInsights = (experimentId: string) =>
  apiClient.get(`/api/v1/analytics/experiment/${experimentId}/insights`).then((r) => r.data)
