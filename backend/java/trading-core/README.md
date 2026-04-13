# trading-core (Ernest / Java backend)

Сервис отвечает за основной поток:
`signal -> order -> execution-result -> portfolio update`.

## Что реализовано
- Spring Boot сервис `trading-core`.
- Kafka consumer для `signal`.
- Создание и публикация `order` в topic `orders`.
- Kafka consumer для `execution-result`.
- Обновление портфеля (баланс, позиции, realized PnL).
- Сохранение в PostgreSQL через Spring Data JPA.

## Темы Kafka
- `signal`
- `orders`
- `execution-result`

## Быстрый запуск
```bash
cd backend/java/trading-core
mvn spring-boot:run
```

## Настройки через env
- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_CONSUMER_GROUP`
- `KAFKA_SIGNALS_TOPIC`
- `KAFKA_ORDERS_TOPIC`
- `KAFKA_EXECUTION_RESULTS_TOPIC`
