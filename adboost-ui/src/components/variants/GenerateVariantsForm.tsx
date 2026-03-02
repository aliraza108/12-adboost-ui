'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { FocusElement, VariantTone } from '@/lib/types'

const toneOptions: { label: string; value: VariantTone }[] = [
  { label: 'Urgency', value: 'urgency' },
  { label: 'Curiosity', value: 'curiosity' },
  { label: 'Social Proof', value: 'social_proof' },
  { label: 'Benefit Driven', value: 'benefit_driven' },
  { label: 'FOMO', value: 'fear_of_missing_out' },
  { label: 'Empathy', value: 'empathy' },
  { label: 'Authority', value: 'authority' },
  { label: 'Humor', value: 'humor' }
]

interface GenerateVariantsFormProps {
  onGenerate: (data: { num_variants: number; focus_element: FocusElement; tones: VariantTone[] }) => void
  loading?: boolean
}

export function GenerateVariantsForm({ onGenerate, loading }: GenerateVariantsFormProps) {
  const [numVariants, setNumVariants] = useState(3)
  const [focusElement, setFocusElement] = useState<FocusElement>('all')
  const [tones, setTones] = useState<VariantTone[]>(['urgency'])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-sand-700 mb-2">Number of variants</p>
        <input
          type="range"
          min={2}
          max={8}
          value={numVariants}
          onChange={(e) => setNumVariants(Number(e.target.value))}
          className="w-full"
        />
        <p className="mt-2 text-sm text-sand-600">{numVariants} variants</p>
      </div>
      <div>
        <p className="text-sm text-sand-700 mb-2">Focus element</p>
        <div className="flex flex-wrap gap-2">
          {(['all', 'headline', 'cta', 'body'] as FocusElement[]).map((element) => (
            <button
              key={element}
              type="button"
              onClick={() => setFocusElement(element)}
              className={`rounded-full border px-3 py-1 text-xs ${
                focusElement === element
                  ? 'border-terracotta bg-terracotta/10 text-terracotta'
                  : 'border-sand-200 text-sand-600'
              }`}
            >
              {element}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-sand-700 mb-2">Tone selections</p>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map((tone) => (
            <label key={tone.value} className="flex items-center gap-2 text-xs text-sand-600">
              <input
                type="checkbox"
                checked={tones.includes(tone.value)}
                onChange={() => {
                  setTones((prev) =>
                    prev.includes(tone.value) ? prev.filter((t) => t !== tone.value) : [...prev, tone.value]
                  )
                }}
              />
              {tone.label}
            </label>
          ))}
        </div>
      </div>
      <Button
        onClick={() => onGenerate({ num_variants: numVariants, focus_element: focusElement, tones })}
        loading={loading}
        className="w-full"
      >
        Generate with AI
      </Button>
    </div>
  )
}
