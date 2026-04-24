export type PageId =
  | 'overview'
  | 'market-data'
  | 'signals'
  | 'orders'
  | 'executions'
  | 'portfolio'
  | 'system-health'
  | 'settings'

export type Side = 'BUY' | 'SELL'
export type Tone = 'positive' | 'negative' | 'warning' | 'neutral'
export type SimulationStatus = 'live' | 'paused' | 'disconnected'
export type OrderStatus = 'PLACED' | 'ROUTED' | 'PARTIAL' | 'FILLED' | 'REJECTED'
export type ExecutionStatus = 'FILLED' | 'PARTIAL' | 'REJECTED'
export type ServiceStatus = 'healthy' | 'degraded' | 'down'

export interface Instrument {
  symbol: string
  name: string
  venue: string
  previousClose: number
  sessionHigh: number
  sessionLow: number
}

export interface MarketTick {
  eventId: string
  symbol: string
  price: number
  volume: number
  source: string
  timestamp: string
}

export interface Signal {
  signalId: string
  symbol: string
  side: Side
  quantity: number
  targetPrice: number
  conviction: 'High' | 'Medium' | 'Low'
  reason: string
  timestamp: string
}

export interface Order {
  orderId: string
  signalId: string
  symbol: string
  side: Side
  quantity: number
  requestedPrice: number
  status: OrderStatus
  timestamp: string
}

export interface Execution {
  executionId: string
  orderId: string
  symbol: string
  side: Side
  quantity: number
  executedPrice: number
  status: ExecutionStatus
  timestamp: string
  venue: string
  slippageBps: number
}

export interface Position {
  symbol: string
  quantity: number
  averageEntry: number
  marketPrice: number
  marketValue: number
  unrealizedPnl: number
  weight: number
}

export interface PortfolioSnapshot {
  updatedAt: string
  cashBalance: number
  marketValue: number
  realizedPnl: number
  unrealizedPnl: number
  totalPnl: number
  totalValue: number
  positions: Position[]
}

export interface ServiceHealth {
  serviceId: string
  name: string
  status: ServiceStatus
  latencyMs: number
  detail: string
  lastHeartbeat: string
  channel?: string
}

export interface ActivityEvent {
  id: string
  kind: 'market' | 'signal' | 'order' | 'execution' | 'system'
  title: string
  detail: string
  timestamp: string
  tone: Tone
}

export interface ScenarioSetting {
  id: string
  label: string
  description: string
  type: 'toggle' | 'range' | 'select'
  value: boolean | number | string
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export interface NavigationItem {
  id: PageId
  label: string
  description: string
}

export interface DashboardLocation {
  page: PageId
  symbol: string
}
