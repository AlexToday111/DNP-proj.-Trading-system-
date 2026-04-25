## Задачи frontend-разработчика

### Ислам — Frontend / дезигн

Отвечает за пользовательский интерфейс системы и визуальное представление работы платформы.

Основные задачи:
- реализовать frontend-dashboard;
- продумать структуру интерфейса;
- подключить frontend к backend (В идеале);
- отобразить ключевые сущности системы в реальном времени;
- подготовить интерфейс для демо и презентации проекта (Это тоже в идеале).

---

## Frontend

Frontend уже собран как отдельное приложение на `React + TypeScript + Vite`.
Сейчас это dashboard для trading-system с навигацией по страницам, таблицами, карточками метрик, графиком цены и подключением к backend API.

## Что уже есть

Реализованы страницы:
- `Overview`
- `Market Data`
- `Signals`
- `Orders`
- `Executions`
- `Portfolio`
- `System Health`

Что уже работает в интерфейсе:
- основной layout с `TopBar` и `Sidebar`;
- переключение страниц внутри dashboard;
- выбор инструмента (`symbol`) из интерфейса;
- синхронизация текущей страницы и выбранного инструмента через query params;
- загрузка данных с backend;
- отображение ошибки, если backend недоступен;
- стартовые skeleton-состояния при первой загрузке;
- единый visual flow системы: `MarketData → Signal → Order → Execution → Portfolio`.

## Что отображается по страницам

### Overview
- общие метрики портфеля: `Portfolio Value`, `Cash`, `Position Value`, `Total PnL`;
- snapshot последней цепочки `Market data → Signal → Order → Execution`;
- карточка состояния сервисов;
- блок visual flow;
- лента последних событий;
- сводка по данным, пришедшим из `GET /dashboard`.

### Market Data
- количество market events;
- текущий volume;
- изменение цены за сессию;
- график цены по инструменту;
- поиск по `event id` и `symbol`;
- таблица последних рыночных событий.

### Signals
- счётчики всех, `BUY` и `SELL` сигналов;
- карточка последнего сигнала;
- поиск по `signal id`, `symbol`, `reason`;
- фильтр по стороне сигнала;
- таблица сигналов.

### Orders
- количество ордеров;
- число открытых ордеров;
- число исполнений по выбранному инструменту;
- summary-card по ордерам;
- поиск по `order id`, `signal id`, `symbol`, `type`;
- фильтр по статусу;
- таблица ордеров.

### Executions
- количество исполнений;
- средняя цена исполнения;
- статус последнего исполнения;
- карточка latest execution;
- поиск по `execution id`, `order id`, `symbol`, `status`;
- таблица исполнений.

### Portfolio
- метрики по `cash`, `portfolio value`, `position value`, `realized/unrealized/total PnL`;
- количество открытых позиций;
- таблица holdings с позициями портфеля.

### System Health
- количество `healthy`, `degraded`, `down` сервисов;
- карточка health-статусов сервисов;
- visual flow системы;
- activity feed по system/execution/portfolio событиям.

## Подключение к backend

Frontend уже работает не только на mock-структуре интерфейса, а с реальными HTTP-запросами.

Используются endpoints:
- `GET /health`
- `GET /system/status`
- `GET /dashboard`
- `GET /market-data`
- `GET /market-data/:symbol/latest`
- `GET /market-data/:symbol/history`
- `GET /signals`
- `GET /orders`
- `GET /executions`
- `GET /portfolio`
- `GET /portfolio/positions`

По умолчанию base URL:

```text
http://localhost:8080/api/v1
```

Можно переопределить через переменную:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Текущий стек

- `React 18`
- `TypeScript`
- `Vite`
- `Recharts`
- `Tailwind CSS`
- `clsx`
- локальные hooks и UI-компоненты для dashboard

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Дополнительно:

```bash
npm run build
npm run preview
npm run typecheck
```

## Структура данных, с которыми уже работает frontend

Фронтенд уже типизирован под следующие сущности:
- `MarketData`
- `Signal`
- `Order`
- `Execution`
- `PortfolioSnapshot`
- `Position`
- `SystemStatus / ServiceHealth`

Это значит, что основа для интеграции с backend уже есть: страницы, таблицы, карточки и маппинг ответов API собраны.

## Текущее состояние проекта

На текущий момент frontend уже можно использовать как рабочий demo-dashboard:
- приложение запускается локально;
- есть основной dashboard и все ключевые страницы;
- данные запрашиваются у backend API;
- интерфейс показывает состояние сервисов, market data, signals, orders, executions и portfolio;
- архитектура готова к дальнейшему развитию, включая более частые обновления данных и возможное расширение REST/WebSocket-интеграции.
