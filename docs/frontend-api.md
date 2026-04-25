<h1 align="center">Frontend API Contract</h1>

This document describes the intended frontend-facing API exposed by Java `trading-core`.

The frontend must call only Java `trading-core`. It must not call Go services, Kafka, or PostgreSQL directly.

Base path:

```http
/api/v1
```

## Endpoint Summary

```http
GET /api/v1/health
GET /api/v1/system/status
GET /api/v1/dashboard
GET /api/v1/market-data?limit=50
GET /api/v1/market-data/{symbol}/latest
GET /api/v1/market-data/{symbol}/history
GET /api/v1/signals?limit=50
GET /api/v1/orders?limit=50
GET /api/v1/orders/{orderId}
POST /api/v1/orders
GET /api/v1/executions?limit=50
GET /api/v1/orders/{orderId}/executions
GET /api/v1/portfolio
GET /api/v1/portfolio/positions
GET /api/v1/portfolio/positions/{symbol}
```

Optional real-time endpoints:

```http
GET /api/v1/events/stream
WS /api/v1/ws/events
```

Current assumption: polling `/api/v1/dashboard` is enough for MVP if SSE or WebSocket is not implemented.

## Health

```http
GET /api/v1/health
```

```json
{
  "status": "UP",
  "service": "trading-core",
  "timestamp": "2026-04-25T12:00:00Z"
}
```

## System Status

```http
GET /api/v1/system/status
```

```json
{
  "status": "UP",
  "services": [
    {
      "name": "trading-core",
      "status": "UP",
      "type": "JAVA_CORE"
    },
    {
      "name": "market-data-service",
      "status": "UNKNOWN",
      "type": "GO_SERVICE"
    },
    {
      "name": "execution-sim-service",
      "status": "UNKNOWN",
      "type": "GO_SERVICE"
    },
    {
      "name": "kafka",
      "status": "UNKNOWN",
      "type": "MESSAGE_BROKER"
    },
    {
      "name": "postgresql",
      "status": "UNKNOWN",
      "type": "DATABASE"
    }
  ],
  "timestamp": "2026-04-25T12:00:00Z"
}
```

TODO: replace static dependency status values with active health checks.

## Dashboard

```http
GET /api/v1/dashboard
```

```json
{
  "systemStatus": {
    "status": "UP"
  },
  "latestMarketData": [
    {
      "eventId": "md-001",
      "symbol": "AAPL",
      "price": 187.42,
      "volume": 1000,
      "timestamp": "2026-04-25T12:00:00Z"
    }
  ],
  "latestSignals": [
    {
      "signalId": "sig-001",
      "symbol": "AAPL",
      "side": "BUY",
      "price": 187.42,
      "reason": "PRICE_CROSSOVER",
      "timestamp": "2026-04-25T12:00:01Z"
    }
  ],
  "latestOrders": [
    {
      "orderId": "ord-001",
      "signalId": "sig-001",
      "symbol": "AAPL",
      "side": "BUY",
      "quantity": 10,
      "orderType": "MARKET",
      "limitPrice": null,
      "status": "FILLED",
      "timestamp": "2026-04-25T12:00:02Z"
    }
  ],
  "latestExecutions": [
    {
      "executionId": "exec-001",
      "orderId": "ord-001",
      "symbol": "AAPL",
      "side": "BUY",
      "quantity": 10,
      "executedPrice": 187.42,
      "status": "FILLED",
      "marketDataEventId": "md-001",
      "priceTimestamp": "2026-04-25T12:00:00Z",
      "timestamp": "2026-04-25T12:00:03Z"
    }
  ],
  "portfolio": {
    "cash": 98125.8,
    "totalPositionValue": 1874.2,
    "totalPortfolioValue": 100000.0,
    "realizedPnl": 0.0,
    "unrealizedPnl": 12.4,
    "totalPnl": 12.4,
    "updatedAt": "2026-04-25T12:00:03Z"
  }
}
```

## Market Data

```http
GET /api/v1/market-data?symbol=AAPL&limit=50
```

```json
{
  "items": [
    {
      "eventId": "md-001",
      "symbol": "AAPL",
      "price": 187.42,
      "volume": 1000,
      "timestamp": "2026-04-25T12:00:00Z"
    }
  ]
}
```

```http
GET /api/v1/market-data/AAPL/latest
GET /api/v1/market-data/AAPL/history?limit=100
```

History response:

```json
{
  "symbol": "AAPL",
  "items": [
    {
      "price": 186.9,
      "timestamp": "2026-04-25T11:59:00Z"
    },
    {
      "price": 187.42,
      "timestamp": "2026-04-25T12:00:00Z"
    }
  ]
}
```

## Signals

```http
GET /api/v1/signals?symbol=AAPL&side=BUY&limit=50
```

```json
{
  "items": [
    {
      "signalId": "sig-001",
      "symbol": "AAPL",
      "side": "BUY",
      "price": 187.42,
      "reason": "PRICE_CROSSOVER",
      "timestamp": "2026-04-25T12:00:01Z"
    }
  ]
}
```

## Orders

```http
GET /api/v1/orders?symbol=AAPL&status=NEW&side=BUY&limit=50
GET /api/v1/orders/{orderId}
```

```json
{
  "items": [
    {
      "orderId": "ord-001",
      "signalId": "sig-001",
      "symbol": "AAPL",
      "side": "BUY",
      "quantity": 10,
      "orderType": "MARKET",
      "limitPrice": null,
      "status": "NEW",
      "timestamp": "2026-04-25T12:00:02Z"
    }
  ]
}
```

Create order:

```http
POST /api/v1/orders
Content-Type: application/json
```

```json
{
  "symbol": "AAPL",
  "side": "BUY",
  "quantity": 10,
  "orderType": "MARKET",
  "limitPrice": null
}
```

## Executions

```http
GET /api/v1/executions?symbol=AAPL&status=FILLED&limit=50
GET /api/v1/orders/{orderId}/executions
```

```json
{
  "items": [
    {
      "executionId": "exec-001",
      "orderId": "ord-001",
      "symbol": "AAPL",
      "side": "BUY",
      "quantity": 10,
      "executedPrice": 187.42,
      "status": "FILLED",
      "marketDataEventId": "md-001",
      "priceTimestamp": "2026-04-25T12:00:00Z",
      "timestamp": "2026-04-25T12:00:03Z"
    }
  ]
}
```

## Portfolio

```http
GET /api/v1/portfolio
```

```json
{
  "cash": 98125.8,
  "totalPositionValue": 1874.2,
  "totalPortfolioValue": 100000.0,
  "realizedPnl": 0.0,
  "unrealizedPnl": 12.4,
  "totalPnl": 12.4,
  "updatedAt": "2026-04-25T12:00:03Z"
}
```

```http
GET /api/v1/portfolio/positions
GET /api/v1/portfolio/positions/{symbol}
```

```json
{
  "items": [
    {
      "symbol": "AAPL",
      "quantity": 10,
      "averageEntryPrice": 187.42,
      "latestPrice": 188.66,
      "marketValue": 1886.6,
      "unrealizedPnl": 12.4,
      "updatedAt": "2026-04-25T12:01:00Z"
    }
  ]
}
```

## Error Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Order not found",
    "timestamp": "2026-04-25T12:00:00Z"
  }
}
```
