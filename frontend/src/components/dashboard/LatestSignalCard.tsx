import { formatCurrency, formatTime } from '../../lib/utils'
import { type Signal } from '../../types/trading'

interface LatestSignalCardProps {
  signal: Signal
  className?: string
}

export function LatestSignalCard({ signal, className = '' }: LatestSignalCardProps) {
  const sideTone = signal.side === 'BUY' ? 'bg-accent-soft text-positive' : 'bg-warning/10 text-warning'

  return (
    <section className={`surface-card panel-fixed flex flex-col p-5 sm:p-6 ${className}`}>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Latest signal</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
            {signal.side} {signal.symbol}
          </h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sideTone}`}>
          {signal.conviction} conviction
        </span>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
        <div className="rounded-[22px] border border-line bg-shell p-4">
          <p className="break-words text-sm leading-6 text-muted">{signal.reason}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="min-w-0">
            <p className="eyebrow">Target</p>
            <p className="mono-data mt-1 break-words text-base text-text">{formatCurrency(signal.targetPrice)}</p>
          </div>
          <div className="min-w-0">
            <p className="eyebrow">Quantity</p>
            <p className="mono-data mt-1 text-base text-text">{signal.quantity}</p>
          </div>
          <div className="min-w-0">
            <p className="eyebrow">Time</p>
            <p className="mono-data mt-1 break-words text-base text-text">{formatTime(signal.timestamp)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
