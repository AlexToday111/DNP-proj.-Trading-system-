<h1 align="center">market-data-service</h1>

`market-data-service` reads market data from CSV and publishes events to Kafka topic `market-data`.

<h2 align="center">MVP Capabilities</h2>

- reads market data from CSV;
- validates required columns;
- converts rows into JSON events;
- publishes events to Kafka;
- supports replay interval configuration;
- can loop replay when configured;
- logs every published event.

<h2 align="center">CSV Format</h2>

Required columns:

- `eventId`
- `symbol`
- `price`
- `volume`
- `timestamp`

Example:

```csv
eventId,symbol,price,volume,timestamp
md-1,AAPL,189.42,1200,2026-04-25T10:00:00Z
```

<h2 align="center">Event Format</h2>

```json
{
  "eventId": "md-1",
  "symbol": "AAPL",
  "price": 189.42,
  "volume": 1200,
  "timestamp": "2026-04-25T10:00:00Z"
}
```

<h2 align="center">Environment Variables</h2>

- `KAFKA_BROKERS` - comma-separated broker list, defaults to `localhost:9092`
- `KAFKA_MARKET_DATA_TOPIC` - market data topic, defaults to `market-data`
- `KAFKA_CLIENT_ID` - client id Kafka producer
- `MARKET_DATA_CSV_PATH` - path to the CSV file
- `MARKET_DATA_REPLAY_INTERVAL_MS` - delay between messages
- `MARKET_DATA_LOOP_REPLAY` - whether to replay the CSV again after reaching the end
- `MARKET_DATA_SHUTDOWN_TIMEOUT_MS` - send timeout during shutdown

<h2 align="center">Run</h2>

```bash
cd backend/golang/market-data-service
cp .env.example .env
go run ./cmd
```

<h2 align="center">Verification</h2>

```bash
go test ./...
go build ./...
```
