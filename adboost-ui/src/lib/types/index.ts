export type GoalType = 'clicks' | 'signups' | 'sales' | 'impressions' | 'leads'

export type CampaignStatus = 'active' | 'paused'

export type VariantStatus = 'draft' | 'testing' | 'winner' | 'loser' | 'paused'

export type ExperimentStatus = 'running' | 'completed' | 'paused' | 'insufficient_data'

export type FocusElement = 'all' | 'headline' | 'cta' | 'body'

export type VariantTone =
  | 'urgency'
  | 'curiosity'
  | 'social_proof'
  | 'benefit_driven'
  | 'fear_of_missing_out'
  | 'empathy'
  | 'authority'
  | 'humor'

export interface BaseCreative {
  headline: string
  body?: string
  cta: string
  image_description?: string
}

export interface CampaignCreate {
  name: string
  goal: GoalType
  audience_segment: string
  base_creative: BaseCreative
  budget?: number
  tags: string[]
}

export interface CampaignResponse extends CampaignCreate {
  id: string
  status: CampaignStatus
  created_at: string
}

export interface CampaignListResponse {
  campaigns: CampaignResponse[]
  total: number
}

export interface CampaignOverview {
  id: string
  name: string
  goal: GoalType
  status: CampaignStatus
  base_creative: BaseCreative
  total_variants: number
  total_experiments: number
  best_ctr?: number
  winners_identified?: number
}

export interface VariantCreative {
  headline: string
  body?: string
  cta: string
  image_description?: string
  tone: VariantTone
  emotional_trigger: string
  ai_reasoning?: string
}

export interface VariantPredictions {
  predicted_ctr: number
  predicted_cvr: number
  engagement_score: number
}

export interface Variant {
  id: string
  campaign_id: string
  creative: VariantCreative
  predictions: VariantPredictions
  status: VariantStatus
  impressions: number
  clicks: number
  conversions: number
  ctr: number | null
  cvr: number | null
  created_at: string
}

export interface VariantListResponse {
  total: number
  variants: Variant[]
}

export interface VariantGenerateRequest {
  campaign_id: string
  num_variants: number
  tones: VariantTone[]
  focus_element: FocusElement
}

export interface VariantGenerateResponse {
  summary: string
  variants: Variant[]
}

export interface ExperimentCreate {
  campaign_id: string
  variant_ids: string[]
  traffic_split?: Record<string, number>
  target_sample_size: number
  confidence_level: number
  duration_hours: number
}

export interface Experiment {
  id: string
  campaign_id: string
  variant_ids: string[]
  status: ExperimentStatus
  winner_id: string | null
  statistical_significance: number
  confidence_level: number
  traffic_split: Record<string, number>
  target_sample_size: number
  created_at: string
}

export interface ExperimentListResponse {
  total: number
  experiments: Experiment[]
}

export interface ExperimentSimulateRequest {
  experiment_id: string
  num_events: number
}

export interface AnalyticsReport {
  campaign_id: string
  campaign_name: string
  total_experiments: number
  completed_experiments: number
  winners_identified: number
  total_variants_tested: number
  performance_summary: {
    best_ctr: number
    total_impressions: number
    total_clicks: number
  }
  ai_report: string
  winners: Variant[]
}

export interface AnalyticsTrends {
  campaign_id: string
  total_variants: number
  tone_performance_avg: Record<string, number>
  top_performer: Variant
  bottom_performer: Variant
  all_variants_ranked: Variant[]
}

export interface OptimizationStatus {
  campaign_id: string
  phase: string
  progress_pct: number
  stats: {
    variants_generated: number
    experiments_run: number
    experiments_completed: number
    winners_found: number
  }
  best_variant?: {
    headline: string
    ctr: number
  }
  recommended_next_action?: string
}

export interface OptimizationRequest {
  campaign_id: string
  iterations: number
}

export interface OptimizationIteration {
  iteration: number
  variants_before: number
  variants_after: number
  new_variants_created: number
  current_best_ctr: number
  strategy: string
  new_variants: Variant[]
}

export interface OptimizationResponse {
  campaign_id: string
  optimization_complete: boolean
  total_iterations: number
  total_variants_in_system: number
  iterations: OptimizationIteration[]
  next_step: string
}
