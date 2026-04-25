import { startTransition, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import {
  buildDashboardHref,
  defaultPage,
  navigationItems,
  readDashboardLocation
} from '../lib/navigation'
import {
  formatCompactNumber,
  formatCurrency,
  toneFromNumber,
  toneFromService
} from '../lib/utils'
import {
  type ActivityEvent,
  type ApiExecution,
  type ApiMarketTick,
  type ApiOrder,
  type ApiPosition,
  type ApiSignal,
  type AppStatus,
  type DashboardLocation,
  type Execution,
  type MarketHistoryPoint,
  type MarketTick,
  type Order,
  type PageId,
  type PortfolioSnapshot,
  type Position,
  type ServiceHealth,
  type Signal
} from '../types/trading'

const EMPTY_PORTFOLIO: PortfolioSnapshot = {
  updatedAt: '',
  cash: 0,
  totalPositionValue: 0,
  totalPortfolioValue: 0,
  realizedPnl: 0,
  unrealizedPnl: 0,
  totalPnl: 0
}

function mapMarketTick(tick: ApiMarketTick): MarketTick {
  return {
    eventId: tick.eventId,
    symbol: tick.symbol,
    price: tick.price,
    volume: tick.volume,
    timestamp: tick.timestamp
  }
}

function mapSignal(signal: ApiSignal): Signal {
  return {
    signalId: signal.signalId,
    symbol: signal.symbol,
    side: signal.side,
    price: signal.price,
    reason: signal.reason,
    timestamp: signal.timestamp
  }
}

function mapOrder(order: ApiOrder): Order {
  return {
    orderId: order.orderId,
    signalId: order.signalId,
    symbol: order.symbol,
    side: order.side,
    quantity: order.quantity,
    orderType: order.orderType,
    limitPrice: order.limitPrice,
    status: order.status,
    timestamp: order.timestamp
  }
}

function mapExecution(execution: ApiExecution): Execution {
  return {
    executionId: execution.executionId,
    orderId: execution.orderId,
    symbol: execution.symbol,
    side: execution.side,
    quantity: execution.quantity,
    executedPrice: execution.executedPrice,
    status: execution.status,
    marketDataEventId: execution.marketDataEventId,
    priceTimestamp: execution.priceTimestamp,
    timestamp: execution.timestamp
  }
}

function mapPortfolioSnapshot(snapshot: PortfolioSnapshot): PortfolioSnapshot {
  return snapshot
}

function mapPosition(position: ApiPosition, portfolioValue: number): Position {
  const weight = portfolioValue > 0 ? position.marketValue / portfolioValue : 0

  return {
    symbol: position.symbol,
    quantity: position.quantity,
    averageEntryPrice: position.averageEntryPrice,
    latestPrice: position.latestPrice,
    marketValue: position.marketValue,
    unrealizedPnl: position.unrealizedPnl,
    updatedAt: position.updatedAt,
    weight
  }
}

function mapServiceStatus(status: string): ServiceHealth['status'] {
  if (status === 'UP') return 'healthy'
  if (status === 'DEGRADED') return 'degraded'
  return 'down'
}

function buildActivity(
  marketData: MarketTick[],
  signals: Signal[],
  orders: Order[],
  executions: Execution[],
  services: ServiceHealth[],
  portfolio: PortfolioSnapshot
): ActivityEvent[] {
  return [
    ...marketData.slice(0, 3).map((tick) => ({
      id: tick.eventId,
      kind: 'market' as const,
      title: `${tick.symbol} market data`,
      detail: `${formatCurrency(tick.price)} • volume ${formatCompactNumber(tick.volume)}`,
      timestamp: tick.timestamp,
      tone: 'neutral' as const
    })),
    ...signals.slice(0, 3).map((signal) => ({
      id: signal.signalId,
      kind: 'signal' as const,
      title: `${signal.side} ${signal.symbol}`,
      detail: signal.reason,
      timestamp: signal.timestamp,
      tone: signal.side === 'BUY' ? 'positive' as const : 'warning' as const
    })),
    ...orders.slice(0, 3).map((order) => ({
      id: order.orderId,
      kind: 'order' as const,
      title: `${order.status} ${order.symbol}`,
      detail: `${order.side} ${order.quantity} • ${order.orderType}`,
      timestamp: order.timestamp,
      tone: order.status === 'FILLED' ? 'positive' as const : 'neutral' as const
    })),
    ...executions.slice(0, 3).map((execution) => ({
      id: execution.executionId,
      kind: 'execution' as const,
      title: `${execution.status} ${execution.symbol}`,
      detail: `${execution.side} ${execution.quantity} @ ${formatCurrency(execution.executedPrice)}`,
      timestamp: execution.timestamp,
      tone: 'positive' as const
    })),
    ...services.slice(0, 3).map((service) => ({
      id: service.serviceId,
      kind: 'system' as const,
      title: service.name,
      detail: service.detail,
      timestamp: service.lastHeartbeat,
      tone: toneFromService(service.status)
    })),
    {
      id: `portfolio-${portfolio.updatedAt || 'empty'}`,
      kind: 'portfolio' as const,
      title: 'Portfolio updated',
      detail: `Total value ${formatCurrency(portfolio.totalPortfolioValue)}`,
      timestamp: portfolio.updatedAt,
      tone: toneFromNumber(portfolio.totalPnl)
    }
  ]
    .filter((item) => item.timestamp)
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, 10)
}

export function useDashboardState() {
  const [location, setLocation] = useState<DashboardLocation>(() => readDashboardLocation())
  const [appStatus, setAppStatus] = useState<AppStatus>('live')
  const [isBooting, setIsBooting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardMarketData, setDashboardMarketData] = useState<MarketTick[]>([])
  const [dashboardSignals, setDashboardSignals] = useState<Signal[]>([])
  const [dashboardOrders, setDashboardOrders] = useState<Order[]>([])
  const [dashboardExecutions, setDashboardExecutions] = useState<Execution[]>([])
  const [marketData, setMarketData] = useState<MarketTick[]>([])
  const [marketHistory, setMarketHistory] = useState<MarketHistoryPoint[]>([])
  const [latestMarketTick, setLatestMarketTick] = useState<MarketTick | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [portfolioSnapshot, setPortfolioSnapshot] = useState<PortfolioSnapshot>(EMPTY_PORTFOLIO)
  const [positions, setPositions] = useState<Position[]>([])

  useEffect(() => {
    const handlePopState = () => setLocation(readDashboardLocation())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        const [health, dashboard] = await Promise.all([api.getHealth(), api.getDashboard()])
        if (!active) return

        setDashboardMarketData(dashboard.latestMarketData.map(mapMarketTick))
        setDashboardSignals(dashboard.latestSignals.map(mapSignal))
        setDashboardOrders(dashboard.latestOrders.map(mapOrder))
        setDashboardExecutions(dashboard.latestExecutions.map(mapExecution))
        setPortfolioSnapshot(
          mapPortfolioSnapshot({
            updatedAt: dashboard.portfolio.updatedAt,
            cash: dashboard.portfolio.cash,
            totalPositionValue: dashboard.portfolio.totalPositionValue,
            totalPortfolioValue: dashboard.portfolio.totalPortfolioValue,
            realizedPnl: dashboard.portfolio.realizedPnl,
            unrealizedPnl: dashboard.portfolio.unrealizedPnl,
            totalPnl: dashboard.portfolio.totalPnl
          })
        )
        setAppStatus(health.status === 'UP' ? 'live' : 'disconnected')
        setError(null)
      } catch (loadError) {
        if (!active) return
        setAppStatus('disconnected')
        setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard')
      } finally {
        if (active) {
          setIsBooting(false)
        }
      }
    }

    void loadDashboard()
    const intervalId = window.setInterval(() => {
      void loadDashboard()
    }, 2000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  const availableSymbols = useMemo(() => {
    const symbols = new Set<string>()

    dashboardMarketData.forEach((item) => symbols.add(item.symbol))
    marketData.forEach((item) => symbols.add(item.symbol))
    positions.forEach((item) => symbols.add(item.symbol))
    signals.forEach((item) => symbols.add(item.symbol))
    orders.forEach((item) => symbols.add(item.symbol))
    executions.forEach((item) => symbols.add(item.symbol))

    return [...symbols]
  }, [dashboardExecutions, dashboardMarketData, executions, marketData, orders, positions, signals])

  useEffect(() => {
    const fallbackSymbol =
      availableSymbols[0] ??
      dashboardMarketData[0]?.symbol ??
      positions[0]?.symbol ??
      'AAPL'

    if (!location.symbol || (availableSymbols.length > 0 && !availableSymbols.includes(location.symbol))) {
      const nextLocation = { page: location.page, symbol: fallbackSymbol }
      setLocation(nextLocation)
      window.history.replaceState({}, '', buildDashboardHref(nextLocation))
    }
  }, [availableSymbols, dashboardMarketData, location.page, location.symbol, positions])

  useEffect(() => {
    if (!location.symbol) return

    let active = true

    const loadPageData = async () => {
      try {
        const [
          marketDataResponse,
          latestMarketDataResponse,
          marketHistoryResponse,
          signalsResponse,
          ordersResponse,
          executionsResponse,
          systemStatusResponse,
          portfolioResponse,
          positionsResponse
        ] = await Promise.all([
          api.getMarketData(location.symbol, 50),
          api.getLatestMarketData(location.symbol),
          api.getMarketHistory(location.symbol, 100),
          api.getSignals(location.symbol, 50),
          api.getOrders(location.symbol, 50),
          api.getExecutions(location.symbol, 50),
          api.getSystemStatus(),
          api.getPortfolio(),
          api.getPositions()
        ])

        if (!active) return

        setMarketData(marketDataResponse.items.map(mapMarketTick))
        setLatestMarketTick(mapMarketTick(latestMarketDataResponse))
        setMarketHistory(marketHistoryResponse.items)
        setSignals(signalsResponse.items.map(mapSignal))
        setOrders(ordersResponse.items.map(mapOrder))
        setExecutions(executionsResponse.items.map(mapExecution))
        setServices(
          systemStatusResponse.services.map((service, index) => ({
            serviceId: `${service.name}-${index}`,
            name: service.name,
            status: mapServiceStatus(service.status),
            type: service.type,
            detail: `${service.type} status ${service.status}`,
            lastHeartbeat: systemStatusResponse.timestamp
          }))
        )
        setPortfolioSnapshot({
          updatedAt: portfolioResponse.updatedAt,
          cash: portfolioResponse.cash,
          totalPositionValue: portfolioResponse.totalPositionValue,
          totalPortfolioValue: portfolioResponse.totalPortfolioValue,
          realizedPnl: portfolioResponse.realizedPnl,
          unrealizedPnl: portfolioResponse.unrealizedPnl,
          totalPnl: portfolioResponse.totalPnl
        })
        setPositions(
          positionsResponse.items.map((position) =>
            mapPosition(position, portfolioResponse.totalPortfolioValue)
          )
        )
        setAppStatus('live')
        setError(null)
      } catch (loadError) {
        if (!active) return
        setAppStatus('disconnected')
        setError(loadError instanceof Error ? loadError.message : 'Failed to load page data')
      }
    }

    void loadPageData()

    return () => {
      active = false
    }
  }, [location.symbol])

  const currentTick =
    latestMarketTick ??
    marketData[0] ??
    dashboardMarketData.find((item) => item.symbol === location.symbol) ??
    dashboardMarketData[0] ??
    null

  const selectedHistory = marketHistory.length > 0 ? marketHistory : marketData
  const openingPrice = selectedHistory[0]?.price ?? currentTick?.price ?? 0
  const sessionMovePct =
    openingPrice > 0 && currentTick ? ((currentTick.price - openingPrice) / openingPrice) * 100 : 0
  const latestSignal = signals[0] ?? dashboardSignals.find((item) => item.symbol === location.symbol) ?? null
  const latestOrder = orders[0] ?? dashboardOrders.find((item) => item.symbol === location.symbol) ?? null
  const latestExecution =
    executions[0] ?? dashboardExecutions.find((item) => item.symbol === location.symbol) ?? null
  const activePosition = positions.find((position) => position.symbol === location.symbol) ?? null
  const filledOrders = orders.filter((order) => order.status === 'FILLED').length
  const openOrders = orders.filter((order) => !['FILLED', 'REJECTED', 'CANCELLED'].includes(order.status)).length
  const fillRatio = orders.length ? Math.round((filledOrders / orders.length) * 100) : 0
  const serviceCounts = {
    healthy: services.filter((service) => service.status === 'healthy').length,
    degraded: services.filter((service) => service.status === 'degraded').length,
    down: services.filter((service) => service.status === 'down').length
  }

  const recentActivity = useMemo(
    () => buildActivity(dashboardMarketData, dashboardSignals, dashboardOrders, dashboardExecutions, services, portfolioSnapshot),
    [dashboardExecutions, dashboardMarketData, dashboardOrders, dashboardSignals, portfolioSnapshot, services]
  )

  const goToPage = (page: PageId) => {
    const nextLocation = { page, symbol: location.symbol || availableSymbols[0] || 'AAPL' }
    startTransition(() => {
      setLocation(nextLocation)
      window.history.pushState({}, '', buildDashboardHref(nextLocation))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  const setSymbol = (symbol: string) => {
    const nextLocation = { page: location.page, symbol }
    startTransition(() => {
      setLocation(nextLocation)
      window.history.pushState({}, '', buildDashboardHref(nextLocation))
    })
  }

  useEffect(() => {
    const currentPage = navigationItems.find((item) => item.id === location.page)?.label ?? 'Overview'
    document.title = `${currentPage} · ${location.symbol || 'AAPL'} · Porta`
  }, [location.page, location.symbol])

  return {
    activePage: location.page,
    selectedSymbol: location.symbol,
    symbols: availableSymbols,
    effectiveStatus: appStatus,
    isBooting,
    error,
    dashboardMarketData,
    dashboardSignals,
    dashboardOrders,
    dashboardExecutions,
    marketData,
    marketHistory: selectedHistory,
    currentTick,
    signals,
    orders,
    executions,
    services,
    serviceCounts,
    portfolioSnapshot,
    positions,
    activePosition,
    latestSignal,
    latestOrder,
    latestExecution,
    sessionMovePct,
    fillRatio,
    openOrders,
    recentActivity,
    goToPage,
    setSymbol,
    apiBaseUrl: api.baseUrl
  }
}
