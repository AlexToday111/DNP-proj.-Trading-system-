# ---- build ----
FROM golang:1.26-alpine AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /execution-sim-service ./cmd

# ---- runtime ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app

COPY --from=build /execution-sim-service .

ENTRYPOINT ["./execution-sim-service"]
