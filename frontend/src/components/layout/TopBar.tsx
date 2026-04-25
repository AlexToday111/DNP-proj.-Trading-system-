import { navigationItems } from '../../lib/navigation'
import { type AppStatus, type PageId } from '../../types/trading'
import { AppIcon } from '../ui/AppIcon'
import { StatusPill } from '../ui/StatusPill'

interface TopBarProps {
  activePage: PageId
  selectedSymbol: string
  status: AppStatus
  symbols: string[]
  onSelectSymbol: (symbol: string) => void
}

export function TopBar({
  activePage,
  selectedSymbol,
  status,
  symbols,
  onSelectSymbol
}: TopBarProps) {
  const currentPage = navigationItems.find((item) => item.id === activePage) ?? navigationItems[0]

  return (
    <header className="sticky top-0 z-10 border-b border-transparent bg-surface px-5 py-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h2 className="text-balance text-xl font-semibold text-text">{currentPage.label}</h2>
          <p className="mt-1 text-sm text-muted">{currentPage.description}</p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative block min-w-[220px]">
            <span className="sr-only">Search</span>
            <input className="control-input pr-10 text-xs" placeholder="Connected to trading-core API" disabled />
            <AppIcon name="search" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </label>

          <StatusPill status={status} />

          {symbols.length > 1 ? (
            <div className="flex min-w-0 flex-wrap gap-2" role="tablist" aria-label="Instruments">
              {symbols.map((symbol) => {
                const isActive = symbol === selectedSymbol
                return (
                  <button
                    key={symbol}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onSelectSymbol(symbol)}
                    className={`rounded-panel px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 ${
                      isActive
                        ? 'bg-accent text-surface shadow-soft'
                        : 'border border-line bg-shell text-text hover:border-accent/40'
                    }`}
                  >
                    {symbol}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
