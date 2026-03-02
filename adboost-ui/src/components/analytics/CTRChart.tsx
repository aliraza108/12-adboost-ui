'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface CTRChartProps {
  data: Array<{ name: string; predicted: number; actual: number }>
}

const tooltipStyle = {
  backgroundColor: 'var(--sand-100)',
  border: '1px solid rgba(160, 112, 64, 0.25)',
  borderRadius: '10px'
}

export function CTRChart({ data }: CTRChartProps) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-2xl text-sand-900 mb-4">Performance Chart</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8d5b0" />
            <XAxis dataKey="name" tick={{ fill: '#7a5230', fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              tick={{ fill: '#7a5230', fontSize: 12 }}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${(value * 100).toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="predicted" fill="#d4b896" name="Predicted CTR" animationDuration={600} />
            <Bar dataKey="actual" fill="#c8602a" name="Actual CTR" animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
