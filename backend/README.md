# Porta Backend

The Porta backend is a distributed event-driven system built around Java `trading-core`, Java `strategy-service`, Go services, Kafka, and PostgreSQL.

The target end-to-end flow is:

```text
MarketData -> Signal -> Order -> ExecutionResult -> PortfolioUpdate
```

Java `trading-core` is the central core service and backend-for-frontend. The frontend must communicate only with Java `trading-core`.

```text
Frontend -> Java trading-core -> Kafka / PostgreSQL / backend services
```

The frontend must not communicate directly with:

- Java `strategy-service`;
- Go services;
- Kafka;
- PostgreSQL.

## Team Responsibilities

| Member | Area | Responsibility |
| --- | --- | --- |
| Ernest | Java Backend | Java `trading-core`, Java `strategy-service`, orchestration, order flow, portfolio state, PostgreSQL persistence, frontend API. |
| Nikita | Golang Backend | Go `market-data-service`, market data ingestion and Kafka publishing. |
| Zakhar | Golang Backend | Go `execution-sim-service`, latest price cache, order execution simulation, execution result publishing. |

## Backend Services

### Java trading-core

Java `trading-core` owns the core trading state and frontend-facing API.

Responsibilities:

- expose REST API for the frontend;
- consume Kafka topic `signals`;
- create orders from signals;
- create manual orders from frontend requests;
- persist orders;
- publish orders to Kafka topic `orders`;
- consume Kafka topic `execution-result`;
- update order status;
- update portfolio cash, positions, average entry price, and PnL;
- persist state in PostgreSQL;
- return dashboard snapshots to the frontend.

Core domain entities:

- `Signal`
- `Order`
- `ExecutionResult`
- `Portfolio`
- `Position`

### Java strategy-service

Java `strategy-service` is responsible for generating trading signals from market data.

Responsibilities:

- consume Kafka topic `market-data`;
- keep the latest price per symbol in memory;
- apply a simple MVP momentum rule;
- publish Kafka topic `signals`;
- include explicit signal quantity for Java `trading-core`.

Minimum MVP behavior:

1. Consume a market data event from Kafka topic `market-data`.
2. Compare the price with the previous price for the same symbol.
3. Publish `BUY` when the price is new or increasing.
4. Publish `SELL` when the price is decreasing.
5. Skip signal publishing when the price is unchanged.

### Go market-data-service

Go `market-data-service` is responsible for providing market data to the rest of the system.

Responsibilities:

- read market data from CSV, mock source, or another configured source;
- validate required input fields;
- convert rows into JSON market data events;
- publish events to Kafka topic `market-data`;
- support replay mode;
- log published events.

Minimum MVP behavior:

1. Read a row from the market data source.
2. Convert it to a JSON event.
3. Publish it to Kafka.
4. Repeat for all available data.

### Go execution-sim-service

Go `execution-sim-service` simulates order execution.

Responsibilities:

- consume Kafka topic `orders`;
- consume Kafka topic `market-data`;
- maintain a latest price cache by `symbol`;
- execute or reject incoming orders based on latest market data;
- publish execution results to Kafka topic `execution-result`;
- return `REJECTED` or `NO_MARKET_DATA` when a valid price is unavailable;
- log incoming market data, orders, and execution results.

Minimum MVP behavior:

1. Consume market data from Kafka topic `market-data`.
2. Update latest price cache by `symbol`.
3. Consume orders from Kafka topic `orders`.
4. Find the latest price for `order.symbol`.
5. Create an execution result with `executedPrice`.
6. Publish the result to Kafka topic `execution-result`.

For MVP, the latest price cache can be an in-memory map inside `execution-sim-service`.

Redis can remain an optional future improvement if multiple service instances need shared latest prices.

Important boundary:

`execution-sim-service` should not fetch market data directly from an external source. The internal source of market data is `market-data-service`, and other services consume that data through Kafka.

## Backend Event Flow

```text
market-data-service
  -> Kafka topic `market-data`
     -> Java strategy-service
     -> execution-sim-service
     -> optionally trading-core for dashboard/history

Java strategy-service
  -> Kafka topic `signals`
  -> trading-core

trading-core
  -> Kafka topic `orders`
  -> execution-sim-service

execution-sim-service
  -> Kafka topic `execution-result`
  -> trading-core

trading-core
  -> PostgreSQL
  -> frontend API
```

## Kafka Topics

| Topic | Producer | Consumers | Purpose |
| --- | --- | --- | --- |
| `market-data` | `market-data-service` | Java `strategy-service`, `execution-sim-service`, optionally `trading-core` | Market price stream. |
| `signals` | Java `strategy-service` | `trading-core` | Trading decisions. |
| `orders` | `trading-core` | `execution-sim-service` | Orders to simulate. |
| `execution-result` | `execution-sim-service` | `trading-core` | Execution outcomes for order and portfolio updates. |

## Consumer Groups

Java `strategy-service` and `execution-sim-service` must consume `market-data` with different Kafka consumer groups.

This is required because both services need the full market data stream:

- Java `strategy-service` needs market data to generate signals;
- `execution-sim-service` needs market data to maintain latest price cache.

If both services share the same consumer group, Kafka will split market data events between them, which is not correct for Porta.

## Event Contracts

### MarketData

Topic: `market-data`

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

### Order

Topic: `orders`

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

For MVP, orders can be treated as `MARKET` orders and `limitPrice` can be `null`.

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

### ExecutionResult

Topic: `execution-result`

Fields:

- `executionId`
- `orderId`
- `symbol`
- `side`
- `quantity`
- `executedPrice`
- `status`
- `timestamp`
- `marketDataEventId`
- `priceTimestamp`

`marketDataEventId` and `priceTimestamp` identify which market data event was used for the simulated execution and how fresh the execution price was.

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

## Storage

PostgreSQL is used by Java `trading-core` for persistent state:

- signals;
- orders;
- execution results;
- portfolio state;
- positions;
- market data history, if needed for dashboard and history views.

## MVP Targets

### Java Backend

- `trading-core` is running.
- It consumes signals.
- It creates and publishes orders.
- It consumes execution results.
- It updates portfolio state.
- It exposes frontend API endpoints.
- `strategy-service` is running.
- It consumes market data and publishes signals.

### Go market-data-service

- Service is running.
- It reads market data from CSV or configured source.
- It publishes `market-data` events to Kafka.

### Go execution-sim-service

- Service is running.
- It consumes `orders`.
- It consumes `market-data`.
- It updates latest price cache.
- It publishes `execution-result` events.

## Documentation

More detailed system documentation is available in the root [`docs`](../docs) directory:

- [Architecture](../docs/architecture.md)
- [Backend Flow](../docs/backend-flow.md)
- [Kafka Topics](../docs/kafka-topics.md)
- [Event Contracts](../docs/event-contracts.md)
- [Frontend API](../docs/frontend-api.md)
- [Demo Flow](../docs/demo-flow.md)
- [Development Notes](../docs/development-notes.md)

## Current Assumptions and TODOs

- Java `strategy-service` is the producer of `signals`.
- `market-data` must be consumed by both Java `strategy-service` and `execution-sim-service`.
- Real service health checks should be connected to the Java system status API.
- Cross-service event contracts should stay aligned before demo.
- If a service sends a different payload shape, document the mismatch before changing another team's code.
