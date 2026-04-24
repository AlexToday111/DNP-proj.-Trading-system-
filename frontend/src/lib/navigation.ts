import { instruments, navigationItems } from '../data/mockTradingData'
import { type DashboardLocation, type PageId } from '../types/trading'

export const defaultPage: PageId = 'overview'
export const defaultSymbol = instruments[0].symbol

const validPages = new Set<PageId>(navigationItems.map((item) => item.id))
const validSymbols = new Set(instruments.map((instrument) => instrument.symbol))

export function readDashboardLocation(): DashboardLocation {
  if (typeof window === 'undefined') {
    return { page: defaultPage, symbol: defaultSymbol }
  }

  const params = new URLSearchParams(window.location.search)
  const page = params.get('page')
  const symbol = params.get('symbol')

  return {
    page: validPages.has(page as PageId) ? (page as PageId) : defaultPage,
    symbol: validSymbols.has(symbol ?? '') ? (symbol as string) : defaultSymbol
  }
}

export function buildDashboardHref(location: DashboardLocation) {
  const params = new URLSearchParams()
  params.set('page', location.page)
  params.set('symbol', location.symbol)
  return `?${params.toString()}`
}
