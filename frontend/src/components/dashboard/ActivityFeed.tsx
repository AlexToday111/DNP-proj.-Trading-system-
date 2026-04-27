import { useEffect, useRef } from 'react'
import { cn, formatTime } from '../../lib/utils'
import { type ActivityEvent } from '../../types/trading'

interface ActivityFeedProps {
  events: ActivityEvent[]
  className?: string
}

const toneStyles = {
  positive: 'border-accent/20 bg-accent/5 text-positive',
  negative: 'border-negative/20 bg-negative/10 text-negative',
  warning: 'border-warning/20 bg-warning/10 text-warning',
  neutral: 'border-line bg-shell text-muted'
}

export function ActivityFeed({ events, className = '' }: ActivityFeedProps) {
  const previousFirstEventIdRef = useRef<string | null>(null)
  const firstEventId = events[0]?.id ?? null
  const shouldAnimateFirstEvent = firstEventId !== previousFirstEventIdRef.current

  useEffect(() => {
    previousFirstEventIdRef.current = firstEventId
  }, [firstEventId])

  return (
    <section className={`surface-card panel-fixed flex flex-col p-5 sm:p-6 ${className}`}>
      <div className="border-b border-line pb-4">
        <p className="eyebrow">Recent activity</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
          What happened recently
        </h3>
      </div>

      <ul className="panel-scroll mt-4 space-y-3">
        {events.map((event, index) => (
          <li
            key={event.id}
            className={cn(
              'min-w-0 overflow-hidden rounded-[22px] border p-4 transition',
              toneStyles[event.tone],
              index === 0 && shouldAnimateFirstEvent && 'animate-fade-up'
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">{event.kind}</span>
                <span className="rounded-full bg-shell px-2 py-1 font-mono text-[11px] text-muted">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              <p className="mt-2 break-words text-sm font-semibold text-text">{event.title}</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted">{event.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
