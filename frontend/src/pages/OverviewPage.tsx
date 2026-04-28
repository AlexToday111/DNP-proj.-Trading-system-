import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { ServiceHealthCard } from '../components/dashboard/ServiceHealthCard'
import { SystemFlowCard } from '../components/dashboard/SystemFlowCard'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrency, formatTime } from '../lib/utils'
import {
  type ActivityEvent,
  type Execution,
  type MarketTick,
  type Order,
  type PortfolioSnapshot,
  type ServiceHealth,
  type Signal
} from '../types/trading'

interface OverviewPageProps {
  isBooting: boolean
  portfolio: PortfolioSnapshot
  services: ServiceHealth[]
  marketData: MarketTick[]
  signals: Signal[]
  orders: Order[]
  executions: Execution[]
  activity: ActivityEvent[]
}

export function OverviewPage({
  isBooting,
  portfolio,
  services,
  marketData,
  signals,
  orders,
  executions,
  activity
}: OverviewPageProps) {
  if (isBooting) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <LoadingSkeleton lines={6} />
          <LoadingSkeleton lines={6} />
        </div>
      </div>
    )
  }

  const latestMarket = marketData[0] ?? null
  const latestSignal = signals[0] ?? null
  const latestOrder = orders[0] ?? null
  const latestExecution = executions[0] ?? null

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Portfolio Value" value={formatCurrency(portfolio.totalPortfolioValue)} detail="Latest portfolio snapshot" />
        <MetricCard label="Cash" value={formatCurrency(portfolio.cash)} detail="Available balance" />
        <MetricCard label="Position Value" value={formatCurrency(portfolio.totalPositionValue)} detail="Open positions marked to market" />
        <MetricCard label="Total PnL" value={formatCurrency(portfolio.totalPnl)} detail={`Updated ${portfolio.updatedAt ? formatTime(portfolio.updatedAt) : '—'} UTC`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="surface-card p-5 sm:p-6">
          <div className="border-b border-line pb-4">
            <p className="eyebrow">Latest pipeline snapshot</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
              MarketData → Signal → Order → Execution
            </h3>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SnapshotCard
              title="Market data"
              primary={latestMarket?.symbol ?? '—'}
              secondary={latestMarket ? formatCurrency(latestMarket.price) : 'No data'}
              detail={latestMarket ? latestMarket.eventId : 'No market data returned'}
            />
            <SnapshotCard
              title="Signal"
              primary={latestSignal ? `${latestSignal.side} ${latestSignal.symbol}` : '—'}
              secondary={latestSignal ? formatCurrency(latestSignal.price) : 'No data'}
              detail={latestSignal ? latestSignal.signalId : 'No signals returned'}
            />
            <SnapshotCard
              title="Order"
              primary={latestOrder?.status ?? '—'}
              secondary={latestOrder ? `${latestOrder.side} ${latestOrder.symbol}` : 'No data'}
              detail={latestOrder ? latestOrder.orderId : 'No orders returned'}
            />
            <SnapshotCard
              title="Execution"
              primary={latestExecution?.status ?? '—'}
              secondary={latestExecution ? formatCurrency(latestExecution.executedPrice) : 'No data'}
              detail={latestExecution ? latestExecution.executionId : 'No executions returned'}
            />
          </div>
        </section>

        {services.length > 0 ? (
          <ServiceHealthCard services={services} compact />
        ) : (
          <EmptyState title="No service status available" description="System status will appear here once services start reporting health data." />
        )}
      </div>

      <SystemFlowCard />

      <div className="grid gap-5 xl:grid-cols-12">
        <ActivityFeed events={activity} className="xl:col-span-7" />
        <section className="surface-card p-5 sm:p-6 xl:col-span-5">
          <p className="eyebrow">Snapshot totals</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            Dashboard snapshot
          </h3>
          <div className="mt-5 grid gap-3">
            <MetricCard label="Market data rows" value={String(marketData.length)} detail="Latest market events included in the dashboard snapshot" />
            <MetricCard label="Signals" value={String(signals.length)} detail="Recent strategy signals available in the dashboard snapshot" />
            <MetricCard label="Orders" value={String(orders.length)} detail="Recent order records included in the dashboard snapshot" />
            <MetricCard label="Executions" value={String(executions.length)} detail="Recent execution records included in the dashboard snapshot" />
          </div>
        </section>
      </div>
    </div>
  )
}

interface SnapshotCardProps {
  title: string
  primary: string
  secondary: string
  detail: string
}

function SnapshotCard({ title, primary, secondary, detail }: SnapshotCardProps) {
  return (
    <article className="rounded-[24px] border border-line bg-shell p-4">
      <p className="eyebrow">{title}</p>
      <div className="mt-3 font-mono text-lg font-semibold text-text">{primary}</div>
      <p className="mt-2 text-sm text-text">{secondary}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </article>
  )
}
