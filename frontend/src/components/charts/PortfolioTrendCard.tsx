import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useChartAnimationGate } from '../../hooks/useChartAnimationGate'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import { formatCurrency, formatShortTime } from '../../lib/utils'
import { type PortfolioSnapshot } from '../../types/trading'

interface PortfolioTrendCardProps {
  animateOnMount?: boolean
  snapshots: PortfolioSnapshot[]
  className?: string
}

export function PortfolioTrendCard({
  animateOnMount = true,
  snapshots,
  className = ''
}: PortfolioTrendCardProps) {
  const chartData = snapshots.map((snapshot) => ({
    time: formatShortTime(snapshot.updatedAt),
    totalValue: Number(snapshot.totalValue.toFixed(2)),
    totalPnl: Number(snapshot.totalPnl.toFixed(2))
  }))
  const valueDomain = makePaddedDomain(chartData.map((item) => item.totalValue))
  const pnlDomain = makePaddedDomain(chartData.map((item) => item.totalPnl))
  const latestValue = chartData[chartData.length - 1]?.totalValue ?? 0
  const latestPnl = chartData[chartData.length - 1]?.totalPnl ?? 0
  const animatedValue = useAnimatedNumber(latestValue)
  const animatedPnl = useAnimatedNumber(latestPnl)
  const isChartAnimationActive = useChartAnimationGate(animateOnMount)

  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="eyebrow">Portfolio trend</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
            Value over replay time
          </h3>
        </div>
        <p className="text-sm text-muted">Separate scales keep both portfolio value and PnL readable</p>
      </div>

      <div className="mt-5 grid gap-5">
        <TrendPanel
          color="#1fcb4f"
          data={chartData}
          dataKey="totalValue"
          domain={valueDomain}
          isAnimationActive={isChartAnimationActive}
          label="Portfolio value"
          value={formatCurrency(animatedValue)}
        />
        <TrendPanel
          color="#ffc01e"
          data={chartData}
          dataKey="totalPnl"
          domain={pnlDomain}
          isAnimationActive={isChartAnimationActive}
          label="Total PnL"
          value={formatCurrency(animatedPnl)}
        />
      </div>
    </section>
  )
}

interface TrendPanelProps {
  color: string
  data: Array<{ time: string; totalValue: number; totalPnl: number }>
  dataKey: 'totalValue' | 'totalPnl'
  domain: [number, number]
  isAnimationActive: boolean
  label: string
  value: string
}

function TrendPanel({
  color,
  data,
  dataKey,
  domain,
  isAnimationActive,
  label,
  value
}: TrendPanelProps) {
  return (
    <div className="rounded-card bg-shell p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-sm font-semibold text-text">{label}</p>
        </div>
        <p className="font-mono text-sm font-semibold text-text">{value}</p>
      </div>

      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart accessibilityLayer={false} data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#343943" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9e9e9e', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={domain}
              tick={{ fill: '#9e9e9e', fontSize: 11 }}
              tickFormatter={(axisValue) => `$${Number(axisValue).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            />
            <Tooltip
              formatter={(tooltipValue) => {
                const numericValue = Array.isArray(tooltipValue) ? Number(tooltipValue[0] ?? 0) : Number(tooltipValue ?? 0)
                return [formatCurrency(numericValue), label]
              }}
              contentStyle={{
                background: '#1a1c22',
                borderRadius: 8,
                border: '1px solid #343943',
                color: '#ffffff'
              }}
            />
            <Line
              activeDot={{ r: 5, fill: color }}
              animationDuration={900}
              animationEasing="ease-out"
              dataKey={dataKey}
              dot={false}
              isAnimationActive={isAnimationActive}
              stroke={color}
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function makePaddedDomain(values: number[]): [number, number] {
  const finiteValues = values.filter(Number.isFinite)

  if (finiteValues.length === 0) {
    return [0, 1]
  }

  const min = Math.min(...finiteValues)
  const max = Math.max(...finiteValues)
  const range = max - min
  const padding = range === 0 ? Math.max(Math.abs(max) * 0.01, 1) : range * 0.18

  return [
    Math.floor(min - padding),
    Math.ceil(max + padding)
  ]
}
