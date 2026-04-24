import { instruments, navigationItems } from '../../data/mockTradingData'
import { type PageId, type SimulationStatus } from '../../types/trading'
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
  const description = `${currentPage.description} for ${selectedSymbol} in the active trading simulation.`

  return (
    <header
      className={`surface-card z-10 bg-white/85 p-4 backdrop-blur sm:p-5 ${
        isOverview ? 'panel-shell' : 'sticky top-4'
      }`}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-text">
            {currentPage.label}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            {description}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={status} />
            <button
              type="button"
              className="control-button"
              onClick={onToggleSimulation}
            >
              {status === 'live' ? 'Pause feed' : 'Resume feed'}
            </button>
            <button
              type="button"
              className="control-button"
              onClick={onResetView}
            >
              Reset view
            </button>
          </div>

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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-accent text-white shadow-soft'
                      : 'border border-line bg-shell text-text hover:border-accent/30 hover:bg-white'
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
