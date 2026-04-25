<h1 align="center">Event Contracts</h1>

This document describes the main event and response contracts used by Porta.

## MarketData

Fields:

- `eventId`
- `symbol`
- `price`
- `volume`
- `timestamp`

Example:

```json
{
  "eventId": "md-001",
  "symbol": "AAPL",
  "price": 187.42,
  "volume": 1000,
  "timestamp": "2026-04-25T12:00:00Z"
}
```

## Signal

Fields:

- `signalId`
- `symbol`
- `side`
- `price`
- `reason`
- `timestamp`

Example:

```json
{
  "signalId": "sig-001",
  "symbol": "AAPL",
  "side": "BUY",
  "price": 187.42,
  "reason": "PRICE_CROSSOVER",
  "timestamp": "2026-04-25T12:00:01Z"
}
```

Current assumption: signal quantity may be added by strategy output or defaulted by Java for MVP order sizing.

## Order

Fields:

- `orderId`
- `signalId`
- `symbol`
- `side`
- `quantity`
- `orderType`
- `limitPrice`
- `status`
- `timestamp`

Example:

```json
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
```

## ExecutionResult

Fields:

- `executionId`
- `orderId`
- `symbol`
- `side`
- `quantity`
- `executedPrice`
- `status`
- `marketDataEventId`
- `priceTimestamp`
- `timestamp`

Example:

```json
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
```

## PortfolioSnapshot

Fields:

- `cash`
- `totalPositionValue`
- `totalPortfolioValue`
- `realizedPnl`
- `unrealizedPnl`
- `totalPnl`
- `updatedAt`

Example:

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

## Enums

### Side

```text
BUY
SELL
```

### Order Type

```text
MARKET
LIMIT
```

### Order Status

```text
NEW
SENT
FILLED
PARTIALLY_FILLED
CANCELLED
REJECTED
```

### Execution Status

```text
FILLED
REJECTED
NO_MARKET_DATA
```

### Service Status

```text
UP
DOWN
DEGRADED
UNKNOWN
```
