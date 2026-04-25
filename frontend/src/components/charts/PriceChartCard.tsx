import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useChartAnimationGate } from '../../hooks/useChartAnimationGate'
import { formatCurrency, formatNumber, formatPercent, formatShortTime } from '../../lib/utils'

interface PriceChartCardProps {
  animateOnMount?: boolean
  symbol: string
  currentPrice: number
  sessionMovePct: number
  sessionHigh: number
  sessionLow: number
  ticks: Array<{
    timestamp: string
    price: number
    volume?: number
  }>
  className?: string
}

export function PriceChartCard({
  animateOnMount = true,
  symbol,
  currentPrice,
  sessionMovePct,
  sessionHigh,
  sessionLow,
  ticks,
  className = ''
}: PriceChartCardProps) {
  const chartData = ticks.map((tick) => ({
    time: formatShortTime(tick.timestamp),
    price: Number(tick.price.toFixed(2)),
    volume: tick.volume ?? 0
  }))
  const isChartAnimationActive = useChartAnimationGate(animateOnMount)

  return (
    <section className={`surface-card panel-fixed flex flex-col p-5 sm:p-6 ${className}`}>
      <div className="flex min-w-0 flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Price history</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h3 className="text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">{symbol}</h3>
            <p className="truncate text-sm text-muted">Market data from `trading-core`</p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3 text-sm text-muted sm:flex sm:flex-wrap sm:items-center">
          <div>
            <p className="eyebrow">Last</p>
            <p className="mono-data mt-1 text-base text-text">{formatCurrency(currentPrice)}</p>
          </div>
          <div>
            <p className="eyebrow">Move</p>
            <p className={`mono-data mt-1 text-base ${sessionMovePct >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatPercent(sessionMovePct)}
            </p>
          </div>
          <div>
            <p className="eyebrow">High</p>
            <p className="mono-data mt-1 text-base text-text">{formatCurrency(sessionHigh)}</p>
          </div>
          <div>
            <p className="eyebrow">Low</p>
            <p className="mono-data mt-1 text-base text-text">{formatCurrency(sessionLow)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[220px] flex-1 xl:min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart accessibilityLayer={false} data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`price-gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1fcb4f" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#1fcb4f" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              width={72}
              tick={{ fill: '#9e9e9e', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ stroke: '#1fcb4f', strokeDasharray: '4 4' }}
              formatter={(value, name) => {
                const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                return name === 'price'
                  ? [formatCurrency(numericValue), 'Price']
                  : [formatNumber(numericValue), 'Volume']
              }}
              contentStyle={{
                background: '#1a1c22',
                borderRadius: 8,
                border: '1px solid #343943',
                color: '#ffffff'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1fcb4f"
              strokeWidth={2.5}
              fill={`url(#price-gradient-${symbol})`}
              dot={false}
              activeDot={{ r: 5, fill: '#1fcb4f' }}
              animationDuration={900}
              animationEasing="ease-out"
              isAnimationActive={isChartAnimationActive}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
