# strategy-service (Java backend)

`strategy-service` is a simple Java/Spring Kafka service that turns market data into trading signals.

It consumes Kafka topic `market-data` and publishes Kafka topic `signals`.

## MVP Strategy

The current strategy is intentionally small and deterministic:

- first valid market data event for a symbol emits a `BUY`;
- price increase versus the previous event for the same symbol emits a `BUY`;
- price decrease versus the previous event for the same symbol emits a `SELL`;
- unchanged price emits no signal;
- every emitted signal uses fixed quantity `1` unless `STRATEGY_SIGNAL_QUANTITY` is configured.

The service keeps only the latest price per symbol in memory. It does not store state in PostgreSQL and does not call `trading-core` directly.

## Kafka topics

- consumes `market-data`
- produces `signals`

Topic names are configured in `src/main/resources/application.yml`.

## Quick start

```bash
cd backend/java/strategy-service
mvn spring-boot:run
```

## Environment variables

- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_CONSUMER_GROUP`
- `KAFKA_MARKET_DATA_TOPIC`
- `KAFKA_SIGNALS_TOPIC`
- `STRATEGY_SIGNAL_QUANTITY`
