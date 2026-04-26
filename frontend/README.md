# Porta Frontend

The Porta frontend is a React, TypeScript, and Vite dashboard for monitoring the trading-system MVP.

It visualizes the full system flow:

```text
MarketData -> Signal -> Order -> Execution -> Portfolio
```

The frontend is a client of Java `trading-core` only. It must not call Java `strategy-service` or Go services directly, consume Kafka, or query PostgreSQL.

```text
Frontend -> Java trading-core -> Kafka / PostgreSQL / backend services
```

## Owner

| Member | Responsibility |
| --- | --- |
| Islam | Frontend / Design |

## Purpose

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

## Current Application Stack

- React 18
- TypeScript
- Vite
- Recharts
- Tailwind CSS
- `clsx`
- local hooks and reusable dashboard UI components

## Pages

The application currently contains these dashboard pages:

- `Overview`
- `Market Data`
- `Signals`
- `Orders`
- `Executions`
- `Portfolio`
- `System Health`

## Implemented UI Features

- Main dashboard shell with `TopBar` and `Sidebar`.
- Page navigation inside the dashboard.
- Symbol selection from the interface.
- URL query parameter synchronization for current page and selected symbol.
- Backend API data loading.
- Error state when the backend is unavailable.
- Initial loading skeletons.
- Shared visual flow for `MarketData -> Signal -> Order -> Execution -> Portfolio`.
- Tables, metrics, summary cards, price chart, and activity feed components.

## Page Responsibilities

### Overview

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

### Market Data

Shows market event state:

- market event count;
- current volume;
- session price move;
- price chart by symbol;
- search by `eventId` and `symbol`;
- latest market data table.

### Signals

Shows strategy output:

- total signal count;
- `BUY` and `SELL` counts;
- latest signal card;
- search by `signalId`, `symbol`, and `reason`;
- side filter;
- signals table.

### Orders

Shows order state:

- total order count;
- open order count;
- execution count for the selected symbol;
- order summary card;
- search by `orderId`, `signalId`, `symbol`, and order type;
- status filter;
- orders table.

### Executions

Shows execution results:

- execution count;
- average execution price;
- latest execution status;
- latest execution card;
- search by `executionId`, `orderId`, `symbol`, and `status`;
- executions table.

### Portfolio

Shows portfolio state:

- cash;
- total portfolio value;
- position value;
- realized PnL;
- unrealized PnL;
- total PnL;
- open position count;
- holdings table.

### System Health

Shows backend service state:

- healthy service count;
- degraded service count;
- down service count;
- service status cards;
- system flow visualization;
- system, execution, and portfolio activity feed.

## Backend API Integration

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

## Data Models

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

## Local Development

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

## MVP Status

The frontend is usable as a local demo dashboard:

- it starts as a standalone Vite app;
- it contains all key dashboard pages;
- it requests data from the Java backend API;
- it displays service status, market data, signals, orders, executions, and portfolio state;
- it is ready for more frequent refreshes or future SSE/WebSocket integration.

## Current Assumptions and TODOs

- Java `trading-core` remains the only backend entry point for the frontend.
- The dashboard can use polling for MVP.
- SSE or WebSocket can be added later for real-time updates.
- If backend services are unavailable, the UI should continue to show clear loading and error states.
- API contract updates should be reflected in the shared project documentation under [`../docs`](../docs).
