export type PageId =
  | 'overview'
  | 'market-data'
  | 'signals'
  | 'orders'
  | 'executions'
  | 'portfolio'
  | 'system-health'

export type Side = 'BUY' | 'SELL'
export type AppStatus = 'live' | 'disconnected'
export type OrderStatus = 'NEW' | 'PLACED' | 'ROUTED' | 'PARTIAL' | 'FILLED' | 'REJECTED' | 'CANCELLED'
export type ExecutionStatus = 'FILLED' | 'PARTIAL' | 'REJECTED'
export type BackendSystemState = 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN'
export type ServiceStatus = 'healthy' | 'degraded' | 'down'
export type Tone = 'positive' | 'negative' | 'warning' | 'neutral'

export interface DashboardLocation {
  page: PageId
  symbol: string
}

export interface NavigationItem {
  id: PageId
  label: string
  description: string
}

export interface ApiListResponse<T> {
  items: T[]
}

export interface HealthResponse {
  status: BackendSystemState
  service: string
  timestamp: string
}

export interface ApiSystemService {
  name: string
  status: BackendSystemState
  type: string
}

export interface SystemStatusResponse {
  status: BackendSystemState
  services: ApiSystemService[]
  timestamp: string
}

export interface ApiMarketTick {
  eventId: string
  symbol: string
  price: number
  volume: number
  timestamp: string
}

export interface MarketHistoryPoint {
  price: number
  timestamp: string
}

export interface MarketHistoryResponse {
  symbol: string
  items: MarketHistoryPoint[]
}

export interface ApiSignal {
  signalId: string
  symbol: string
  side: Side
  price: number
  reason: string
  timestamp: string
}

export interface ApiOrder {
  orderId: string
  signalId: string | null
  symbol: string
  side: Side
  quantity: number
  orderType: string
  limitPrice: number | null
  status: OrderStatus
  timestamp: string
}

export interface ApiExecution {
  executionId: string
  orderId: string
  symbol: string
  side: Side
  quantity: number
  executedPrice: number
  status: ExecutionStatus
  marketDataEventId: string | null
  priceTimestamp: string | null
  timestamp: string
}

export interface PortfolioResponse {
  cash: number
  totalPositionValue: number
  totalPortfolioValue: number
  realizedPnl: number
  unrealizedPnl: number
  totalPnl: number
  updatedAt: string
}

export interface ApiPosition {
  symbol: string
  quantity: number
  averageEntryPrice: number
  latestPrice: number
  marketValue: number
  unrealizedPnl: number
  updatedAt: string
}

export interface DashboardResponse {
  systemStatus: {
    status: BackendSystemState
  }
  latestMarketData: ApiMarketTick[]
  latestSignals: ApiSignal[]
  latestOrders: ApiOrder[]
  latestExecutions: ApiExecution[]
  portfolio: PortfolioResponse
}

export interface MarketTick {
  eventId: string
  symbol: string
  price: number
  volume: number
  timestamp: string
}

export interface Signal {
  signalId: string
  symbol: string
  side: Side
  price: number
  reason: string
  timestamp: string
}

export interface Order {
  orderId: string
  signalId: string | null
  symbol: string
  side: Side
  quantity: number
  orderType: string
  limitPrice: number | null
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
  marketDataEventId: string | null
  priceTimestamp: string | null
  timestamp: string
}

export interface Position {
  symbol: string
  quantity: number
  averageEntryPrice: number
  latestPrice: number
  marketValue: number
  unrealizedPnl: number
  updatedAt: string
  weight: number
}

export interface PortfolioSnapshot {
  updatedAt: string
  cash: number
  totalPositionValue: number
  totalPortfolioValue: number
  realizedPnl: number
  unrealizedPnl: number
  totalPnl: number
}

export interface ServiceHealth {
  serviceId: string
  name: string
  status: ServiceStatus
  type: string
  detail: string
  lastHeartbeat: string
}

export interface ActivityEvent {
  id: string
  kind: 'market' | 'signal' | 'order' | 'execution' | 'system' | 'portfolio'
  title: string
  detail: string
  timestamp: string
  tone: Tone
}
