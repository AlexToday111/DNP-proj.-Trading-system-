<h1 align="center">Demo Flow</h1>

This document describes a clear demo sequence for presenting Porta.

## Demo Sequence

1. Start services.

   Start local infrastructure and backend services. The expected components are Kafka, PostgreSQL, Java `trading-core`, Java `strategy-service`, Go `market-data-service`, Go `execution-sim-service`, and the frontend dashboard.

2. Start market data replay.

   `market-data-service` reads source market data and publishes events to Kafka topic `market-data`.

3. Market data appears.

   The frontend dashboard shows latest market data by reading Java `trading-core` APIs.

4. Strategy emits a signal.

   Java `strategy-service` consumes `market-data` and publishes a signal to Kafka topic `signals`.

5. Java `trading-core` creates an order.

   Java consumes the signal, creates an order, saves it, and publishes the order to Kafka topic `orders`.

6. Execution simulator fills the order.

   `execution-sim-service` consumes `orders` and `market-data`. It uses its latest price cache to simulate order execution.

7. Java `trading-core` updates portfolio.

   Java consumes `execution-result`, updates order status, updates portfolio cash and positions, and persists state to PostgreSQL.

8. Frontend dashboard shows all updates.

   The dashboard refreshes state from Java `trading-core`.

## Dashboard Should Show

- service status;
- latest market data;
- latest signals;
- latest orders;
- latest execution results;
- portfolio summary;
- open positions;
- optional price chart.

## Presenter Notes

The central message of the demo:

```text
Frontend -> Java trading-core -> Kafka / PostgreSQL / backend services
```

Avoid presenting the frontend as directly connected to Java `strategy-service`, Go services, Kafka, or PostgreSQL.

## MVP Demo Notes

- Polling `/api/v1/dashboard` is acceptable for MVP.
- SSE or WebSocket can be presented as a future real-time improvement.
- If Java `strategy-service` is not running, a demo signal can be simulated according to the `Signal` event contract.
- If external market data is unavailable, CSV replay is enough for a deterministic demo.
