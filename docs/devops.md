# Porta — DevOps & Infrastructure

Документация по инфраструктуре, Docker-контейнеризации и CI/CD пайплайну проекта Porta.

---

## Содержание

- [Архитектура инфраструктуры](#архитектура-инфраструктуры)
- [Docker-образы](#docker-образы)
- [Локальная разработка](#локальная-разработка)
- [CI/CD пайплайн](#cicd-пайплайн)
- [Деплой-сервер](#деплой-сервер)
- [Переменные окружения](#переменные-окружения)
- [Мониторинг и диагностика](#мониторинг-и-диагностика)
- [Структура файлов](#структура-файлов)

---

## Архитектура инфраструктуры

```
┌──────────────────────────────────────────────────────────┐
│                    Production Server                      │
│                                                          │
│   :80 ┌───────────┐      ┌──────────────┐               │
│ ──────▸│  Nginx    │─────▸│ trading-core │               │
│        │ (frontend)│ /api │   (Java)     │               │
│        └───────────┘      └──────┬───────┘               │
│                                  │                       │
│                           ┌──────▼───────┐               │
│                           │    Kafka     │               │
│                           └──┬───────┬───┘               │
│                              │       │                   │
│               ┌──────────────▼┐  ┌───▼────────────────┐  │
│               │ market-data   │  │ execution-sim      │  │
│               │ service (Go)  │  │ service (Go)       │  │
│               └───────────────┘  └────────────────────┘  │
│                                                          │
│              ┌────────────┐  ┌───────────┐               │
│              │ PostgreSQL │  │ Zookeeper │               │
│              └────────────┘  └───────────┘               │
└──────────────────────────────────────────────────────────┘
```

Единственный открытый порт — **80** (nginx/frontend). Все остальные сервисы общаются внутри Docker-сети.

---

## Docker-образы

Все образы используют multi-stage сборку для минимального размера.

| Сервис | Dockerfile | Base (build) | Base (runtime) | Порт |
|--------|-----------|-------------|----------------|------|
| Frontend | `frontend/Dockerfile` | `node:20-alpine` | `nginx:1.27-alpine` | 80 |
| Trading Core | `backend/java/trading-core/Dockerfile` | `maven:3.9-eclipse-temurin-17` | `eclipse-temurin:17-jre-alpine` | 8080 |
| Market Data | `backend/golang/market-data-service/Dockerfile` | `golang:1.26-alpine` | `alpine:3.20` | — |
| Execution Sim | `backend/golang/execution-sim-service/Dockerfile` | `golang:1.26-alpine` | `alpine:3.20` | — |

Образы пушатся в Docker Hub как:
- `<DOCKERHUB_USERNAME>/porta-frontend`
- `<DOCKERHUB_USERNAME>/porta-trading-core`
- `<DOCKERHUB_USERNAME>/porta-market-data`
- `<DOCKERHUB_USERNAME>/porta-execution-sim`

Каждый образ тегируется `:latest` и `:<commit-sha>` для возможности отката.

---

## Локальная разработка

Для запуска всего стека локально используется `docker-compose.yml` (собирает образы из исходников):

```bash
docker compose up --build
```

После запуска:
- Frontend: http://localhost:3000
- Trading Core API: http://localhost:8080
- Kafka: `localhost:9092`
- PostgreSQL: `localhost:5432`

Остановка:

```bash
docker compose down
```

Полная очистка (включая данные БД):

```bash
docker compose down -v
```

---

## CI/CD пайплайн

Пайплайн описан в `.github/workflows/ci-cd.yml`.

### Триггеры

- **Pull Request → main** — только сборка и тесты (без пуша образов и деплоя)
- **Push в main** — сборка, тесты, пуш образов в Docker Hub, деплой на сервер

### Схема пайплайна

```
push to main
    │
    ├──▸ Frontend         (npm ci → typecheck → build → docker push)
    ├──▸ Trading Core     (mvn verify → docker push)
    ├──▸ Market Data      (go build → go test → docker push)
    ├──▸ Execution Sim    (go build → go test → docker push)
    │
    └──▸ Deploy           (все 4 job'а прошли → SSH → docker compose pull + up)
```

### GitHub Secrets

| Secret | Описание |
|--------|---------|
| `DOCKERHUB_USERNAME` | Логин Docker Hub |
| `DOCKERHUB_TOKEN` | Access Token Docker Hub (Read & Write) |
| `DEPLOY_HOST` | IP-адрес деплой-сервера |
| `DEPLOY_USER` | SSH-пользователь |
| `DEPLOY_SSH_KEY` | Приватный SSH-ключ (ed25519) |
| `DEPLOY_PORT` | SSH-порт (обычно `22`) |

---

## Деплой-сервер

### Требования

- Ubuntu 22.04+
- Docker Engine 24+ с Docker Compose plugin v2
- Открытые порты: 22 (SSH), 80 (HTTP)

### Первоначальная настройка

```bash
# 1. Установить Docker (если не установлен)
curl -fsSL https://get.docker.com | sh

# 2. Установить Compose plugin (если отсутствует)
sudo apt-get update
sudo apt-get install docker-compose-plugin -y

# 3. Создать рабочую директорию и .env
mkdir -p ~/porta
cat > ~/porta/.env << 'EOF'
POSTGRES_USER=porta_user
POSTGRES_PASSWORD=<сильный_пароль>
EOF
chmod 600 ~/porta/.env

# 4. Сгенерировать SSH-ключ для CI
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/porta_deploy -N ""
cat ~/.ssh/porta_deploy.pub >> ~/.ssh/authorized_keys
# Приватный ключ → GitHub Secret DEPLOY_SSH_KEY
```

### Ручные операции на сервере

```bash
cd ~/porta

# Логи конкретного сервиса
docker compose logs trading-core --tail 50 -f
docker compose logs market-data-service --tail 50 -f
docker compose logs execution-sim-service --tail 50 -f

# Перезапуск одного сервиса
docker compose restart trading-core

# Статус контейнеров
docker compose ps

# Откат на предыдущую версию
export IMAGE_TAG=<предыдущий-commit-sha>
docker compose pull
docker compose up -d
```

---

## Переменные окружения

### На сервере (`~/porta/.env`)

| Переменная | Описание | Дефолт |
|-----------|---------|--------|
| `POSTGRES_USER` | Пользователь БД | `postgres` |
| `POSTGRES_PASSWORD` | Пароль БД | `postgres` |
| `IMAGE_PREFIX` | Префикс образов Docker Hub | Задаётся из CI |
| `IMAGE_TAG` | Тег образа (commit SHA) | Задаётся из CI |

### В Docker Compose (внутренние)

| Переменная | Сервис | Значение |
|-----------|--------|---------|
| `KAFKA_BOOTSTRAP_SERVERS` | trading-core | `kafka:29092` |
| `POSTGRES_URL` | trading-core | `jdbc:postgresql://postgres:5432/trading_core` |
| `KAFKA_BROKERS` | Go-сервисы | `kafka:29092` |
| `MARKET_DATA_CSV_PATH` | market-data-service | `testdata/market_data.csv` |
| `MARKET_DATA_LOOP_REPLAY` | market-data-service | `true` |
| `MARKET_DATA_EXPIRATION_SEC` | execution-sim-service | `60` |
| `VITE_API_BASE_URL` | frontend (build arg) | `http://<SERVER_IP>/api/v1` |

---

## Мониторинг и диагностика

### Проверка здоровья

```bash
# Все контейнеры запущены?
docker compose ps

# Healthcheck PostgreSQL и Kafka
docker inspect porta-postgres-1 --format='{{.State.Health.Status}}'
docker inspect porta-kafka-1 --format='{{.State.Health.Status}}'

# API trading-core отвечает?
curl http://localhost:8080/api/v1/health

# Фронт отдаёт страницу?
curl -I http://localhost
```

## Структура файлов

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml                          # CI/CD пайплайн
├── backend/
│   ├── golang/
│   │   ├── execution-sim-service/
│   │   │   └── Dockerfile
│   │   └── market-data-service/
│   │       └── Dockerfile
│   └── java/
│       └── trading-core/
│           ├── Dockerfile
│           └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf                             # Nginx: SPA routing + API proxy
├── docker-compose.yml                         # Локальная разработка (build)
├── docker-compose.prod.yml                    # Продакшн (image pull)
└── docs/
    └── devops.md                              # ← этот файл
```
