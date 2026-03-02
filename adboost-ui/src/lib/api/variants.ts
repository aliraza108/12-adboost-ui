import { apiClient } from './client'
import type { VariantGenerateRequest, VariantGenerateResponse, VariantListResponse, Variant } from '@/lib/types'

export const listVariantsByCampaign = (campaignId: string) =>
  apiClient.get<VariantListResponse>(`/api/v1/variants/campaign/${campaignId}`).then((r) => r.data)

export const getVariant = (variantId: string) =>
  apiClient.get<Variant>(`/api/v1/variants/${variantId}`).then((r) => r.data)

export const generateVariants = (data: VariantGenerateRequest) =>
  apiClient.post<VariantGenerateResponse>('/api/v1/variants/generate', data).then((r) => r.data)
