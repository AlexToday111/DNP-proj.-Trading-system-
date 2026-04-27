<h1 align="center">trading-core (Java backend)</h1>

`trading-core` is the core service / orchestrator / backend-for-frontend for DNP Trading System.

Frontend should call only this Java service:

```text
Frontend -> trading-core -> Kafka / PostgreSQL / backend services
```

The current backend flow is:

```text
market-data -> signals -> orders -> execution-result -> portfolio update
```

<h2 align="center">Implemented</h2>

- REST API under `/api/v1` for frontend dashboard, market data, signals, orders, executions and portfolio.
- Kafka consumer for `market-data`.
- Kafka consumer for `signals`.
- Kafka producer for `orders`.
- Kafka consumer for `execution-result`.
- Order creation from signals and manual frontend requests.
- Execution result handling with order status update.
- MVP portfolio updates for cash, positions, average entry price, realized PnL and unrealized PnL.
- PostgreSQL persistence through Spring Data JPA.
- Unified frontend error response format.
- CORS for local frontend origins.

<h2 align="center">REST Endpoints</h2>

- `GET /api/v1/health`
- `GET /api/v1/system/status`
- `GET /api/v1/dashboard`
- `GET /api/v1/market-data?symbol=AAPL&limit=50`
- `GET /api/v1/market-data/{symbol}/latest`
- `GET /api/v1/market-data/{symbol}/history?limit=100&from=...&to=...`
- `GET /api/v1/signals?symbol=AAPL&side=BUY&limit=50`
- `GET /api/v1/signals/{signalId}`
- `GET /api/v1/orders?symbol=AAPL&status=NEW&side=BUY&limit=50`
- `GET /api/v1/orders/{orderId}`
- `POST /api/v1/orders`
- `POST /api/v1/orders/{orderId}/cancel`
- `GET /api/v1/executions?symbol=AAPL&status=FILLED&limit=50`
- `GET /api/v1/executions/{executionId}`
- `GET /api/v1/orders/{orderId}/executions`
- `GET /api/v1/portfolio`
- `GET /api/v1/portfolio/positions`
- `GET /api/v1/portfolio/positions/{symbol}`

<h2 align="center">Kafka Topics</h2>

- `market-data`
- `signals`
- `orders`
- `execution-result`

Topic names are configured in `src/main/resources/application.yml`.

<h2 align="center">Quick Start</h2>

```bash
cd backend/java/trading-core
mvn spring-boot:run
```

<h2 align="center">Environment Variables</h2>

- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_CONSUMER_GROUP`
- `KAFKA_MARKET_DATA_TOPIC`
- `KAFKA_SIGNALS_TOPIC`
- `KAFKA_ORDERS_TOPIC`
- `KAFKA_EXECUTION_RESULT_TOPIC`
- `KAFKA_EXECUTION_RESULTS_TOPIC` legacy alias
