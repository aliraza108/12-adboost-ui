'use client'

import { Brain } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AgentThinkingProps {
  message?: string
}

export function AgentThinking({ message = 'AI is working' }: AgentThinkingProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="card p-6 flex items-center gap-4 bg-sand-100/70">
      <div className="h-12 w-12 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center">
        <Brain className="h-6 w-6" />
      </div>
      <div>
        <p className="font-medium text-sand-800">{message}</p>
        <div className="flex items-center gap-2 text-sm text-sand-600">
          <span>Thinking... {seconds}s</span>
          <span className="thinking-dots text-terracotta">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  )
}
