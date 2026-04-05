
<p align="center">
  <img src="frontend/public/Logo.png" alt="Logo" width="250"/>
</p>

<h1 align="center">DNP project</h1>

<h2 align="center">Состав команды</h2>

- **Эрнест** — Java Backend  
- **Никита** — Golang Backend  
- **Захар** — Golang Backend  

- **Ислам** — Frontend / Design  

- **Амина** — DevOps / Infrastructure  
- **Аня** — TBD  

- **Катя** — Презентация  
- **Маша** — TBD  

---

<h2 align="center">Backend</h2>

- **Java**  
  Core-сервисы системы:
  - управление портфелем  
  - ордера  
  - бизнес-логика  
  - риск (в дальнейшем)

- **Golang**  
  Распределённые сервисы:
  - market data (подача рыночных данных)  
  - execution simulator (симуляция исполнения ордеров)  

---

<h2 align="center">Frontend</h2>

- Dashboard для отображения состояния системы:
  - market data  
  - сигналы  
  - ордера  
  - исполнения  
  - портфель  

---

<h2 align="center">Взаимодействие сервисов</h2>

- **Apache Kafka** — основная шина событий  
  Используется для передачи:
  - market data  
  - сигналов  
  - ордеров  
  - результатов исполнения  

- **REST API / WebSocket** — взаимодействие frontend ↔ backend  
  *(точный протокол будет определён позже)*

---

<h2 align="center">Хранение данных</h2>

- **PostgreSQL**  
  Хранение:
  - ордеров  
  - позиций  
  - PnL  
  - состояния системы  

- **Redis (опционально)**  
  Кэширование и быстрый доступ к данным  

---

<h2 align="center">Инфраструктура</h2>

- **Docker / Docker Compose** — локальный запуск системы  
- **Kubernetes (опционально)** — масштабирование и оркестрация  

---

<h2 align="center">Наблюдаемость и логирование</h2>

- **Prometheus** — сбор метрик  
- **Grafana** — визуализация  
- централизованное логирование — аудит и анализ  

---