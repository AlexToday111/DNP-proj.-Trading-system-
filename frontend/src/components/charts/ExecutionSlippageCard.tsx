import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatShortTime, formatSignedBasisPoints } from '../../lib/utils'
import { type Execution } from '../../types/trading'

interface ExecutionSlippageCardProps {
  executions: Execution[]
  className?: string
}

export function ExecutionSlippageCard({
  executions,
  className = ''
}: ExecutionSlippageCardProps) {
  const chartData = executions.map((execution) => ({
    time: formatShortTime(execution.timestamp),
    slippage: execution.slippageBps
  }))

  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      <div className="border-b border-line pb-5">
        <p className="eyebrow">Execution quality</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
          Slippage over recent fills
        </h3>
      </div>

      <div className="mt-5 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#ece5da" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#687166', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#687166', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => {
                const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                return [formatSignedBasisPoints(numericValue), 'Slippage']
              }}
              contentStyle={{
                borderRadius: 18,
                border: '1px solid #e9e2d8',
                boxShadow: '0 12px 30px rgba(28, 35, 26, 0.08)'
              }}
            />
            <Bar dataKey="slippage" fill="#0f6b4b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
