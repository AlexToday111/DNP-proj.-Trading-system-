import { type DashboardLocation, type NavigationItem, type PageId } from '../types/trading'

export const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', description: 'System snapshot from trading-core' },
  { id: 'market-data', label: 'Market Data', description: 'Latest prices and history' },
  { id: 'signals', label: 'Signals', description: 'Strategy output from backend' },
  { id: 'orders', label: 'Orders', description: 'Order lifecycle from trading-core' },
  { id: 'executions', label: 'Executions', description: 'Execution results' },
  { id: 'portfolio', label: 'Portfolio', description: 'Current holdings and PnL' },
  { id: 'system-health', label: 'System Health', description: 'Health and service status' }
]

export const defaultPage: PageId = 'overview'
const validPages = new Set<PageId>(navigationItems.map((item) => item.id))

export function readDashboardLocation(): DashboardLocation {
  if (typeof window === 'undefined') {
    return { page: defaultPage, symbol: 'AAPL' }
  }

  const params = new URLSearchParams(window.location.search)
  const page = params.get('page')
  const symbol = params.get('symbol') ?? 'AAPL'

  return {
    page: validPages.has(page as PageId) ? (page as PageId) : defaultPage,
    symbol
  }
}

export function buildDashboardHref(location: DashboardLocation) {
  const params = new URLSearchParams()
  params.set('page', location.page)
  if (location.symbol) {
    params.set('symbol', location.symbol)
  }
  return `?${params.toString()}`
}
