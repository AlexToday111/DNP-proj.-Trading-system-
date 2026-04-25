import { cn } from '../../lib/utils'
import { type AppStatus } from '../../types/trading'

interface StatusPillProps {
  status: AppStatus
}

const labelMap: Record<AppStatus, string> = {
  live: 'Backend live',
  disconnected: 'Disconnected'
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-panel border px-3.5 py-2 text-sm font-semibold',
        status === 'live' && 'border-accent/15 bg-accent/5 text-accent',
        status === 'disconnected' && 'border-negative/20 bg-negative/10 text-negative'
      )}
    >
      <span
        className={cn(
          'status-dot',
          status === 'live' && 'status-dot-live',
          status === 'disconnected' && 'status-dot-disconnected'
        )}
        aria-hidden="true"
      />
      {labelMap[status]}
    </div>
  )
}
