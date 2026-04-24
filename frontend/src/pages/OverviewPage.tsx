import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { HeroPortfolioCard } from '../components/dashboard/HeroPortfolioCard'
import { InstrumentSummaryCard } from '../components/dashboard/InstrumentSummaryCard'
import { LatestSignalCard } from '../components/dashboard/LatestSignalCard'
import { OrdersSummaryCard } from '../components/dashboard/OrdersSummaryCard'
import { ServiceHealthCard } from '../components/dashboard/ServiceHealthCard'
import { PriceChartCard } from '../components/charts/PriceChartCard'
import { MetricCard } from '../components/ui/MetricCard'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { formatCompactCurrency, formatCurrency, formatPercent, toneFromNumber } from '../lib/utils'
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
  if (isBooting) {
    return (
      <div className="grid gap-3 xl:h-full xl:min-h-0 xl:grid-rows-[minmax(0,300px)_auto_minmax(0,220px)_minmax(0,1fr)] xl:overflow-hidden">
        <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
          <LoadingSkeleton className="xl:col-span-5 xl:h-full" lines={4} />
          <LoadingSkeleton className="xl:col-span-7 xl:h-full" lines={6} />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
          <LoadingSkeleton className="xl:col-span-4 xl:h-full" />
          <LoadingSkeleton className="xl:col-span-4 xl:h-full" />
          <LoadingSkeleton className="xl:col-span-4 xl:h-full" />
        </div>
        <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
          <LoadingSkeleton className="xl:col-span-7 xl:h-full" lines={6} />
          <LoadingSkeleton className="xl:col-span-5 xl:h-full" lines={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3 xl:h-full xl:min-h-0 xl:grid-rows-[minmax(0,300px)_auto_minmax(0,220px)_minmax(0,1fr)] xl:overflow-hidden">
      <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
        <HeroPortfolioCard
          snapshots={portfolioSeries}
          currentSnapshot={currentSnapshot}
          fillRatio={fillRatio}
          className="xl:col-span-5 xl:h-full"
        />
        <PriceChartCard
          symbol={instrument.symbol}
          instrumentName={instrument.name}
          currentPrice={currentTick.price}
          sessionMovePct={sessionMovePct}
          sessionHigh={instrument.sessionHigh}
          sessionLow={instrument.sessionLow}
          ticks={selectedTicks}
          className="xl:col-span-7 xl:h-full"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total PnL"
          value={formatCurrency(currentSnapshot.totalPnl)}
          detail="Current portfolio result"
          change={formatPercent((currentSnapshot.totalPnl / 100000) * 100)}
          tone={toneFromNumber(currentSnapshot.totalPnl)}
        />
        <MetricCard
          label="Cash"
          value={formatCompactCurrency(currentSnapshot.cashBalance)}
          detail="Available balance for new orders"
        />
        <MetricCard
          label="Open positions"
          value={String(currentSnapshot.positions.length)}
          detail="Active holdings in the book"
        />
        <MetricCard
          label="Fill ratio"
          value={`${fillRatio}%`}
          detail={`${totalExecutions} fills across ${totalOrders} orders`}
        />
      </div>

      <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
        <InstrumentSummaryCard
          instrument={instrument}
          tick={currentTick}
          sessionMovePct={sessionMovePct}
          position={position}
          className="xl:col-span-4 xl:h-full"
        />
        <LatestSignalCard signal={latestSignal} className="xl:col-span-4 xl:h-full" />
        <OrdersSummaryCard
          totalOrders={totalOrders}
          openOrders={openOrders}
          totalExecutions={totalExecutions}
          fillRatio={fillRatio}
          className="xl:col-span-4 xl:h-full"
        />
      </div>

      <div className="grid gap-3 xl:min-h-0 xl:grid-cols-12">
        <ActivityFeed events={activity} className="xl:col-span-7 xl:h-full" />
        <ServiceHealthCard services={services} compact className="xl:col-span-5 xl:h-full" />
      </div>
    </div>
  )
}
