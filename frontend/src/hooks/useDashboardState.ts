import { startTransition, useEffect, useMemo, useState } from 'react'
import {
  executions,
  instruments,
  marketTicks,
  navigationItems,
  orders,
  portfolioHistory,
  scenarioSettings,
  serviceHealth,
  signals,
  simulationStartIndex
} from '../data/mockTradingData'
import {
  buildDashboardHref,
  defaultPage,
  defaultSymbol,
  readDashboardLocation
} from '../lib/navigation'
import { formatCurrency, toneFromNumber, toneFromService } from '../lib/utils'
import {
  type ActivityEvent,
  type DashboardLocation,
  type PageId,
  type ScenarioSetting,
  type SimulationStatus
} from '../types/trading'

function filterByTime<T extends { timestamp: string }>(rows: T[], currentTimestamp: string) {
  return rows.filter((row) => row.timestamp <= currentTimestamp)
}

function filterSnapshots(currentTimestamp: string) {
  return portfolioHistory.filter((snapshot) => snapshot.updatedAt <= currentTimestamp)
}

export function useDashboardState() {
  const [location, setLocation] = useState<DashboardLocation>(() => readDashboardLocation())
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('live')
  const [playhead, setPlayhead] = useState(simulationStartIndex)
  const [isBooting, setIsBooting] = useState(true)
  const [settings, setSettings] = useState<ScenarioSetting[]>(scenarioSettings)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handlePopState = () => setLocation(readDashboardLocation())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (simulationStatus !== 'live') return undefined

    const playbackSpeed =
      settings.find((setting) => setting.id === 'playback-speed')?.value ?? 1
    const intervalMs = Math.max(900, 2200 - Number(playbackSpeed) * 220)

    const intervalId = window.setInterval(() => {
      setPlayhead((current) => (current >= marketTicks.length - 1 ? simulationStartIndex : current + 1))
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [settings, simulationStatus])

  const visibleTicks = marketTicks.slice(0, playhead + 1)
  const currentTimestamp = visibleTicks[visibleTicks.length - 1]?.timestamp ?? marketTicks[0].timestamp
  const visibleSignals = filterByTime(signals, currentTimestamp)
  const visibleOrders = filterByTime(orders, currentTimestamp)
  const visibleExecutions = filterByTime(executions, currentTimestamp)
  const portfolioSeries = filterSnapshots(currentTimestamp)
  const portfolioSnapshot = portfolioSeries[portfolioSeries.length - 1] ?? portfolioHistory[0]
  const selectedInstrument = instruments.find((instrument) => instrument.symbol === location.symbol) ?? instruments[0]
  const selectedTicks = visibleTicks.filter((tick) => tick.symbol === location.symbol)
  const currentTick = selectedTicks[selectedTicks.length - 1] ?? visibleTicks[visibleTicks.length - 1]
  const openingPrice = selectedTicks[0]?.price ?? selectedInstrument.previousClose
  const sessionMove = currentTick.price - openingPrice
  const sessionMovePct = openingPrice ? (sessionMove / openingPrice) * 100 : 0
  const activePosition = portfolioSnapshot.positions.find((position) => position.symbol === location.symbol) ?? null
  const latestSignal =
    [...visibleSignals].reverse().find((signal) => signal.symbol === location.symbol) ??
    visibleSignals[visibleSignals.length - 1] ??
    signals[0]
  const latestOrder =
    [...visibleOrders].reverse().find((order) => order.symbol === location.symbol) ??
    visibleOrders[visibleOrders.length - 1] ??
    orders[0]
  const latestExecution =
    [...visibleExecutions].reverse().find((execution) => execution.symbol === location.symbol) ??
    visibleExecutions[visibleExecutions.length - 1] ??
    executions[0]
  const filledOrders = visibleOrders.filter((order) => order.status === 'FILLED').length
  const openOrders = visibleOrders.filter((order) => order.status !== 'FILLED').length
  const fillRatio = visibleOrders.length ? Math.round((filledOrders / visibleOrders.length) * 100) : 0

  const serviceCounts = {
    healthy: serviceHealth.filter((service) => service.status === 'healthy').length,
    degraded: serviceHealth.filter((service) => service.status === 'degraded').length,
    down: serviceHealth.filter((service) => service.status === 'down').length
  }

  const effectiveStatus: SimulationStatus =
    serviceCounts.down > 0 ? 'disconnected' : simulationStatus

  const instrumentSummaries = instruments.map((instrument) => {
    const ticks = visibleTicks.filter((tick) => tick.symbol === instrument.symbol)
    const first = ticks[0]
    const last = ticks[ticks.length - 1] ?? ticks[0]
    const movePct = first ? ((last.price - first.price) / first.price) * 100 : 0

    return {
      ...instrument,
      price: last.price,
      movePct,
      volume: last.volume
    }
  })

  const recentActivity = useMemo<ActivityEvent[]>(() => {
    const marketEvents = visibleTicks.slice(-4).map((tick) => ({
      id: tick.eventId,
      kind: 'market' as const,
      title: `${tick.symbol} tick`,
      detail: `${formatCurrency(tick.price)} on ${tick.source}`,
      timestamp: tick.timestamp,
      tone: toneFromNumber(tick.price - selectedInstrument.previousClose)
    }))

    const signalEvents = visibleSignals.slice(-3).map((signal) => ({
      id: signal.signalId,
      kind: 'signal' as const,
      title: `${signal.side} ${signal.symbol}`,
      detail: `${signal.quantity} shares • ${signal.reason}`,
      timestamp: signal.timestamp,
      tone: signal.side === 'BUY' ? 'positive' as const : 'warning' as const
    }))

    const orderEvents = visibleOrders.slice(-3).map((order) => ({
      id: order.orderId,
      kind: 'order' as const,
      title: `${order.status} ${order.symbol}`,
      detail: `${order.quantity} shares at ${formatCurrency(order.requestedPrice)}`,
      timestamp: order.timestamp,
      tone: order.status === 'FILLED' ? 'positive' as const : 'neutral' as const
    }))

    const executionEvents = visibleExecutions.slice(-3).map((execution) => ({
      id: execution.executionId,
      kind: 'execution' as const,
      title: `${execution.symbol} fill`,
      detail: `${formatCurrency(execution.executedPrice)} • ${execution.venue}`,
      timestamp: execution.timestamp,
      tone: toneFromNumber(-execution.slippageBps)
    }))

    const systemEvents = serviceHealth.map((service) => ({
      id: service.serviceId,
      kind: 'system' as const,
      title: service.name,
      detail: service.detail,
      timestamp: service.lastHeartbeat,
      tone: toneFromService(service.status)
    }))

    return [...marketEvents, ...signalEvents, ...orderEvents, ...executionEvents, ...systemEvents]
      .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
      .slice(0, 10)
  }, [selectedInstrument.previousClose, visibleExecutions, visibleOrders, visibleSignals, visibleTicks])

  const goToPage = (page: PageId) => {
    const nextLocation = { page, symbol: location.symbol }
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

  const toggleSimulation = () => {
    setSimulationStatus((current) => (current === 'live' ? 'paused' : 'live'))
  }

  const resetView = () => {
    setPlayhead(simulationStartIndex)
    setSimulationStatus('live')
    const nextLocation = { page: defaultPage, symbol: defaultSymbol }
    setLocation(nextLocation)
    window.history.pushState({}, '', buildDashboardHref(nextLocation))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const updateSetting = (settingId: string, value: boolean | number | string) => {
    setSettings((current) =>
      current.map((setting) => (setting.id === settingId ? { ...setting, value } : setting))
    )
  }

  useEffect(() => {
    const currentPage = navigationItems.find((item) => item.id === location.page)?.label ?? 'Overview'
    document.title = `${currentPage} · ${location.symbol} · DNP Trading Terminal`
  }, [location.page, location.symbol])

  return {
    activePage: location.page,
    selectedSymbol: location.symbol,
    selectedInstrument,
    effectiveStatus,
    isBooting,
    settings,
    visibleTicks,
    visibleSignals,
    visibleOrders,
    visibleExecutions,
    portfolioSeries,
    portfolioSnapshot,
    currentTick,
    selectedTicks,
    sessionMove,
    sessionMovePct,
    activePosition,
    latestSignal,
    latestOrder,
    latestExecution,
    fillRatio,
    openOrders,
    serviceCounts,
    recentActivity,
    instrumentSummaries,
    goToPage,
    setSymbol,
    toggleSimulation,
    resetView,
    updateSetting
  }
}
