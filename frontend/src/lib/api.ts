import type {
  ApiExecution,
  ApiListResponse,
  ApiMarketTick,
  ApiOrder,
  ApiPosition,
  ApiSignal,
  DashboardResponse,
  HealthResponse,
  MarketHistoryResponse,
  PortfolioResponse,
  SystemStatusResponse
} from '../types/trading'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:8080/api/v1'

async function request<T>(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === '') return
    url.searchParams.set(key, String(value))
  })

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export const api = {
  baseUrl: API_BASE_URL,
  getHealth: () => request<HealthResponse>('/health'),
  getSystemStatus: () => request<SystemStatusResponse>('/system/status'),
  getDashboard: () => request<DashboardResponse>('/dashboard'),
  getMarketData: (symbol?: string, limit = 50) =>
    request<ApiListResponse<ApiMarketTick>>('/market-data', { symbol, limit }),
  getLatestMarketData: (symbol: string) => request<ApiMarketTick>(`/market-data/${encodeURIComponent(symbol)}/latest`),
  getMarketHistory: (symbol: string, limit = 100) =>
    request<MarketHistoryResponse>(`/market-data/${encodeURIComponent(symbol)}/history`, { limit }),
  getSignals: (symbol?: string, limit = 50) =>
    request<ApiListResponse<ApiSignal>>('/signals', { symbol, limit }),
  getOrders: (symbol?: string, limit = 50) =>
    request<ApiListResponse<ApiOrder>>('/orders', { symbol, limit }),
  getExecutions: (symbol?: string, limit = 50) =>
    request<ApiListResponse<ApiExecution>>('/executions', { symbol, limit }),
  getPortfolio: () => request<PortfolioResponse>('/portfolio'),
  getPositions: () => request<ApiListResponse<ApiPosition>>('/portfolio/positions')
}
