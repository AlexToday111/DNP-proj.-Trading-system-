<p align="center">
  <img src="frontend/src/assets/porta-logo.svg" alt="Porta logo" width="250"/>
</p>

<h1 align="center">Porta</h1>

<p align="center">
  Porta is a distributed trading-system MVP with a dashboard, Java backend services, Go data services, Kafka event streaming, and PostgreSQL-backed portfolio state.
</p>

<p align="center">
  The documentation-facing project name is <strong>Porta</strong>.
</p>

---
<h2 align="center">Team</h2>

<div align="center">

<table>
  <tr>
    <th>Development</th>
  </tr>

  <tr>
    <td>
      <table>
        <tr>
          <td><b>Ernest</b><br>Java Backend</td>
          <td><b>Nikita</b><br>Golang Backend</td>
          <td><b>Zakhar</b><br>Golang Backend</td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td>
      <table>
        <tr>
          <td><b>Islam</b><br>Frontend / Design</td>
          <td><b>Amina</b><br>DevOps / Infrastructure</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="3">Other</th>
  </tr>
  <tr>
    <td><b>Anya</b><br>Presentation</td>
    <td><b>Katya</b><br>Presentation</td>
    <td><b>Masha</b><br>Q&amp;A engineer</td>
  </tr>
</table>

</div>

---

<h2 align="center">Architecture Overview</h2>

Porta uses Java `trading-core` as the central core service, orchestrator, and backend-for-frontend.

The frontend boundary is strict:

```text
Frontend -> Java trading-core -> Kafka / PostgreSQL / backend services
```

The frontend must not communicate directly with non-BFF backend services, Kafka, or PostgreSQL:

```text
Frontend -> strategy-service / Go services
Frontend -> Kafka
Frontend -> PostgreSQL
```

Kafka is the main event bus between backend services. Java `strategy-service` consumes market data and publishes trading signals. Java `trading-core` consumes trading signals, creates orders, publishes orders, consumes execution results, updates order and portfolio state, persists state in PostgreSQL, and exposes frontend-facing APIs.

```mermaid
flowchart LR
    FE["Frontend Dashboard"]
    CORE["Java trading-core<br/>Core Service / Orchestrator"]
    KAFKA["Apache Kafka<br/>Event Bus"]
    MD["Go market-data-service"]
    STRATEGY["Java strategy-service"]
    EXEC["Go execution-sim-service"]
    DB[("PostgreSQL")]
    REDIS[("Redis<br/>optional")]
    OBS["Prometheus / Grafana"]

    MD -->|"publish market-data"| KAFKA
    KAFKA -->|"consume market-data"| STRATEGY
    STRATEGY -->|"publish signals"| KAFKA
    KAFKA -->|"consume signals"| CORE
    CORE -->|"publish orders"| KAFKA
    KAFKA -->|"consume orders"| EXEC
    KAFKA -->|"consume market-data"| EXEC
    EXEC -->|"publish execution-result"| KAFKA
    KAFKA -->|"consume execution-result"| CORE
    CORE <-->|"REST / WebSocket / SSE"| FE
    CORE <-->|"read/write state"| DB
    CORE -.->|"optional cache"| REDIS
    OBS -.->|"metrics / dashboards"| CORE
```

---

<h2 align="center">Technology Stack</h2>

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Core backend | Java, Spring Boot, Spring Kafka, Spring Data JPA |
| Strategy backend | Java, Spring Boot, Spring Kafka |
| Data services | Go services for market data and execution simulation |
| Event streaming | Apache Kafka |
| Persistent storage | PostgreSQL |
| Optional cache | Redis |
| Local infrastructure | Docker / Docker Compose |
| Observability | Prometheus, Grafana, structured logs |

---

<h2 align="center">Service Responsibilities</h2>

| Service | Responsibility |
| --- | --- |
| Frontend Dashboard | Displays market data, signals, orders, executions, service status, and portfolio state. It communicates only with Java `trading-core`. |
| Java `trading-core` | Central core service and backend-for-frontend. It exposes REST APIs, consumes signals, creates orders, publishes orders, consumes execution results, updates portfolio state, and persists state. |
| Java `strategy-service` | Consumes market data and publishes MVP trading signals to Kafka topic `signals`. |
| Go `market-data-service` | Publishes market data events to Kafka topic `market-data`. |
| Go `execution-sim-service` | Consumes `orders` and `market-data`, keeps latest prices in a local MVP cache, simulates fills, and publishes `execution-result` events. |
| PostgreSQL | Stores orders, executions, signals, positions, portfolio snapshots, and market data history where needed. |

---

<h2 align="center">Kafka Topics</h2>

| Topic | Producer | Consumers | Purpose |
| --- | --- | --- | --- |
| `market-data` | `market-data-service` | Java `strategy-service`, `execution-sim-service`, optionally `trading-core` | Market price events. |
| `signals` | Java `strategy-service` | `trading-core` | Trading decisions that become orders. |
| `orders` | `trading-core` | `execution-sim-service` | Orders to execute or reject. |
| `execution-result` | `execution-sim-service` | `trading-core` | Execution outcomes used to update orders and portfolio state. |

Java `strategy-service` and `execution-sim-service` must use different Kafka consumer groups for `market-data` so both services receive the full stream.

---

<h2 align="center">Storage</h2>

PostgreSQL is the source of persistent state for the Java core service:

- orders;
- execution results;
- signals;
- market data history, when needed for dashboard and history views;
- positions;
- portfolio state and PnL.

Redis is optional and can be introduced for caching or shared low-latency reads. For the MVP, `execution-sim-service` can keep latest market prices in an in-memory cache.

---

<h2 align="center">Observability and Infrastructure</h2>

- Docker / Docker Compose are intended for local multi-service development.
- Prometheus can collect service metrics.
- Grafana can visualize service health and runtime dashboards.
- Structured logs should make the event flow traceable from market data to portfolio update.

---

<h2 align="center">Detailed Documentation</h2>

More detailed documentation is available in the [`docs/`](./docs) directory:

- [Architecture](./docs/architecture.md)
- [Backend Flow](./docs/backend-flow.md)
- [Frontend API](./docs/frontend-api.md)
- [Kafka Topics](./docs/kafka-topics.md)
- [Event Contracts](./docs/event-contracts.md)
- [Demo Flow](./docs/demo-flow.md)
- [Development Notes](./docs/development-notes.md)

---

<h2 align="center">Demo Flow</h2>

1. Start infrastructure and backend services.
2. Start market data replay from `market-data-service`.
3. Market data is published to Kafka topic `market-data`.
4. Java `strategy-service` emits a signal to topic `signals`.
5. Java `trading-core` consumes the signal, creates an order, saves it, and publishes it to topic `orders`.
6. `execution-sim-service` consumes the order and latest market data, simulates execution, and publishes an `execution-result`.
7. Java `trading-core` updates order status and portfolio state in PostgreSQL.
8. The frontend dashboard reads the updated state from Java `trading-core`.

---

<h2 align="center">MVP Status</h2>

Porta is an MVP-oriented trading-system project. The current target is a clear end-to-end flow:

```text
MarketData -> Signal -> Order -> ExecutionResult -> PortfolioUpdate
```

Some integrations may still be implemented as MVP assumptions or TODOs. Known implementation details and contributor rules are documented in [Development Notes](./docs/development-notes.md).
