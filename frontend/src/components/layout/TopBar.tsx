import { instruments, navigationItems } from '../../data/mockTradingData'
import { type PageId, type SimulationStatus } from '../../types/trading'
import { AppIcon } from '../ui/AppIcon'
import { StatusPill } from '../ui/StatusPill'

interface TopBarProps {
  activePage: PageId
  isOverview: boolean
  selectedSymbol: string
  status: SimulationStatus
  onSelectSymbol: (symbol: string) => void
  onToggleSimulation: () => void
  onResetView: () => void
}

export function TopBar({
  activePage,
  isOverview,
  selectedSymbol,
  status,
  onSelectSymbol,
  onToggleSimulation,
  onResetView
}: TopBarProps) {
  const currentPage = navigationItems.find((item) => item.id === activePage) ?? navigationItems[0]

  return (
    <header
      className={`z-10 border-b border-transparent bg-surface px-5 py-5 ${
        isOverview ? 'panel-shell' : 'sticky top-0'
      }`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-balance text-xl font-semibold text-text">
            {currentPage.label}
          </h2>
        </div>

        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative block min-w-[220px]">
            <span className="sr-only">Search</span>
            <input className="control-input pr-10 text-xs" placeholder="Search…" />
            <AppIcon name="search" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-panel border border-line bg-surface text-muted transition hover:border-accent/40 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
              onClick={onToggleSimulation}
              aria-label={status === 'live' ? 'Pause feed' : 'Resume feed'}
              title={status === 'live' ? 'Pause feed' : 'Resume feed'}
            >
              <AppIcon
                name={status === 'live' ? 'pause' : 'play'}
                className="h-4 w-4"
              />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-panel border border-line bg-surface text-muted transition hover:border-accent/40 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
              onClick={onResetView}
              aria-label="Reset view"
              title="Reset view"
            >
              <AppIcon name="reset" className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-panel border border-line bg-surface text-muted transition hover:border-accent/40 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
            aria-label="Notifications"
          >
            <AppIcon name="bell" className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 flex-wrap gap-2" role="tablist" aria-label="Instruments">
            {instruments.map((instrument) => {
              const isActive = instrument.symbol === selectedSymbol
              return (
                <button
                  key={instrument.symbol}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectSymbol(instrument.symbol)}
                  className={`rounded-panel px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 ${
                    isActive
                      ? 'bg-accent text-surface shadow-soft'
                      : 'border border-line bg-shell text-text hover:border-accent/40'
                  }`}
                >
                  {instrument.symbol}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
