import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  change?: string
  tone?: 'positive' | 'negative' | 'warning' | 'neutral'
  icon?: ReactNode
}

export function MetricCard({
  label,
  value,
  detail,
  change,
  tone = 'neutral',
  icon
}: MetricCardProps) {
  return (
    <article className="surface-card surface-card-hover panel-shell p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <div className="mt-3 truncate font-mono text-2xl font-semibold tracking-[-0.06em] text-text sm:text-3xl">
            {value}
          </div>
        </div>
        {icon ? <div className="rounded-2xl bg-shell p-3 text-muted">{icon}</div> : null}
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 flex-1 break-words text-sm leading-5 text-muted">{detail}</p>
        {change ? (
          <span
            className={cn(
              'rounded-full px-2.5 py-1 font-mono text-xs font-semibold',
              tone === 'positive' && 'bg-accent-soft text-positive',
              tone === 'negative' && 'bg-negative/10 text-negative',
              tone === 'warning' && 'bg-warning/10 text-warning',
              tone === 'neutral' && 'bg-shell text-muted'
            )}
          >
            {change}
          </span>
        ) : null}
      </div>
    </article>
  )
}
