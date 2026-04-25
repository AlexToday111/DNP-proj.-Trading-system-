package interfaces

import (
	"context"
	"execution-sim-service/internal/models"
)

type SimulateOrderInterface interface {
	ProcessMarketData(data models.MarketData) error
	ProcessOrder(ctx context.Context, order models.Order) error
}

type ExecutionResultPublisherInterface interface {
	PublishExecutionResult(ctx context.Context, result models.ExecutionResult) error
	Close() error
}
