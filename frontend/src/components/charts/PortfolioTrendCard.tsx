import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { formatCurrency, formatShortTime } from '../../lib/utils'
import { type PortfolioSnapshot } from '../../types/trading'

interface PortfolioTrendCardProps {
  snapshots: PortfolioSnapshot[]
  className?: string
}

export function PortfolioTrendCard({ snapshots, className = '' }: PortfolioTrendCardProps) {
  const chartData = snapshots.map((snapshot) => ({
    time: formatShortTime(snapshot.updatedAt),
    totalValue: Number(snapshot.totalValue.toFixed(2)),
    totalPnl: Number(snapshot.totalPnl.toFixed(2))
  }))

  return (
    <section className={`surface-card p-5 sm:p-6 ${className}`}>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="eyebrow">Portfolio trend</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
            Value over replay time
          </h3>
        </div>
        <p className="text-sm text-muted">Includes cash, market value, and realized PnL</p>
      </div>

      <div className="mt-5 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
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
              width={88}
              tick={{ fill: '#687166', fontSize: 12 }}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                return [
                  formatCurrency(numericValue),
                  name === 'totalValue' ? 'Portfolio value' : 'Total PnL'
                ]
              }}
              contentStyle={{
                borderRadius: 18,
                border: '1px solid #e9e2d8',
                boxShadow: '0 12px 30px rgba(28, 35, 26, 0.08)'
              }}
            />
            <Line
              type="monotone"
              dataKey="totalValue"
              stroke="#0f6b4b"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#0f6b4b' }}
            />
            <Line
              type="monotone"
              dataKey="totalPnl"
              stroke="#b98537"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
