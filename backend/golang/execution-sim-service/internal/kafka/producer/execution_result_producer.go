package producer

import (
	"context"
	"encoding/json"
	"execution-sim-service/internal/config"
	"execution-sim-service/internal/interfaces"
	"execution-sim-service/internal/models"
	"log"

	"github.com/segmentio/kafka-go"
)

type ExecutionResultPublisher struct {
	writer kafka.Writer
}

func NewExecutionResultPublisher(cfg config.Config) interfaces.ExecutionResultPublisherInterface {
	return &ExecutionResultPublisher{
		writer: kafka.Writer{
			Addr:         kafka.TCP(cfg.KafkaBrokers...),
			Topic:        cfg.KafkaTopicExecutionResult,
			Balancer:     &kafka.LeastBytes{},
			RequiredAcks: kafka.RequireAll,
		},
	}
}

func (p *ExecutionResultPublisher) PublishExecutionResult(ctx context.Context, result models.ExecutionResult) error {
	value, err := json.Marshal(result)
	if err != nil {
		log.Printf("[ERROR] Error marshalling execution result: %v", err)
		return err
	}
	msg := kafka.Message{
		Key:   []byte(result.ExecutionId),
		Value: value,
	}
	return p.writer.WriteMessages(ctx, msg)
}

func (p *ExecutionResultPublisher) Close() error {
	return p.writer.Close()
}
