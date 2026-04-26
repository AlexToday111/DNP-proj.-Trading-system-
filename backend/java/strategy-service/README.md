<h1 align="center">strategy-service (Java backend)</h1>

`strategy-service` is a simple Java/Spring Kafka service that turns market data into trading signals.

It consumes Kafka topic `market-data` and publishes Kafka topic `signals`.

<h2 align="center">MVP Strategy</h2>

The current strategy is intentionally small and deterministic:

- first valid market data event for a symbol emits a `BUY`;
- price increase versus the previous event for the same symbol emits a `BUY`;
- price decrease versus the previous event for the same symbol emits a `SELL`;
- unchanged price emits no signal;
- every emitted signal uses fixed quantity `1` unless `STRATEGY_SIGNAL_QUANTITY` is configured.

The service keeps only the latest price per symbol in memory. It does not store state in PostgreSQL and does not call `trading-core` directly.

<h2 align="center">Kafka Topics</h2>

- consumes `market-data`
- produces `signals`

Topic names are configured in `src/main/resources/application.yml`.

<h2 align="center">Quick Start</h2>

```bash
cd backend/java/strategy-service
mvn spring-boot:run
```

<h2 align="center">Environment Variables</h2>

- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_CONSUMER_GROUP`
- `KAFKA_MARKET_DATA_TOPIC`
- `KAFKA_SIGNALS_TOPIC`
- `STRATEGY_SIGNAL_QUANTITY`
