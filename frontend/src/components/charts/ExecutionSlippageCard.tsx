import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useChartAnimationGate } from '../../hooks/useChartAnimationGate'
import { formatShortTime, formatSignedBasisPoints } from '../../lib/utils'
import { type Execution } from '../../types/trading'

interface ExecutionSlippageCardProps {
  animateOnMount?: boolean
  executions: Execution[]
  className?: string
}

export function ExecutionSlippageCard({
  animateOnMount = true,
  executions,
  className = ''
}: ExecutionSlippageCardProps) {
  const chartData = executions.map((execution) => ({
    time: formatShortTime(execution.timestamp),
    slippage: execution.slippageBps
  }))
  const isChartAnimationActive = useChartAnimationGate(animateOnMount)

  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      <div className="border-b border-line pb-5">
        <p className="eyebrow">Execution quality</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
          Slippage over recent fills
        </h3>
        <p className="mt-2 text-sm text-muted">
          Measured in basis points: 1 bps = 0.01%.
        </p>
      </div>

      <div className="mt-5 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart accessibilityLayer={false} data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#343943" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9e9e9e', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9e9e9e', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => {
                const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                return [formatSignedBasisPoints(numericValue), 'Slippage']
              }}
              contentStyle={{
                background: '#1a1c22',
                borderRadius: 8,
                border: '1px solid #343943',
                color: '#ffffff'
              }}
            />
            <Bar
              animationDuration={900}
              animationEasing="ease-out"
              dataKey="slippage"
              isAnimationActive={isChartAnimationActive}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`${entry.time}-${entry.slippage}`}
                  fill={entry.slippage < 0 ? '#ff6b57' : '#1fcb4f'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
