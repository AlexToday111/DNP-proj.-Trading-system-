## Задачи backend-команды

### Эрнест — Java backend (Ядро)

Отвечает за реализацию центрального backend-сервиса системы, который управляет торговой логикой и состоянием портфеля.

Основные задачи:
- реализовать сервис `trading-core` на Java;
- подключить Kafka (producer + consumer);
- подключить PostgreSQL;
- описать доменные сущности:
  - Signal,
  - Order,
  - ExecutionResult,
  - Portfolio,
  - Position;
- реализовать обработку входящих сигналов;
- на основе сигнала создавать ордер (BUY / SELL);
- отправлять ордера в Kafka (`orders`);
- принимать результаты исполнения (`execution-result`);
- обновлять состояние портфеля:
  - баланс,
  - позиции,
  - PnL;
- сохранять состояние в базе данных;
- обеспечить базовый end-to-end flow:
  `signal → order → execution-result → portfolio update`.

---

### Никита — Golang backend / market-data-service

Отвечает за сервис подачи рыночных данных в систему.

Основные задачи:
- реализовать сервис `market-data-service` на Go;
- читать рыночные данные:
  - из CSV-файла, mock-источника или внешнего источника;
- преобразовывать данные в единый формат события;
- публиковать события в Kafka (`market-data`);
- реализовать последовательную подачу данных (replay);
- логировать отправляемые события.

Что должен делать сервис:
1. читать строку из CSV;
2. преобразовывать её в сообщение (JSON);
3. отправлять сообщение в Kafka;
4. повторять для всех данных.

Минимальный результат:
- сервис читает файл и отправляет market data в Kafka;
- другие сервисы могут получать эти данные.

---

### Захар — Golang backend / execution-sim-service

Отвечает за симуляцию исполнения ордеров (эмуляция биржи).

Основные задачи:
- реализовать сервис `execution-sim-service` на Go;
- подписаться на Kafka topic `orders`;
- подписаться на Kafka topic `market-data`;
- поддерживать latest price cache по каждому `symbol`;
- принимать ордера на покупку/продажу;
- при получении order брать последнюю цену из cache;
- реализовать простую симуляцию исполнения:
  - ордер исполняется по последней известной рыночной цене;
- формировать результат исполнения (`execution-result`);
- публиковать результат обратно в Kafka;
- если market data для `symbol` отсутствует или устарела, возвращать статус `REJECTED` / `NO_MARKET_DATA`;
- логировать входящие market data, ордера и результаты.

Что должен делать сервис:
1. читать market data из Kafka topic `market-data`;
2. обновлять latest price cache по `symbol`;
3. читать order из Kafka topic `orders`;
4. находить актуальную цену для `order.symbol`;
5. создавать execution result с `executedPrice`;
6. отправлять execution result в Kafka topic `execution-result`.

Для MVP cache может быть in-memory map внутри `execution-sim-service`.
Redis можно оставить как optional улучшение, если будет нужно несколько инстансов сервиса или общий доступ к latest prices.

Важно: `execution-sim-service` не должен сам ходить во внешний источник market data.
Источник рыночных данных внутри системы один — `market-data-service`.

Минимальный результат:
- сервис принимает ордера;
- возвращает simulated execution result с `executedPrice`;
- `trading-core` может обработать результат.

---

## Общая задача backend-команды

Необходимо согласовать единые контракты событий.

Минимально должны быть определены следующие события:

### Market data (`market-data`)
- eventId
- symbol
- price
- volume
- timestamp

### Order (`orders`)
- orderId
- symbol
- side (BUY / SELL)
- quantity
- orderType
- limitPrice
- timestamp

Для MVP все ордера можно считать `MARKET` orders, а `limitPrice` может быть `null`.

### Execution result (`execution-result`)
- executionId
- orderId
- symbol
- side
- quantity
- executedPrice
- status
- timestamp
- marketDataEventId
- priceTimestamp

`marketDataEventId` и `priceTimestamp` нужны, чтобы было понятно, по какому market data event был исполнен ордер и насколько свежей была цена.

---

## Общий поток данных

```text
market-data-service
  → Kafka topic `market-data`
    → strategy-service
    → execution-sim-service

strategy-service
  → Kafka topic `signals`
  → trading-core

trading-core
  → Kafka topic `orders`
  → execution-sim-service

execution-sim-service
  → Kafka topic `execution-result`
  → trading-core

trading-core
  → PostgreSQL
```

Важно про Kafka consumer groups:
`strategy-service` и `execution-sim-service` должны читать `market-data` в разных consumer groups, чтобы оба сервиса получали все события market data независимо друг от друга.


---

## Ожидаемый результат к концу первой недели

**Эрнест:**
- `trading-core` запущен;
- обрабатывает `signal`;
- создаёт `order`;
- обрабатывает `execution-result`;
- обновляет портфель.

**Никита:**
- `market-data-service` запущен;
- читает CSV;
- отправляет `market-data` в Kafka.

**Захар:**
- `execution-sim-service` запущен;
- читает `orders`;
- читает `market-data`;
- обновляет latest price cache;
- отправляет `execution-result`.
