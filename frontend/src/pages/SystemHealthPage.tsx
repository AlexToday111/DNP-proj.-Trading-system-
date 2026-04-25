import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { ServiceHealthCard } from '../components/dashboard/ServiceHealthCard'
import { SystemFlowCard } from '../components/dashboard/SystemFlowCard'
import { MetricCard } from '../components/ui/MetricCard'
import { type ActivityEvent, type ServiceHealth } from '../types/trading'

interface SystemHealthPageProps {
  services: ServiceHealth[]
  activity: ActivityEvent[]
}

export function SystemHealthPage({
  services,
  activity
}: SystemHealthPageProps) {
  const healthy = services.filter((service) => service.status === 'healthy').length
  const degraded = services.filter((service) => service.status === 'degraded').length
  const down = services.filter((service) => service.status === 'down').length

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Healthy" value={String(healthy)} detail="Services operating normally" />
        <MetricCard label="Degraded" value={String(degraded)} detail="Services reporting degraded state" />
        <MetricCard label="Down" value={String(down)} detail="Unavailable services" />
      </div>

      <SystemFlowCard />

      <div className="grid gap-4 xl:grid-cols-12">
        <ServiceHealthCard services={services} className="xl:col-span-7" />
        <ActivityFeed
          events={activity.filter((event) => event.kind === 'system' || event.kind === 'execution' || event.kind === 'portfolio')}
          className="xl:col-span-5"
        />
      </div>
    </div>
  )
}
