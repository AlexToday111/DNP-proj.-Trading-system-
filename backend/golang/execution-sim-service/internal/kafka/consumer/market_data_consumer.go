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

type MarketDataConsumer struct {
	kafkaReader *kafka.Reader
	service     interfaces.SimulateOrderInterface
}

func NewMarketDataConsumer(cfg config.Config, srv interfaces.SimulateOrderInterface) *MarketDataConsumer {
	return &MarketDataConsumer{
		kafkaReader: kafka.NewReader(kafka.ReaderConfig{
			Brokers: cfg.KafkaBrokers,
			Topic:   cfg.KafkaTopicMarketData,
			GroupID: cfg.KafkaMarketDataGroupID,
		}),
		service: srv,
	}
}

func (c *MarketDataConsumer) Consume(ctx context.Context) {
	defer func() {
		log.Println("[INFO] Closing kafka reader for market data")
		if err := c.kafkaReader.Close(); err != nil {
			log.Printf("[ERROR] Failed to close market data reader: %v", err)
		}
		log.Println("[INFO] Closed kafka reader for market data")
	}()
	for {
		select {
		case <-ctx.Done():
			log.Println("[INFO] Market data consumer context cancelled")
			return
		default:
		}
		readCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		msg, err := c.kafkaReader.FetchMessage(readCtx)
		cancel()
		if err != nil {
			if errors.Is(err, context.DeadlineExceeded) {
				continue
			}
			time.Sleep(1 * time.Second)
			log.Printf("[ERROR] Error reading market data: %v", err)
			continue
		}

		var md models.MarketData
		if err := json.Unmarshal(msg.Value, &md); err != nil {
			log.Printf("[ERROR] Unmarshal market data error: %v", err)
			if commitErr := c.kafkaReader.CommitMessages(ctx, msg); commitErr != nil {
				log.Printf("[ERROR] Failed to commit broken market data message: %v", commitErr)
			}
			continue
		}

		const maxRetries = 3
		var processErr error
		for attempt := 0; attempt < maxRetries; attempt++ {
			processErr = c.service.ProcessMarketData(md)
			if processErr == nil {
				break
			}
			log.Printf("[ERROR] Attempt %d/%d failed for market data %s: %v",
				attempt+1, maxRetries, md.Symbol, processErr)
			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Duration(attempt+1) * 100 * time.Millisecond):
			}
		}

		if processErr != nil {
			log.Printf("[CRITICAL] All retries exhausted for market data %s, skipping", md.Symbol)
			if commitErr := c.kafkaReader.CommitMessages(ctx, msg); commitErr != nil {
				log.Printf("[ERROR] Failed to commit after skip: %v", commitErr)
			}
			continue
		}

		if err := c.kafkaReader.CommitMessages(ctx, msg); err != nil {
			log.Printf("[ERROR] Failed to commit message at market data consumer: %v", err)
		}
	}
}
