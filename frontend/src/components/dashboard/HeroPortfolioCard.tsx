import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { formatCurrency, formatPercent, formatShortTime, toneFromNumber } from '../../lib/utils'
import { type PortfolioSnapshot } from '../../types/trading'

interface HeroPortfolioCardProps {
  snapshots: PortfolioSnapshot[]
  currentSnapshot: PortfolioSnapshot
  fillRatio: number
  className?: string
}

export function HeroPortfolioCard({
  snapshots,
  currentSnapshot,
  fillRatio,
  className = ''
}: HeroPortfolioCardProps) {
  const chartData = snapshots.map((snapshot) => ({
    time: formatShortTime(snapshot.updatedAt),
    totalValue: Number(snapshot.totalValue.toFixed(2))
  }))

  return (
    <section
      className={`panel-fixed rounded-card bg-gradient-to-br from-accent via-accent to-accent-strong p-5 text-white shadow-card sm:p-6 ${className}`}
    >
      <div className="flex h-full min-h-0 flex-col gap-5">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70">
              Portfolio value
            </p>
            <h3 className="mt-3 truncate font-mono text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {formatCurrency(currentSnapshot.totalValue)}
            </h3>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 text-sm">
            <div className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-white/70">Total PnL</p>
              <p className="mt-1 truncate font-mono text-base font-semibold sm:text-lg">
                {formatCurrency(currentSnapshot.totalPnl)}
              </p>
            </div>
            <div className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-white/70">Fill ratio</p>
              <p className="mt-1 font-mono text-lg font-semibold">{fillRatio}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="min-w-0 rounded-[20px] border border-white/12 bg-white/8 px-4 py-3">
            <p className="text-white/70">Cash</p>
            <p className="mt-1 truncate font-mono text-base sm:text-lg">{formatCurrency(currentSnapshot.cashBalance)}</p>
          </div>
          <div className="min-w-0 rounded-[20px] border border-white/12 bg-white/8 px-4 py-3">
            <p className="text-white/70">Market value</p>
            <p className="mt-1 truncate font-mono text-base sm:text-lg">{formatCurrency(currentSnapshot.marketValue)}</p>
          </div>
          <div className="min-w-0 rounded-[20px] border border-white/12 bg-white/8 px-4 py-3">
            <p className="text-white/70">Open positions</p>
            <p className="mt-1 font-mono text-lg">{currentSnapshot.positions.length}</p>
          </div>
        </div>

        <div className="h-20 sm:h-24 xl:h-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Tooltip
                formatter={(value) => {
                  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
                  return [formatCurrency(numericValue), 'Portfolio']
                }}
                labelFormatter={(label) => `UTC ${label}`}
                contentStyle={{
                  borderRadius: 18,
                  border: '1px solid rgba(255,255,255,0.16)',
                  backgroundColor: 'rgba(8, 57, 39, 0.92)',
                  color: '#ffffff'
                }}
              />
              <Area
                type="monotone"
                dataKey="totalValue"
                stroke="#ffffff"
                strokeWidth={2.5}
                fill="rgba(255,255,255,0.12)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/75">
          <span>Replay trend</span>
          <span className={toneFromNumber(currentSnapshot.totalPnl) === 'negative' ? 'text-[#ffd5cc]' : 'text-[#dff7e8]'}>
            {formatPercent((currentSnapshot.totalPnl / 100000) * 100, 2)}
          </span>
        </div>
      </div>
    </section>
  )
}
