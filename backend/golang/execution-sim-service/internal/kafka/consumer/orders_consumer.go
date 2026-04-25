package consumer

import (
	"context"
	"encoding/json"
	"errors"
	"execution-sim-service/internal/config"
	"execution-sim-service/internal/interfaces"
	"execution-sim-service/internal/models"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

type OrderConsumer struct {
	kafkaReader *kafka.Reader
	svc         interfaces.SimulateOrderInterface
}

func NewOrdersConsumer(cfg config.Config, srv interfaces.SimulateOrderInterface) *OrderConsumer {
	return &OrderConsumer{
		kafkaReader: kafka.NewReader(kafka.ReaderConfig{
			Brokers: cfg.KafkaBrokers,
			GroupID: cfg.KafkaOrdersGroupID,
			Topic:   cfg.KafkaTopicOrders,
		}),
		svc: srv,
	}
}

func (c *OrderConsumer) Consume(ctx context.Context) {
	defer func() {
		log.Println("[INFO] Closing kafka reader for orders")
		if err := c.kafkaReader.Close(); err != nil {
			log.Printf("[ERROR] Failed to close orders reader: %v", err)
		}
		log.Println("[INFO] Closed kafka reader for orders")
	}()
	for {
		select {
		case <-ctx.Done():
			log.Println("[INFO] Orders consumer context cancelled")
			return
		default:
			readCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
			msg, err := c.kafkaReader.FetchMessage(readCtx)
			cancel()
			if err != nil {
				if errors.Is(err, context.DeadlineExceeded) {
					continue
				}
				time.Sleep(1 * time.Second)
				log.Printf("[ERROR] Error reading orders: %v", err)
				continue
			}
			var order models.Order
			if err := json.Unmarshal(msg.Value, &order); err != nil {
				log.Printf("[ERROR] Error unmarshalling order: %v", err)
				if commitErr := c.kafkaReader.CommitMessages(ctx, msg); commitErr != nil {
					log.Printf("[ERROR] Failed to commit broken message: %v", commitErr)
				}
				continue
			}

			const maxRetries = 3
			var processErr error
			for attempt := 0; attempt < maxRetries; attempt++ {
				processErr = c.svc.ProcessOrder(ctx, order)
				if processErr == nil {
					break
				}
				log.Printf("[ERROR] Attempt %d/%d failed for order %s: %v",
					attempt+1, maxRetries, order.OrderId, processErr)
				select {
				case <-ctx.Done():
					return
				case <-time.After(time.Duration(attempt+1) * 100 * time.Millisecond):
				}
			}

			if processErr != nil {
				log.Printf("[CRITICAL] All retries exhausted for order %s, skipping", order.OrderId)

				if commitErr := c.kafkaReader.CommitMessages(ctx, msg); commitErr != nil {
					log.Printf("[ERROR] Failed to commit after skip: %v", commitErr)
				}
				continue
			}

			if err := c.kafkaReader.CommitMessages(ctx, msg); err != nil {
				log.Printf("[ERROR] Failed to commit message at orders consumer: %v", err)
			}
		}
	}
}
