import { navigationItems } from '../../lib/navigation'
import portaLogo from '../../assets/porta-logo.svg'
import { type AppStatus, type PageId } from '../../types/trading'
import { AppIcon, type AppIconName } from '../ui/AppIcon'

interface SidebarProps {
  activePage: PageId
  status: AppStatus
  onNavigate: (page: PageId) => void
  mode?: 'desktop' | 'mobile'
}

export function Sidebar({
  activePage,
  status,
  onNavigate,
  mode = 'desktop'
}: SidebarProps) {
  void status

  const iconMap: Record<PageId, AppIconName> = {
    overview: 'activity',
    'market-data': 'database',
    signals: 'signal',
    orders: 'list',
    executions: 'play',
    portfolio: 'briefcase',
    'system-health': 'gauge'
  }

  return (
    <aside
      className={`flex h-full flex-col gap-9 bg-surface px-7 py-8 ${
        mode === 'mobile' ? 'border-r border-line shadow-card' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={portaLogo} alt="Porta logo" className="h-8 w-8 shrink-0" />
        <div>
          <h1 className="text-xl font-semibold text-text">Porta</h1>
          <p className="sr-only">Porta trading terminal</p>
        </div>
      </div>

      <nav aria-label="Primary" className="grid gap-5">
        {navigationItems.map((item) => {
          const isActive = item.id === activePage
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex min-h-8 items-center gap-4 rounded-panel text-left text-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 ${
                isActive ? 'font-semibold text-accent' : 'text-muted hover:text-text'
              }`}
            >
              <span className={`grid h-5 w-5 place-items-center ${isActive ? 'text-accent' : 'text-muted group-hover:text-text'}`}>
                <AppIcon name={iconMap[item.id]} className="h-5 w-5" />
              </span>
              <span className="truncate">{item.label}</span>
              {isActive ? <span className="absolute -right-7 h-5 w-1.5 rounded-l bg-warning" /> : null}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
