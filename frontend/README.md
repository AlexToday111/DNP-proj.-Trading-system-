<h1 align="center">Porta Frontend</h1>

The Porta frontend is a React, TypeScript, and Vite dashboard for monitoring the trading-system MVP.

It visualizes the full system flow:

```text
MarketData -> Signal -> Order -> Execution -> Portfolio
```

The frontend is a client of Java `trading-core` only. It must not call Java `strategy-service` or Go services directly, consume Kafka, or query PostgreSQL.

```text
Frontend -> Java trading-core -> Kafka / PostgreSQL / backend services
```

<h2 align="center">Owner</h2>

| Member | Responsibility |
| --- | --- |
| Islam | Frontend / Design |

<h2 align="center">Purpose</h2>

The frontend provides a demo-ready operational dashboard for:

- market data events;
- trading signals;
- orders;
- execution results;
- portfolio state;
- positions;
- service health;
- system activity.

It is designed to show how backend events move through Porta and how the Java core service exposes the current system state to users.

<h2 align="center">Current Application Stack</h2>

- React 18
- TypeScript
- Vite
- Recharts
- Tailwind CSS
- `clsx`
- local hooks and reusable dashboard UI components

<h2 align="center">Pages</h2>

The application currently contains these dashboard pages:

- `Overview`
- `Market Data`
- `Signals`
- `Orders`
- `Executions`
- `Portfolio`
- `System Health`

<h2 align="center">Implemented UI Features</h2>

- Main dashboard shell with `TopBar` and `Sidebar`.
- Page navigation inside the dashboard.
- Symbol selection from the interface.
- URL query parameter synchronization for current page and selected symbol.
- Backend API data loading.
- Error state when the backend is unavailable.
- Initial loading skeletons.
- Shared visual flow for `MarketData -> Signal -> Order -> Execution -> Portfolio`.
- Tables, metrics, summary cards, price chart, and activity feed components.

<h2 align="center">Page Responsibilities</h2>

<h3 align="center">Overview</h3>

Shows the high-level state of the platform:

- portfolio value;
- cash;
- position value;
- total PnL;
- latest `MarketData -> Signal -> Order -> Execution` chain;
- service health summary;
- system flow visualization;
- recent activity feed;
- data summary from `GET /dashboard`.

<h3 align="center">Market Data</h3>

Shows market event state:

- market event count;
- current volume;
- session price move;
- price chart by symbol;
- search by `eventId` and `symbol`;
- latest market data table.

<h3 align="center">Signals</h3>

Shows strategy output:

- total signal count;
- `BUY` and `SELL` counts;
- latest signal card;
- search by `signalId`, `symbol`, and `reason`;
- side filter;
- signals table.

<h3 align="center">Orders</h3>

Shows order state:

- total order count;
- open order count;
- execution count for the selected symbol;
- order summary card;
- search by `orderId`, `signalId`, `symbol`, and order type;
- status filter;
- orders table.

<h3 align="center">Executions</h3>

Shows execution results:

- execution count;
- average execution price;
- latest execution status;
- latest execution card;
- search by `executionId`, `orderId`, `symbol`, and `status`;
- executions table.

<h3 align="center">Portfolio</h3>

Shows portfolio state:

- cash;
- total portfolio value;
- position value;
- realized PnL;
- unrealized PnL;
- total PnL;
- open position count;
- holdings table.

<h3 align="center">System Health</h3>

Shows backend service state:

- healthy service count;
- degraded service count;
- down service count;
- service status cards;
- system flow visualization;
- system, execution, and portfolio activity feed.

<h2 align="center">Backend API Integration</h2>

Default API base URL:

```text
http://localhost:8080/api/v1
```

Override it with:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

The frontend currently expects Java `trading-core` to expose these endpoints:

```http
GET /health
GET /system/status
GET /dashboard
GET /market-data
GET /market-data/:symbol/latest
GET /market-data/:symbol/history
GET /signals
GET /orders
GET /executions
GET /portfolio
GET /portfolio/positions
```

When combined with the default base URL, the real request path is:

```text
http://localhost:8080/api/v1/dashboard
```

<h2 align="center">Data Models</h2>

The frontend is typed around these core entities:

- `MarketData`
- `Signal`
- `Order`
- `Execution`
- `PortfolioSnapshot`
- `Position`
- `SystemStatus`
- `ServiceHealth`

This means the UI is already prepared for backend integration through stable API contracts.

<h2 align="center">Local Development</h2>

Install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run type checking:

```bash
npm run typecheck
```

<h2 align="center">MVP Status</h2>

The frontend is usable as a local demo dashboard:

- it starts as a standalone Vite app;
- it contains all key dashboard pages;
- it requests data from the Java backend API;
- it displays service status, market data, signals, orders, executions, and portfolio state;
- it is ready for more frequent refreshes or future SSE/WebSocket integration.
