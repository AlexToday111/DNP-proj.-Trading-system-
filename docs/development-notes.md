<h1 align="center">Development Notes</h1>

## Current MVP Assumptions

- Java `trading-core` is the only backend service that the frontend should call.
- Kafka is the event bus for backend service communication.
- PostgreSQL is the persistent store for state owned by Java `trading-core`.
- `execution-sim-service` may keep latest market prices in local memory for MVP.
- Polling `/api/v1/dashboard` is acceptable until SSE or WebSocket is implemented.
- `strategy-service` is responsible for publishing signals. If its implementation is incomplete, document assumptions instead of changing unrelated services.

## Known TODOs

- Add active health checks for Kafka, PostgreSQL, Go services, and strategy service.
- Add broader integration tests for Kafka and PostgreSQL.
- Decide whether Redis is needed for shared cache use cases.
- Add SSE or WebSocket only after the REST contract is stable.
- Ensure all services agree on event contract field names before demo.

## Contributor Rules

- Keep the frontend/backend boundary strict.
- Do not make the frontend call Go services directly.
- Do not make the frontend consume Kafka directly.
- Do not make the frontend query PostgreSQL directly.
- Keep Java `trading-core` as the frontend-facing backend entry point.
- Keep Kafka topic names consistent across services.
- Document cross-service mismatches as TODOs before changing another team's service.

## What Not to Change Accidentally

For documentation-only tasks, do not change source or config files:

```text
*.java
*.go
*.js
*.ts
*.tsx
*.jsx
*.py
*.sql
Dockerfile
docker-compose.yml
pom.xml
build.gradle
package.json
go.mod
go.sum
application.yml
application.properties
```

This documentation update does not require source code changes.

## Commit Message Format

Use Conventional Commits.

Examples:

```text
docs(root): update Porta project overview
docs(architecture): add system architecture documentation
docs(api): add frontend api contract
docs(kafka): document kafka topics and event flow
docs(demo): add demo flow and development notes
```

## Documentation Style

- Use English only.
- Keep root README concise.
- Put detailed explanations in `docs/`.
- Use tables for responsibilities and topic summaries.
- Use JSON examples for event contracts.
- Use Mermaid diagrams for architecture and flow.
