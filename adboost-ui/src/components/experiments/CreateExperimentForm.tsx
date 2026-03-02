'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import type { ExperimentCreate, Variant } from '@/lib/types'

const schema = z.object({
  confidence_level: z.number().min(0.8).max(0.99),
  target_sample_size: z.number().min(100),
  duration_hours: z.number().min(24).max(168)
})

type FormValues = z.infer<typeof schema>

interface CreateExperimentFormProps {
  campaignId: string
  variants: Variant[]
  onSubmit: (data: ExperimentCreate) => void
  loading?: boolean
}

export function CreateExperimentForm({ campaignId, variants, onSubmit, loading }: CreateExperimentFormProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [manualSplit, setManualSplit] = useState(false)
  const [splitOverrides, setSplitOverrides] = useState<Record<string, number>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { confidence_level: 0.95, target_sample_size: 1000, duration_hours: 72 }
  })

  const trafficSplit = useMemo(() => {
    if (!manualSplit) return undefined
    return selected.reduce((acc, id) => {
      acc[id] = splitOverrides[id] ?? 0
      return acc
    }, {} as Record<string, number>)
  }, [manualSplit, selected, splitOverrides])

  const splitTotal = useMemo(() => {
    if (!manualSplit) return 0
    return selected.reduce((acc, id) => acc + (splitOverrides[id] ?? 0), 0)
  }, [manualSplit, selected, splitOverrides])

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (selected.length < 2) {
          setFormError('Select at least two variants to run an experiment.')
          return
        }
        if (manualSplit) {
          const total = splitTotal
          if (Math.abs(total - 100) > 0.5) {
            setFormError('Traffic split must sum to 100%.')
            return
          }
        }
        setFormError(null)
        onSubmit({
          campaign_id: campaignId,
          variant_ids: selected,
          traffic_split: trafficSplit,
          confidence_level: values.confidence_level,
          target_sample_size: values.target_sample_size,
          duration_hours: values.duration_hours
        })
      })}
      className="space-y-4"
    >
      <div>
        <p className="text-sm text-sand-700 mb-2">Select Variants</p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {variants.map((variant) => (
            <label key={variant.id} className="flex items-center gap-2 text-sm text-sand-600">
              <input
                type="checkbox"
                checked={selected.includes(variant.id)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(variant.id) ? prev.filter((id) => id !== variant.id) : [...prev, variant.id]
                  )
                }
              />
              {variant.creative.headline}
            </label>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-sand-600">
        <input type="checkbox" checked={manualSplit} onChange={() => setManualSplit((prev) => !prev)} />
        Manual traffic split
      </label>
      {manualSplit ? (
        <div className="space-y-2">
          {selected.map((id) => (
            <label key={id} className="text-xs text-sand-600 flex items-center gap-2">
              {variants.find((v) => v.id === id)?.creative.headline.slice(0, 20)}
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 rounded border border-sand-200 bg-warm-white px-2 py-1"
                value={splitOverrides[id] ?? 0}
                onChange={(event) =>
                  setSplitOverrides((prev) => ({ ...prev, [id]: Number(event.target.value) }))
                }
              />
              %
            </label>
          ))}
          <p className="text-xs text-sand-500">Total: {splitTotal.toFixed(1)}%</p>
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs text-sand-600">
          Confidence Level
          <select
            {...register('confidence_level', { valueAsNumber: true })}
            className="mt-1 w-full rounded border border-sand-200 bg-warm-white px-2 py-1"
          >
            {[0.8, 0.9, 0.95, 0.99].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-sand-600">
          Sample Size
          <input
            type="number"
            {...register('target_sample_size', { valueAsNumber: true })}
            className="mt-1 w-full rounded border border-sand-200 bg-warm-white px-2 py-1"
          />
        </label>
        <label className="text-xs text-sand-600">
          Duration (hours)
          <input
            type="number"
            {...register('duration_hours', { valueAsNumber: true })}
            className="mt-1 w-full rounded border border-sand-200 bg-warm-white px-2 py-1"
          />
        </label>
      </div>
      {formError ? <p className="text-xs text-terracotta">{formError}</p> : null}
      <Button type="submit" loading={loading} className="w-full">
        Create Experiment
      </Button>
    </form>
  )
}
