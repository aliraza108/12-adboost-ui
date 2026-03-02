'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import type { CampaignCreate, GoalType } from '@/lib/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  goal: z.enum(['clicks', 'signups', 'sales', 'impressions', 'leads']),
  audience_segment: z.string().min(2, 'Audience segment is required'),
  budget: z.coerce.number().optional(),
  headline: z.string().min(3, 'Headline must be at least 3 characters'),
  body: z.string().optional(),
  cta: z.string().min(2, 'CTA is required'),
  image_description: z.string().optional()
})

type FormValues = z.infer<typeof schema>

interface CampaignFormProps {
  onSubmit: (data: CampaignCreate) => Promise<void>
  loading?: boolean
}

const goalOptions: GoalType[] = ['clicks', 'signups', 'sales', 'impressions', 'leads']

export function CampaignForm({ onSubmit, loading }: CampaignFormProps) {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { goal: 'clicks' } })

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput('')
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name,
          goal: values.goal,
          audience_segment: values.audience_segment,
          budget: values.budget,
          tags,
          base_creative: {
            headline: values.headline,
            body: values.body,
            cta: values.cta,
            image_description: values.image_description
          }
        })
      })}
      className="card p-8 space-y-8"
    >
      <section className="space-y-4">
        <h2 className="section-title text-2xl text-sand-900">Campaign Basics</h2>
        <div className="grid gap-4">
          <label className="text-sm text-sand-700">
            Campaign Name
            <input
              {...register('name')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            />
            {errors.name ? <p className="text-xs text-terracotta mt-1">{errors.name.message}</p> : null}
          </label>
          <div>
            <p className="text-sm text-sand-700 mb-2">Goal</p>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => (
                <label key={goal} className="flex items-center gap-2 text-sm text-sand-600">
                  <input type="radio" value={goal} {...register('goal')} />
                  {goal}
                </label>
              ))}
            </div>
          </div>
          <label className="text-sm text-sand-700">
            Audience Segment
            <textarea
              {...register('audience_segment')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              rows={3}
              placeholder="e.g. startup founders, 25-40, tech-savvy"
            />
            {errors.audience_segment ? (
              <p className="text-xs text-terracotta mt-1">{errors.audience_segment.message}</p>
            ) : null}
          </label>
          <label className="text-sm text-sand-700">
            Budget (optional)
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-sand-200 bg-warm-white px-3 py-2">
              <span className="text-sand-500">$</span>
              <input type="number" {...register('budget')} className="w-full bg-transparent outline-none" />
            </div>
          </label>
          <label className="text-sm text-sand-700">
            Tags
            <div className="mt-2 flex flex-wrap gap-2 rounded-lg border border-sand-200 bg-warm-white px-3 py-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sand-100 px-3 py-1 text-xs text-sand-700">
                  {tag}
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addTag()
                  }
                }}
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Type and press enter"
              />
            </div>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title text-2xl text-sand-900">Base Creative</h2>
        <div className="card p-6 space-y-4 bg-sand-50">
          <label className="text-sm text-sand-700">
            Headline
            <input
              {...register('headline')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            />
            {errors.headline ? <p className="text-xs text-terracotta mt-1">{errors.headline.message}</p> : null}
          </label>
          <label className="text-sm text-sand-700">
            Body Copy (optional)
            <textarea
              {...register('body')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              rows={3}
            />
          </label>
          <label className="text-sm text-sand-700">
            CTA Button Text
            <input
              {...register('cta')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
            />
            {errors.cta ? <p className="text-xs text-terracotta mt-1">{errors.cta.message}</p> : null}
          </label>
          <label className="text-sm text-sand-700">
            Image Description (optional)
            <textarea
              {...register('image_description')}
              className="mt-2 w-full rounded-lg border border-sand-200 bg-warm-white px-3 py-2"
              rows={3}
            />
          </label>
        </div>
      </section>

      <Button type="submit" loading={loading} className="w-full">Create Campaign</Button>
    </form>
  )
}
