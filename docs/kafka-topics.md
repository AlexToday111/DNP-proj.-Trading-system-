<h1 align="center">Kafka Topics</h1>

Kafka is the main event bus between Porta backend services.

## Topic Summary

| Topic | Producer | Consumers | Purpose |
| --- | --- | --- | --- |
| `market-data` | Go `market-data-service` | `strategy-service`, Go `execution-sim-service`, optionally Java `trading-core` | Distributes market price events. |
| `signals` | `strategy-service` | Java `trading-core` | Carries trading signals that Java turns into orders. |
| `orders` | Java `trading-core` | Go `execution-sim-service` | Carries orders to be simulated. |
| `execution-result` | Go `execution-sim-service` | Java `trading-core` | Carries execution outcomes back to Java. |

## Consumer Groups

`market-data` must be consumed by both `strategy-service` and `execution-sim-service`.

These services must use different consumer groups:

- `strategy-service` receives the full market data stream for signal generation.
- `execution-sim-service` receives the full market data stream for latest price cache updates.

If they share a consumer group, Kafka will split events between them, which is incorrect for this architecture.

## `market-data`

Purpose: market price event stream.

Producer:

- Go `market-data-service`

Consumers:

- `strategy-service`
- Go `execution-sim-service`
- Java `trading-core`, optional for dashboard/history persistence

Example payload:

```json
{
  "eventId": "md-001",
  "symbol": "AAPL",
  "price": 187.42,
  "volume": 1000,
  "timestamp": "2026-04-25T12:00:00Z"
}
```

## `signals`

Purpose: trading decision stream.

Producer:

- `strategy-service`

Consumer:

- Java `trading-core`

Example payload:

```json
{
  "signalId": "sig-001",
  "symbol": "AAPL",
  "side": "BUY",
  "quantity": 10,
  "price": 187.42,
  "reason": "PRICE_CROSSOVER",
  "timestamp": "2026-04-25T12:00:01Z"
}
```

Current assumption: if quantity is not provided by `strategy-service`, Java can apply an MVP fallback. Future strategy output should publish explicit sizing.

## `orders`

Purpose: order stream from Java core to execution simulator.

Producer:

- Java `trading-core`

Consumer:

- Go `execution-sim-service`

Example payload:

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

## `execution-result`

Purpose: execution result stream from simulator back to Java core.

Producer:

- Go `execution-sim-service`

Consumer:

- Java `trading-core`

Example payload:

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
