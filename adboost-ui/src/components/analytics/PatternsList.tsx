import { Sparkles, TrendingUp, Zap } from 'lucide-react'

const icons = [Sparkles, TrendingUp, Zap]

interface Pattern {
  title: string
  description: string
}

interface PatternsListProps {
  patterns: Pattern[]
}

export function PatternsList({ patterns }: PatternsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {patterns.map((pattern, index) => {
        const Icon = icons[index % icons.length]
        return (
          <div key={pattern.title} className="card p-5">
            <div className="flex items-center gap-3 text-terracotta">
              <Icon className="h-5 w-5" />
              <h4 className="font-display text-xl text-sand-900">{pattern.title}</h4>
            </div>
            <p className="mt-3 text-sm text-sand-600">{pattern.description}</p>
          </div>
        )
      })}
    </div>
  )
}
