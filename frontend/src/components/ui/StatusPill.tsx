import { cn } from '../../lib/utils'
import { type SimulationStatus } from '../../types/trading'

interface StatusPillProps {
  status: SimulationStatus
}

const labelMap: Record<SimulationStatus, string> = {
  live: 'Feed live',
  paused: 'Feed paused',
  disconnected: 'Disconnected'
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-panel border px-3.5 py-2 text-sm font-semibold',
        status === 'live' && 'border-accent/15 bg-accent/5 text-accent',
        status === 'paused' && 'border-warning/20 bg-warning/10 text-warning',
        status === 'disconnected' && 'border-negative/20 bg-negative/10 text-negative'
      )}
    >
      <span
        className={cn(
          'status-dot',
          status === 'live' && 'status-dot-live',
          status === 'paused' && 'status-dot-paused',
          status === 'disconnected' && 'status-dot-disconnected'
        )}
        aria-hidden="true"
      />
      {labelMap[status]}
    </div>
  )
}
