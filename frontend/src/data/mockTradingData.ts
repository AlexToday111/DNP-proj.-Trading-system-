import {
  type Execution,
  type Instrument,
  type MarketTick,
  type NavigationItem,
  type Order,
  type PortfolioSnapshot,
  type ScenarioSetting,
  type ServiceHealth,
  type Signal
} from '../types/trading'

export const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Overview', description: 'What matters right now' },
  { id: 'market-data', label: 'Market Data', description: 'Price path and replay tape' },
  { id: 'signals', label: 'Signals', description: 'Strategy output and conviction' },
  { id: 'orders', label: 'Orders', description: 'Trading-core order lifecycle' },
  { id: 'executions', label: 'Executions', description: 'Simulated fills and slippage' },
  { id: 'portfolio', label: 'Portfolio', description: 'Holdings, value, and PnL' },
  { id: 'system-health', label: 'System Health', description: 'Services, latency, and flow' },
  { id: 'settings', label: 'Settings', description: 'Scenario and replay controls' }
]

export const instruments: Instrument[] = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    venue: 'NASDAQ',
    previousClose: 188.94,
    sessionHigh: 192.41,
    sessionLow: 189.12
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    venue: 'NASDAQ',
    previousClose: 978.24,
    sessionHigh: 997.3,
    sessionLow: 980.82
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    venue: 'NASDAQ',
    previousClose: 427.18,
    sessionHigh: 434.92,
    sessionLow: 427.92
  }
]

export const marketTicks: MarketTick[] = [
  { eventId: 'md-1001', symbol: 'AAPL', price: 189.42, volume: 1120000, source: 'csv-replay', timestamp: '2026-04-24T09:30:02Z' },
  { eventId: 'md-1002', symbol: 'NVDA', price: 981.33, volume: 820000, source: 'csv-replay', timestamp: '2026-04-24T09:30:08Z' },
  { eventId: 'md-1003', symbol: 'MSFT', price: 428.14, volume: 640000, source: 'csv-replay', timestamp: '2026-04-24T09:30:15Z' },
  { eventId: 'md-1004', symbol: 'AAPL', price: 190.06, volume: 1460000, source: 'csv-replay', timestamp: '2026-04-24T09:30:23Z' },
  { eventId: 'md-1005', symbol: 'NVDA', price: 985.74, volume: 1020000, source: 'csv-replay', timestamp: '2026-04-24T09:30:31Z' },
  { eventId: 'md-1006', symbol: 'MSFT', price: 429.51, volume: 702000, source: 'csv-replay', timestamp: '2026-04-24T09:30:38Z' },
  { eventId: 'md-1007', symbol: 'AAPL', price: 190.88, volume: 1910000, source: 'csv-replay', timestamp: '2026-04-24T09:30:49Z' },
  { eventId: 'md-1008', symbol: 'NVDA', price: 988.16, volume: 1270000, source: 'csv-replay', timestamp: '2026-04-24T09:31:03Z' },
  { eventId: 'md-1009', symbol: 'MSFT', price: 431.22, volume: 894000, source: 'csv-replay', timestamp: '2026-04-24T09:31:16Z' },
  { eventId: 'md-1010', symbol: 'AAPL', price: 191.47, volume: 2080000, source: 'csv-replay', timestamp: '2026-04-24T09:31:24Z' },
  { eventId: 'md-1011', symbol: 'NVDA', price: 991.42, volume: 1440000, source: 'csv-replay', timestamp: '2026-04-24T09:31:36Z' },
  { eventId: 'md-1012', symbol: 'MSFT', price: 432.58, volume: 970000, source: 'csv-replay', timestamp: '2026-04-24T09:31:47Z' },
  { eventId: 'md-1013', symbol: 'AAPL', price: 192.03, volume: 2210000, source: 'csv-replay', timestamp: '2026-04-24T09:31:59Z' },
  { eventId: 'md-1014', symbol: 'NVDA', price: 995.11, volume: 1610000, source: 'csv-replay', timestamp: '2026-04-24T09:32:09Z' },
  { eventId: 'md-1015', symbol: 'MSFT', price: 433.76, volume: 1030000, source: 'csv-replay', timestamp: '2026-04-24T09:32:18Z' },
  { eventId: 'md-1016', symbol: 'AAPL', price: 192.41, volume: 2370000, source: 'csv-replay', timestamp: '2026-04-24T09:32:29Z' },
  { eventId: 'md-1017', symbol: 'NVDA', price: 996.63, volume: 1730000, source: 'csv-replay', timestamp: '2026-04-24T09:32:41Z' },
  { eventId: 'md-1018', symbol: 'MSFT', price: 434.24, volume: 1110000, source: 'csv-replay', timestamp: '2026-04-24T09:32:52Z' },
  { eventId: 'md-1019', symbol: 'AAPL', price: 191.98, volume: 2450000, source: 'csv-replay', timestamp: '2026-04-24T09:33:05Z' },
  { eventId: 'md-1020', symbol: 'NVDA', price: 994.58, volume: 1650000, source: 'csv-replay', timestamp: '2026-04-24T09:33:17Z' },
  { eventId: 'md-1021', symbol: 'MSFT', price: 433.87, volume: 1080000, source: 'csv-replay', timestamp: '2026-04-24T09:33:28Z' }
]

export const signals: Signal[] = [
  { signalId: 'sig-3001', symbol: 'AAPL', side: 'BUY', quantity: 50, targetPrice: 190.1, conviction: 'High', reason: 'Momentum breakout confirmed on open drive', timestamp: '2026-04-24T09:30:25Z' },
  { signalId: 'sig-3002', symbol: 'NVDA', side: 'BUY', quantity: 12, targetPrice: 986.2, conviction: 'Medium', reason: 'Trend continuation through overnight resistance', timestamp: '2026-04-24T09:30:34Z' },
  { signalId: 'sig-3003', symbol: 'MSFT', side: 'BUY', quantity: 28, targetPrice: 430.2, conviction: 'Medium', reason: 'Price reclaim with steady tape participation', timestamp: '2026-04-24T09:30:44Z' },
  { signalId: 'sig-3004', symbol: 'AAPL', side: 'BUY', quantity: 35, targetPrice: 191.2, conviction: 'High', reason: 'Volume confirmation after higher low', timestamp: '2026-04-24T09:31:05Z' },
  { signalId: 'sig-3005', symbol: 'NVDA', side: 'SELL', quantity: 8, targetPrice: 990.7, conviction: 'Low', reason: 'Partial de-risk into local extension', timestamp: '2026-04-24T09:31:38Z' },
  { signalId: 'sig-3006', symbol: 'MSFT', side: 'BUY', quantity: 24, targetPrice: 433.1, conviction: 'Medium', reason: 'Higher low with stable spread and breadth', timestamp: '2026-04-24T09:32:03Z' }
]

export const orders: Order[] = [
  { orderId: 'ord-4101', signalId: 'sig-3001', symbol: 'AAPL', side: 'BUY', quantity: 50, requestedPrice: 190.1, status: 'FILLED', timestamp: '2026-04-24T09:30:26Z' },
  { orderId: 'ord-4102', signalId: 'sig-3002', symbol: 'NVDA', side: 'BUY', quantity: 12, requestedPrice: 986.2, status: 'FILLED', timestamp: '2026-04-24T09:30:35Z' },
  { orderId: 'ord-4103', signalId: 'sig-3003', symbol: 'MSFT', side: 'BUY', quantity: 28, requestedPrice: 430.2, status: 'FILLED', timestamp: '2026-04-24T09:30:46Z' },
  { orderId: 'ord-4104', signalId: 'sig-3004', symbol: 'AAPL', side: 'BUY', quantity: 35, requestedPrice: 191.2, status: 'FILLED', timestamp: '2026-04-24T09:31:06Z' },
  { orderId: 'ord-4105', signalId: 'sig-3005', symbol: 'NVDA', side: 'SELL', quantity: 8, requestedPrice: 990.7, status: 'ROUTED', timestamp: '2026-04-24T09:31:39Z' },
  { orderId: 'ord-4106', signalId: 'sig-3006', symbol: 'MSFT', side: 'BUY', quantity: 24, requestedPrice: 433.1, status: 'PLACED', timestamp: '2026-04-24T09:32:04Z' }
]

export const executions: Execution[] = [
  { executionId: 'exe-5201', orderId: 'ord-4101', symbol: 'AAPL', side: 'BUY', quantity: 50, executedPrice: 190.06, status: 'FILLED', timestamp: '2026-04-24T09:30:29Z', venue: 'SIM-NASDAQ', slippageBps: -2 },
  { executionId: 'exe-5202', orderId: 'ord-4102', symbol: 'NVDA', side: 'BUY', quantity: 12, executedPrice: 985.74, status: 'FILLED', timestamp: '2026-04-24T09:30:36Z', venue: 'SIM-NASDAQ', slippageBps: -5 },
  { executionId: 'exe-5203', orderId: 'ord-4103', symbol: 'MSFT', side: 'BUY', quantity: 28, executedPrice: 429.51, status: 'FILLED', timestamp: '2026-04-24T09:30:48Z', venue: 'SIM-BATS', slippageBps: -16 },
  { executionId: 'exe-5204', orderId: 'ord-4104', symbol: 'AAPL', side: 'BUY', quantity: 35, executedPrice: 191.47, status: 'FILLED', timestamp: '2026-04-24T09:31:09Z', venue: 'SIM-NASDAQ', slippageBps: 14 },
  { executionId: 'exe-5205', orderId: 'ord-4105', symbol: 'NVDA', side: 'SELL', quantity: 8, executedPrice: 991.42, status: 'FILLED', timestamp: '2026-04-24T09:31:41Z', venue: 'SIM-NASDAQ', slippageBps: 7 },
  { executionId: 'exe-5206', orderId: 'ord-4106', symbol: 'MSFT', side: 'BUY', quantity: 24, executedPrice: 433.76, status: 'FILLED', timestamp: '2026-04-24T09:32:08Z', venue: 'SIM-BATS', slippageBps: 15 }
]

export const portfolioHistory: PortfolioSnapshot[] = [
  { updatedAt: '2026-04-24T09:30:00Z', cashBalance: 100000, marketValue: 0, realizedPnl: 0, unrealizedPnl: 0, totalPnl: 0, totalValue: 100000, positions: [] },
  {
    updatedAt: '2026-04-24T09:30:30Z',
    cashBalance: 90497,
    marketValue: 9544,
    realizedPnl: 0,
    unrealizedPnl: 41,
    totalPnl: 41,
    totalValue: 100041,
    positions: [{ symbol: 'AAPL', quantity: 50, averageEntry: 190.06, marketPrice: 190.88, marketValue: 9544, unrealizedPnl: 41, weight: 0.095 }]
  },
  {
    updatedAt: '2026-04-24T09:30:39Z',
    cashBalance: 78668.12,
    marketValue: 21455.36,
    realizedPnl: 0,
    unrealizedPnl: 123.48,
    totalPnl: 123.48,
    totalValue: 100123.48,
    positions: [
      { symbol: 'AAPL', quantity: 50, averageEntry: 190.06, marketPrice: 190.88, marketValue: 9544, unrealizedPnl: 41, weight: 0.095 },
      { symbol: 'NVDA', quantity: 12, averageEntry: 985.74, marketPrice: 988.16, marketValue: 11857.92, unrealizedPnl: 82.48, weight: 0.118 }
    ]
  },
  {
    updatedAt: '2026-04-24T09:30:51Z',
    cashBalance: 66641.84,
    marketValue: 33616.72,
    realizedPnl: 0,
    unrealizedPnl: 228.56,
    totalPnl: 228.56,
    totalValue: 100228.56,
    positions: [
      { symbol: 'AAPL', quantity: 50, averageEntry: 190.06, marketPrice: 190.88, marketValue: 9544, unrealizedPnl: 41, weight: 0.095 },
      { symbol: 'NVDA', quantity: 12, averageEntry: 985.74, marketPrice: 988.16, marketValue: 11857.92, unrealizedPnl: 82.48, weight: 0.118 },
      { symbol: 'MSFT', quantity: 28, averageEntry: 429.51, marketPrice: 431.22, marketValue: 12074.8, unrealizedPnl: 105.08, weight: 0.12 }
    ]
  },
  {
    updatedAt: '2026-04-24T09:31:12Z',
    cashBalance: 59940.39,
    marketValue: 40403.6,
    realizedPnl: 0,
    unrealizedPnl: 306.99,
    totalPnl: 306.99,
    totalValue: 100306.99,
    positions: [
      { symbol: 'AAPL', quantity: 85, averageEntry: 190.64, marketPrice: 191.47, marketValue: 16274.95, unrealizedPnl: 70.55, weight: 0.162 },
      { symbol: 'NVDA', quantity: 12, averageEntry: 985.74, marketPrice: 988.16, marketValue: 11857.92, unrealizedPnl: 82.48, weight: 0.118 },
      { symbol: 'MSFT', quantity: 28, averageEntry: 429.51, marketPrice: 431.22, marketValue: 12074.8, unrealizedPnl: 105.08, weight: 0.12 }
    ]
  },
  {
    updatedAt: '2026-04-24T09:31:44Z',
    cashBalance: 67871.75,
    marketValue: 32592.42,
    realizedPnl: 45.44,
    unrealizedPnl: 418.73,
    totalPnl: 464.17,
    totalValue: 100464.17,
    positions: [
      { symbol: 'AAPL', quantity: 85, averageEntry: 190.64, marketPrice: 192.03, marketValue: 16322.55, unrealizedPnl: 118.15, weight: 0.162 },
      { symbol: 'NVDA', quantity: 4, averageEntry: 985.74, marketPrice: 991.42, marketValue: 3965.68, unrealizedPnl: 22.72, weight: 0.039 },
      { symbol: 'MSFT', quantity: 28, averageEntry: 429.51, marketPrice: 432.58, marketValue: 12112.24, unrealizedPnl: 277.86, weight: 0.121 }
    ]
  },
  {
    updatedAt: '2026-04-24T09:32:10Z',
    cashBalance: 57461.51,
    marketValue: 43196.33,
    realizedPnl: 45.44,
    unrealizedPnl: 612.4,
    totalPnl: 657.84,
    totalValue: 100657.84,
    positions: [
      { symbol: 'AAPL', quantity: 85, averageEntry: 190.64, marketPrice: 192.03, marketValue: 16322.55, unrealizedPnl: 118.15, weight: 0.162 },
      { symbol: 'NVDA', quantity: 4, averageEntry: 985.74, marketPrice: 995.11, marketValue: 3980.44, unrealizedPnl: 37.48, weight: 0.04 },
      { symbol: 'MSFT', quantity: 52, averageEntry: 431.47, marketPrice: 433.76, marketValue: 22555.52, unrealizedPnl: 456.77, weight: 0.224 }
    ]
  },
  {
    updatedAt: '2026-04-24T09:33:00Z',
    cashBalance: 57461.51,
    marketValue: 43314.59,
    realizedPnl: 45.44,
    unrealizedPnl: 730.66,
    totalPnl: 776.1,
    totalValue: 100776.1,
    positions: [
      { symbol: 'AAPL', quantity: 85, averageEntry: 190.64, marketPrice: 191.98, marketValue: 16318.3, unrealizedPnl: 113.9, weight: 0.162 },
      { symbol: 'NVDA', quantity: 4, averageEntry: 985.74, marketPrice: 994.58, marketValue: 3978.32, unrealizedPnl: 35.36, weight: 0.039 },
      { symbol: 'MSFT', quantity: 52, averageEntry: 431.47, marketPrice: 433.87, marketValue: 22518.24, unrealizedPnl: 581.4, weight: 0.223 }
    ]
  }
]

export const serviceHealth: ServiceHealth[] = [
  {
    serviceId: 'svc-1',
    name: 'market-data-service',
    status: 'healthy',
    latencyMs: 18,
    detail: 'Streaming replay ticks into topic market-data',
    lastHeartbeat: '2026-04-24T09:33:28Z',
    channel: 'Kafka / market-data'
  },
  {
    serviceId: 'svc-2',
    name: 'strategy-service',
    status: 'degraded',
    latencyMs: 82,
    detail: 'Signal generation stable with minor processing lag',
    lastHeartbeat: '2026-04-24T09:33:27Z',
    channel: 'Kafka / signals'
  },
  {
    serviceId: 'svc-3',
    name: 'trading-core',
    status: 'healthy',
    latencyMs: 24,
    detail: 'Orders, portfolio snapshots, and websocket feed are healthy',
    lastHeartbeat: '2026-04-24T09:33:28Z',
    channel: 'REST + WebSocket'
  },
  {
    serviceId: 'svc-4',
    name: 'execution-sim-service',
    status: 'healthy',
    latencyMs: 29,
    detail: 'Fill simulator matching with price cache in sync',
    lastHeartbeat: '2026-04-24T09:33:26Z',
    channel: 'Kafka / execution-result'
  },
  {
    serviceId: 'svc-5',
    name: 'portfolio-db',
    status: 'healthy',
    latencyMs: 13,
    detail: 'PostgreSQL persistence healthy for snapshots and audit trail',
    lastHeartbeat: '2026-04-24T09:33:28Z',
    channel: 'PostgreSQL'
  }
]

export const scenarioSettings: ScenarioSetting[] = [
  {
    id: 'auto-follow',
    label: 'Auto-follow selected instrument',
    description: 'Keep overview cards focused on the instrument selected in the top bar.',
    type: 'toggle',
    value: true
  },
  {
    id: 'playback-speed',
    label: 'Replay speed',
    description: 'Controls how quickly new market events advance through the mock simulation.',
    type: 'range',
    value: 1,
    min: 1,
    max: 5,
    step: 1
  },
  {
    id: 'starting-capital',
    label: 'Starting capital',
    description: 'Simulation bankroll used when initializing a new scenario.',
    type: 'select',
    value: '$100k',
    options: ['$100k', '$250k', '$500k']
  },
  {
    id: 'activity-mode',
    label: 'Activity stream density',
    description: 'Adjusts how much event detail is shown in the recent activity stream.',
    type: 'select',
    value: 'Balanced',
    options: ['Calm', 'Balanced', 'Verbose']
  }
]

export const simulationStartIndex = 8
