import { useDeferredValue, useMemo, useState } from 'react'
import { PriceChartCard } from '../components/charts/PriceChartCard'
import { MarketDataTable } from '../components/tables/MarketDataTable'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCompactNumber, formatCurrency, formatPercent } from '../lib/utils'
import { type MarketHistoryPoint, type MarketTick } from '../types/trading'

interface MarketDataPageProps {
  animateOnMount: boolean
  symbol: string
  ticks: MarketTick[]
  history: Array<MarketHistoryPoint | MarketTick>
  currentTick: MarketTick | null
  sessionMovePct: number
}

export function MarketDataPage({
  animateOnMount,
  symbol,
  ticks,
  history,
  currentTick,
  sessionMovePct
}: MarketDataPageProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () =>
      [...ticks]
        .reverse()
        .filter((tick) => {
          const haystack = `${tick.eventId} ${tick.symbol}`.toLowerCase()
          return haystack.includes(deferredQuery.toLowerCase())
        }),
    [deferredQuery, ticks]
  )

  const chartTicks = history.length > 0 ? history : ticks
  const prices = chartTicks.map((tick) => tick.price)
  const sessionHigh = prices.length ? Math.max(...prices) : currentTick?.price ?? 0
  const sessionLow = prices.length ? Math.min(...prices) : currentTick?.price ?? 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Market events"
          value={String(ticks.length)}
          detail="Visible market data events for the selected instrument"
        />
        <MetricCard
          label="Current volume"
          value={formatCompactNumber(currentTick?.volume ?? 0)}
          detail="Latest event size"
        />
        <MetricCard
          label="Session move"
          value={formatPercent(sessionMovePct)}
          detail={`Last ${formatCurrency(currentTick?.price ?? 0)}`}
        />
      </div>

      <PriceChartCard
        animateOnMount={animateOnMount}
        symbol={symbol}
        currentPrice={currentTick?.price ?? 0}
        sessionMovePct={sessionMovePct}
        sessionHigh={sessionHigh}
        sessionLow={sessionLow}
        ticks={chartTicks}
      />

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by event id or symbol"
        onSearchChange={setQuery}
      />

      <MarketDataTable rows={rows} />
    </div>
  )
}
