import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { AppIcon, type AppIconName } from '../components/ui/AppIcon'
import { useChartAnimationGate } from '../hooks/useChartAnimationGate'
import { formatCompactCurrency, formatCurrency, formatPercent, formatShortTime, formatTime } from '../lib/utils'
import {
  type ActivityEvent,
  type Instrument,
  type MarketTick,
  type PortfolioSnapshot,
  type Position,
  type ServiceHealth,
  type Signal
} from '../types/trading'

interface OverviewPageProps {
  animateOnMount: boolean
  isBooting: boolean
  instrument: Instrument
  currentTick: MarketTick
  sessionMovePct: number
  selectedTicks: MarketTick[]
  position: Position | null
  currentSnapshot: PortfolioSnapshot
  portfolioSeries: PortfolioSnapshot[]
  latestSignal: Signal
  services: ServiceHealth[]
  activity: ActivityEvent[]
  totalOrders: number
  openOrders: number
  totalExecutions: number
  fillRatio: number
}

export function OverviewPage({
  animateOnMount,
  isBooting,
  instrument,
  currentTick,
  sessionMovePct,
  selectedTicks,
  position,
  currentSnapshot,
  portfolioSeries,
  latestSignal,
  services,
  activity,
  totalOrders,
  openOrders,
  totalExecutions,
  fillRatio
}: OverviewPageProps) {
  const chartData = selectedTicks.map((tick) => ({
    time: formatShortTime(tick.timestamp),
    price: Number(tick.price.toFixed(2)),
    volume: Math.round(tick.volume / 1000)
  }))
  const portfolioData = portfolioSeries.map((snapshot) => ({
    time: formatShortTime(snapshot.updatedAt),
    pnl: Number(snapshot.totalPnl.toFixed(2)),
    value: Number(snapshot.totalValue.toFixed(2))
  }))
  const latestExecutions = activity.filter((event) => event.kind === 'execution').slice(0, 4)
  const serviceSummary = services.slice(0, 4)
  const openExposure = currentSnapshot.marketValue
  const isChartAnimationActive = useChartAnimationGate(animateOnMount)

  if (isBooting) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
          <LoadingSkeleton lines={6} />
          <LoadingSkeleton lines={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <FinanceKpi label="Portfolio Value" value={formatCurrency(currentSnapshot.totalValue)} icon="wallet" />
        <FinanceKpi label="Total PnL" value={formatCurrency(currentSnapshot.totalPnl)} icon="line-chart" accent />
        <FinanceKpi label="Exposure" value={formatCompactCurrency(openExposure)} icon="bar-chart" />
        <FinanceKpi label="Cash" value={formatCompactCurrency(currentSnapshot.cashBalance)} icon="dollar" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">
        <section className="surface-card min-h-[254px] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-text">Overview</h3>
              <p className="mt-1 text-xs text-muted">{instrument.symbol} price path and portfolio PnL</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" />Price</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" />PnL</span>
            </div>
          </div>
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart accessibilityLayer={false} data={chartData.map((point, index) => ({ ...point, pnl: portfolioData[index % portfolioData.length]?.pnl ?? 0 }))} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#343943" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#9e9e9e', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9e9e9e', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1c22', border: '1px solid #343943', borderRadius: 8, color: '#fff' }}
                  labelStyle={{ color: '#9e9e9e' }}
                />
                <Line
                  activeDot={{ r: 5, fill: '#1fcb4f' }}
                  animationDuration={900}
                  animationEasing="ease-out"
                  dataKey="price"
                  dot={false}
                  isAnimationActive={isChartAnimationActive}
                  stroke="#1fcb4f"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  animationDuration={900}
                  animationEasing="ease-out"
                  dataKey="pnl"
                  dot={false}
                  isAnimationActive={isChartAnimationActive}
                  stroke="#ffc01e"
                  strokeWidth={2}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-text">Trading Card</h3>
              <p className="mt-1 text-xs text-muted">Selected instrument</p>
            </div>
            <span className="rounded-panel bg-accent px-2 py-1 text-xs font-bold text-surface">{latestSignal.side}</span>
          </div>
          <div className="mt-5 rounded-card bg-gradient-to-br from-[#303542] to-[#20242d] p-5 shadow-soft">
            <div className="text-sm font-semibold text-text">{instrument.symbol}</div>
            <div className="mt-8 font-mono text-xl text-text">{formatCurrency(currentTick.price)}</div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
              <div>
                <p className="text-muted">Session</p>
                <p className={sessionMovePct >= 0 ? 'text-positive' : 'text-negative'}>{formatPercent(sessionMovePct)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted">Position</p>
                <p className="text-text">{position ? position.quantity : 0}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(260px,0.9fr)_minmax(260px,0.9fr)_minmax(280px,0.8fr)]">
        <section className="surface-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-text">Activity</h3>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" />Volume</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" />Fills</span>
            </div>
          </div>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer={false} data={chartData.slice(-7)} margin={{ top: 8, right: 6, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#343943" strokeDasharray="3 3" vertical />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#9e9e9e', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9e9e9e', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1c22', border: '1px solid #343943', borderRadius: 8 }} />
                <Bar
                  animationDuration={900}
                  animationEasing="ease-out"
                  barSize={10}
                  dataKey="volume"
                  fill="#1fcb4f"
                  isAnimationActive={isChartAnimationActive}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-card p-4">
          <h3 className="text-base font-semibold text-text">Execution</h3>
          <div className="mt-5 space-y-5">
            <ProgressRow label="Fill Ratio" value={`${fillRatio}%`} progress={fillRatio} />
            <ProgressRow label="Open Orders" value={`${openOrders}/${totalOrders}`} progress={totalOrders ? (openOrders / totalOrders) * 100 : 0} />
            <ProgressRow label="Executions" value={String(totalExecutions)} progress={Math.min(totalExecutions * 16, 100)} />
            <ProgressRow label="Positions" value={String(currentSnapshot.positions.length)} progress={Math.min(currentSnapshot.positions.length * 24, 100)} />
          </div>
        </section>

        <section className="surface-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-text">Recent Trading Activity</h3>
            <span className="text-xs font-semibold text-accent">Live</span>
          </div>
          <div className="space-y-4">
            {(latestExecutions.length ? latestExecutions : activity.slice(0, 4)).map((event) => (
              <div key={event.id} className="flex min-w-0 items-center justify-between gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted">{event.kind} · {formatTime(event.timestamp)}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-text">{event.title}</p>
                </div>
                <span className={event.tone === 'positive' ? 'text-positive' : event.tone === 'warning' ? 'text-warning' : event.tone === 'negative' ? 'text-negative' : 'text-muted'}>
                  {event.kind === 'execution' ? '+fill' : 'event'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {serviceSummary.map((service) => (
            <div key={service.serviceId} className="rounded-card bg-shell p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-text">{service.name}</p>
                <span className={service.status === 'healthy' ? 'text-positive' : service.status === 'degraded' ? 'text-warning' : 'text-negative'}>
                  {service.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">{service.latencyMs} ms · {service.channel}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function FinanceKpi({ label, value, icon, accent = false }: { label: string; value: string; icon: AppIconName; accent?: boolean }) {
  return (
    <article className="surface-card p-4">
      <div className="flex items-center gap-5">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-panel bg-shell ${accent ? 'text-accent' : 'text-positive'}`}>
          <AppIcon name={icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted">{label}</p>
          <p className="mt-1 truncate font-mono text-2xl font-semibold text-text">{value}</p>
        </div>
      </div>
    </article>
  )
}

function ProgressRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-xs">
        <span className="font-semibold text-text">{label}</span>
        <span className="text-muted">{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded bg-shell">
        <div className="h-full rounded bg-accent" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </div>
    </div>
  )
}
