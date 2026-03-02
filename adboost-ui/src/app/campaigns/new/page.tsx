'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CampaignForm } from '@/components/campaigns/CampaignForm'
import { createCampaign } from '@/lib/api/campaigns'
import { getErrorMessage } from '@/lib/api/error'
import { toast } from 'sonner'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto max-w-[680px]">
      <CampaignForm
        loading={loading}
        onSubmit={async (data) => {
          try {
            setLoading(true)
            const response = await createCampaign(data)
            toast.success('Campaign created')
            router.push(`/campaigns/${response.id}`)
          } catch (err) {
            toast.error(getErrorMessage(err, 'Unable to create campaign'))
          } finally {
            setLoading(false)
          }
        }}
      />
    </div>
  )
}
