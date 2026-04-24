import { navigationItems } from '../../data/mockTradingData'
import { formatShortTime } from '../../lib/utils'
import { type PageId, type SimulationStatus } from '../../types/trading'
import { StatusPill } from '../ui/StatusPill'

interface SidebarProps {
  activePage: PageId
  status: SimulationStatus
  timestamp: string
  onNavigate: (page: PageId) => void
}

export function Sidebar({ activePage, status, timestamp, onNavigate }: SidebarProps) {
  return (
    <aside className="surface-card flex h-full flex-col gap-6 bg-white/90 p-5 backdrop-blur sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-semibold text-white shadow-soft">
            DT
          </div>
          <div>
            <p className="eyebrow">DNP Project S26</p>
            <h1 className="text-xl font-semibold tracking-[-0.04em] text-text">Trading Terminal</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={status} />
          <p className="mono-data text-sm text-muted">UTC {formatShortTime(timestamp)}</p>
        </div>
      </div>

      <nav aria-label="Primary" className="grid gap-1.5">
        {navigationItems.map((item) => {
          const isActive = item.id === activePage
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-[20px] px-4 py-3 text-left transition ${
                isActive
                  ? 'bg-accent text-white shadow-soft'
                  : 'text-text hover:bg-shell'
              }`}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className={`mt-1 text-xs ${isActive ? 'text-white/80' : 'text-muted'}`}>
                {item.description}
              </div>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-[22px] border border-line bg-shell p-4">
        <p className="eyebrow">Workspace note</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Overview stays intentionally quiet. Detailed logs, routing state, and service internals are pushed into their own pages.
        </p>
      </div>
    </aside>
  )
}
