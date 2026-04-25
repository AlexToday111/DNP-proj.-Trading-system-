import { useDeferredValue, useMemo, useState } from 'react'
import { PriceChartCard } from '../components/charts/PriceChartCard'
import { MarketDataTable } from '../components/tables/MarketDataTable'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCompactNumber, formatCurrency, formatPercent } from '../lib/utils'
import { type Instrument, type MarketTick } from '../types/trading'

interface MarketDataPageProps {
  animateOnMount: boolean
  instrument: Instrument
  ticks: MarketTick[]
  currentTick: MarketTick
  sessionMovePct: number
}

export function MarketDataPage({
  animateOnMount,
  instrument,
  ticks,
  currentTick,
  sessionMovePct
}: MarketDataPageProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () =>
      [...ticks]
        .reverse()
        .filter(
          (tick) =>
            tick.eventId.toLowerCase().includes(deferredQuery.toLowerCase()) ||
            tick.source.toLowerCase().includes(deferredQuery.toLowerCase())
        ),
    [deferredQuery, ticks]
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Replay ticks"
          value={String(ticks.length)}
          detail="Visible market events for the selected instrument"
        />
        <MetricCard
          label="Current volume"
          value={formatCompactNumber(currentTick.volume)}
          detail="Latest event size"
        />
        <MetricCard
          label="Session move"
          value={formatPercent(sessionMovePct)}
          detail={`High ${formatCurrency(instrument.sessionHigh)}`}
        />
      </div>

      <PriceChartCard
        animateOnMount={animateOnMount}
        symbol={instrument.symbol}
        instrumentName={instrument.name}
        currentPrice={currentTick.price}
        sessionMovePct={sessionMovePct}
        sessionHigh={instrument.sessionHigh}
        sessionLow={instrument.sessionLow}
        ticks={ticks}
      />

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by event id or source"
        onSearchChange={setQuery}
      />

      <MarketDataTable rows={rows} />
    </div>
  )
}
