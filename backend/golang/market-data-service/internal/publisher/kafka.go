package publisher

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/segmentio/kafka-go"

	"market-data-service/internal/models"
)

type KafkaPublisher struct {
	writer *kafka.Writer
	topic  string
}

func NewKafkaPublisher(brokers []string, topic, clientID string) *KafkaPublisher {
	return &KafkaPublisher{
		topic: topic,
		writer: &kafka.Writer{
			Addr:         kafka.TCP(brokers...),
			Topic:        topic,
			Balancer:     &kafka.LeastBytes{},
			RequiredAcks: kafka.RequireAll,
			Async:        false,
			Transport: &kafka.Transport{
				ClientID: clientID,
			},
		},
	}
}

func (p *KafkaPublisher) Publish(ctx context.Context, event models.MarketData) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("marshal market data event: %w", err)
	}

	message := kafka.Message{
		Key:   []byte(event.EventID),
		Value: payload,
		Time:  time.Now().UTC(),
	}

	if err := p.writer.WriteMessages(ctx, message); err != nil {
		return fmt.Errorf("publish event %s to topic %s: %w", event.EventID, p.topic, err)
	}

	return nil
}

func (p *KafkaPublisher) Close() error {
	return p.writer.Close()
}
