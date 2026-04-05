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
  - из CSV-файла или mock-источника;
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
- принимать ордера на покупку/продажу;
- реализовать простую симуляцию исполнения:
  - ордер считается успешно исполненным;
- формировать результат исполнения (`execution-result`);
- публиковать результат обратно в Kafka;
- логировать входящие ордера и результаты.

Что должен делать сервис:
1. читать order из Kafka;
2. создавать execution result;
3. отправлять execution result в Kafka.

Минимальный результат:
- сервис принимает ордера;
- возвращает simulated execution result;
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
- timestamp

### Execution result (`execution-result`)
- executionId
- orderId
- symbol
- side
- quantity
- executedPrice
- status
- timestamp

---

## Общий поток данных
market-data-service → Kafka → strategy-service → Kafka → trading-core → Kafka → execution-sim-service → Kafka → trading-core


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
- отправляет `execution-result`.