import { useDeferredValue, useMemo, useState } from 'react'
import { LatestSignalCard } from '../components/dashboard/LatestSignalCard'
import { SignalsTable } from '../components/tables/SignalsTable'
import { FilterBar } from '../components/ui/FilterBar'
import { MetricCard } from '../components/ui/MetricCard'
import { type Signal } from '../types/trading'

interface SignalsPageProps {
  signals: Signal[]
  latestSignal: Signal
}

export function SignalsPage({ signals, latestSignal }: SignalsPageProps) {
  const [query, setQuery] = useState('')
  const [side, setSide] = useState('all')
  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(
    () =>
      [...signals]
        .reverse()
        .filter((signal) => {
          const matchesSide = side === 'all' || signal.side === side
          const haystack = `${signal.signalId} ${signal.symbol} ${signal.reason}`.toLowerCase()
          return matchesSide && haystack.includes(deferredQuery.toLowerCase())
        }),
    [deferredQuery, side, signals]
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Signals" value={String(signals.length)} detail="Total visible strategy outputs" />
          <MetricCard label="Buy bias" value={String(signals.filter((signal) => signal.side === 'BUY').length)} detail="Signals leaning long" />
          <MetricCard label="Sell bias" value={String(signals.filter((signal) => signal.side === 'SELL').length)} detail="Signals leaning defensive" />
        </div>
        <LatestSignalCard signal={latestSignal} />
      </div>

      <FilterBar
        searchValue={query}
        searchPlaceholder="Search by signal id, symbol, or reason"
        onSearchChange={setQuery}
        filters={[
          {
            label: 'Side',
            value: side,
            onChange: setSide,
            options: [
              { label: 'All sides', value: 'all' },
              { label: 'Buy', value: 'BUY' },
              { label: 'Sell', value: 'SELL' }
            ]
          }
        ]}
      />

      <SignalsTable rows={rows} />
    </div>
  )
}
