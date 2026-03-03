'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { CampaignResponse } from '@/lib/types'

interface CampaignCardProps {
  campaign: CampaignResponse
  variantsCount?: number
  experimentsCount?: number
  bestCtr?: number
}

export function CampaignCard({ campaign, variantsCount = 0, experimentsCount = 0, bestCtr }: CampaignCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-2xl text-sand-900">{campaign.name}</h3>
          <p className="mt-1 text-sm italic text-sand-600">{campaign.audience_segment}</p>
        </div>
        <span className={`h-3 w-3 rounded-full ${campaign.status === 'active' ? 'bg-sage' : 'bg-sand-400'}`} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge goal={campaign.goal}>{campaign.goal}</Badge>
        <Badge status={campaign.status === 'active' ? 'active' : 'paused'}>{campaign.status}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-sand-600">
        <div>
          <p className="font-mono text-sand-800">{variantsCount}</p>
          <p>Variants</p>
        </div>
        <div>
          <p className="font-mono text-sand-800">{experimentsCount}</p>
          <p>Experiments</p>
        </div>
        <div>
          <p className="font-mono text-sand-800">{typeof bestCtr === 'number' ? bestCtr.toFixed(3) : 'N/A'}</p>
          <p>Best CTR</p>
        </div>
      </div>
      <Link
        href={`/campaigns/${campaign.id}`}
        className="mt-5 inline-flex text-sm text-terracotta hover:underline"
      >
        View Campaign &rarr;
      </Link>
    </motion.div>
  )
}
