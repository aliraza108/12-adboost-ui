import { apiClient } from './client'
import type { OptimizationRequest, OptimizationResponse, OptimizationStatus } from '@/lib/types'

export const runOptimizationLoop = (data: OptimizationRequest) =>
  apiClient.post<OptimizationResponse>('/api/v1/optimize/loop', data).then((r) => r.data)

export const runAutoExperiment = (campaignId: string, numVariants = 3) =>
  apiClient
    .post(`/api/v1/optimize/auto-experiment?campaign_id=${campaignId}&num_variants=${numVariants}`)
    .then((r) => r.data)

export const getOptimizationStatus = (campaignId: string) =>
  apiClient.get<OptimizationStatus>(`/api/v1/optimize/campaign/${campaignId}/status`).then((r) => r.data)
