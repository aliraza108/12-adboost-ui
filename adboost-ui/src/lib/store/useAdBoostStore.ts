import { create } from 'zustand'
import type { CampaignResponse } from '@/lib/types'

interface AdBoostState {
  campaigns: CampaignResponse[]
  setCampaigns: (campaigns: CampaignResponse[]) => void
  activeCampaignId?: string
  setActiveCampaignId: (id?: string) => void
}

export const useAdBoostStore = create<AdBoostState>((set) => ({
  campaigns: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  activeCampaignId: undefined,
  setActiveCampaignId: (id) => set({ activeCampaignId: id })
}))
