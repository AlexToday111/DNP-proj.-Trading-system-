# market-data-service

Читает market data из CSV и публикует события в Kafka topic `market-data`.

## Что умеет MVP

- читает market data из CSV;
- валидирует обязательные колонки;
- преобразует строки в JSON-события;
- публикует события в Kafka;
- поддерживает replay interval;
- умеет зациклить replay при необходимости;
- логирует каждую отправку.

## Формат CSV

Обязательные колонки:

- `eventId`
- `symbol`
- `price`
- `volume`
- `timestamp`

Пример:

```csv
eventId,symbol,price,volume,timestamp
md-1,AAPL,189.42,1200,2026-04-25T10:00:00Z
```

## Формат события

```json
{
  "eventId": "md-1",
  "symbol": "AAPL",
  "price": 189.42,
  "volume": 1200,
  "timestamp": "2026-04-25T10:00:00Z"
}
```

## Переменные окружения

- `KAFKA_BROKERS` - список брокеров через запятую, по умолчанию `localhost:9092`
- `KAFKA_MARKET_DATA_TOPIC` - topic для market data, по умолчанию `market-data`
- `KAFKA_CLIENT_ID` - client id Kafka producer
- `MARKET_DATA_CSV_PATH` - путь до CSV-файла
- `MARKET_DATA_REPLAY_INTERVAL_MS` - задержка между сообщениями
- `MARKET_DATA_LOOP_REPLAY` - повторять ли CSV после завершения
- `MARKET_DATA_SHUTDOWN_TIMEOUT_MS` - timeout на отправку при завершении

## Запуск

```bash
cd backend/golang/market-data-service
cp .env.example .env
go run ./cmd
```

## Проверка

```bash
go test ./...
go build ./...
```
