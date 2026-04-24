import { formatCurrency, formatPercent, toneFromNumber } from '../../lib/utils'
import { type Instrument, type MarketTick, type Position } from '../../types/trading'

interface InstrumentSummaryCardProps {
  instrument: Instrument
  tick: MarketTick
  sessionMovePct: number
  position: Position | null
  className?: string
}

export function InstrumentSummaryCard({
  instrument,
  tick,
  sessionMovePct,
  position,
  className = ''
}: InstrumentSummaryCardProps) {
  const tone = toneFromNumber(sessionMovePct)

  return (
    <section className={`surface-card panel-fixed p-5 sm:p-6 ${className}`}>
      <p className="eyebrow">Active instrument</p>
      <div className="mt-3 flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">{instrument.symbol}</h3>
          <p className="mt-1 break-words text-sm text-muted">
            {instrument.name} • {instrument.venue}
          </p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
          tone === 'positive'
            ? 'bg-accent-soft text-positive'
            : tone === 'negative'
              ? 'bg-negative/10 text-negative'
              : 'bg-shell text-muted'
        }`}>
          {formatPercent(sessionMovePct)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Last price</p>
          <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {formatCurrency(tick.price)}
          </p>
        </div>
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Position</p>
          <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {position?.quantity ?? 0}
          </p>
        </div>
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Avg entry</p>
          <p className="mt-2 break-words font-mono text-base text-text sm:text-lg">
            {position ? formatCurrency(position.averageEntry) : 'No position'}
          </p>
        </div>
        <div className="min-w-0 rounded-[22px] border border-line bg-shell p-4">
          <p className="eyebrow">Open PnL</p>
          <p className={`mt-2 break-words font-mono text-base sm:text-lg ${position && position.unrealizedPnl < 0 ? 'text-negative' : 'text-positive'}`}>
            {formatCurrency(position?.unrealizedPnl ?? 0)}
          </p>
        </div>
      </div>
    </section>
  )
}
