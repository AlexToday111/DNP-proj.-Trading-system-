import { cn, formatTime } from '../../lib/utils'
import { type ServiceHealth } from '../../types/trading'

interface ServiceHealthCardProps {
  services: ServiceHealth[]
  compact?: boolean
  className?: string
}

const statusStyles = {
  healthy: 'bg-accent-soft text-positive',
  degraded: 'bg-warning/10 text-warning',
  down: 'bg-negative/10 text-negative'
}

export function ServiceHealthCard({
  services,
  compact = false,
  className = ''
}: ServiceHealthCardProps) {
  return (
    <section className={`surface-card panel-fixed flex flex-col p-5 sm:p-6 ${className}`}>
      <div className="border-b border-line pb-4">
        <p className="eyebrow">System health</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-text sm:text-2xl">
          Services and status
        </h3>
      </div>

      <div className={`panel-scroll mt-4 grid gap-3 ${compact ? '' : 'lg:grid-cols-2'}`}>
        {services.map((service) => (
          <article
            key={service.serviceId}
            className="min-w-0 overflow-hidden rounded-[24px] border border-line bg-shell p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-text">{service.name}</p>
                <p className="mt-1 break-words text-sm text-muted">{service.type}</p>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusStyles[service.status])}>
                {service.status}
              </span>
            </div>
            <p className="mt-3 break-words text-sm leading-6 text-muted">{service.detail}</p>
            <div className="mt-4 text-sm text-muted">UTC {formatTime(service.lastHeartbeat)}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
