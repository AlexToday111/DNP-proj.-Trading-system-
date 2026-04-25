package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"
	"time"

	"market-data-service/internal/config"
	"market-data-service/internal/csvfeed"
	"market-data-service/internal/models"
	"market-data-service/internal/publisher"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	events, err := csvfeed.ReadFile(cfg.CSVPath)
	if err != nil {
		log.Fatalf("read market data csv: %v", err)
	}

	log.Printf(
		"market-data-service starting: topic=%s brokers=%v csv=%s replayInterval=%s loopReplay=%t events=%d",
		cfg.KafkaTopic,
		cfg.KafkaBrokers,
		cfg.CSVPath,
		cfg.ReplayInterval,
		cfg.LoopReplay,
		len(events),
	)

	pub := publisher.NewKafkaPublisher(cfg.KafkaBrokers, cfg.KafkaTopic, cfg.ClientID)
	defer func() {
		if err := pub.Close(); err != nil {
			log.Printf("close kafka publisher: %v", err)
		}
	}()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if err := replayLoop(ctx, cfg, events, pub); err != nil && err != context.Canceled {
		log.Fatalf("replay market data: %v", err)
	}

	log.Println("market-data-service stopped")
}

func replayLoop(ctx context.Context, cfg config.Config, events []models.MarketData, pub publisherInterface) error {
	for {
		for _, event := range events {
			if err := publishOne(ctx, cfg, event, pub); err != nil {
				return err
			}
		}

		if !cfg.LoopReplay {
			return nil
		}

		log.Println("market-data replay completed, restarting from the beginning")
	}
}

type publisherInterface interface {
	Publish(ctx context.Context, event models.MarketData) error
}

func publishOne(ctx context.Context, cfg config.Config, event models.MarketData, pub publisherInterface) error {
	publishCtx, cancel := context.WithTimeout(ctx, cfg.ShutdownTimeout)
	defer cancel()

	if err := pub.Publish(publishCtx, event); err != nil {
		return err
	}

	log.Printf(
		"published market-data event: eventId=%s symbol=%s price=%.4f volume=%.4f timestamp=%s",
		event.EventID,
		event.Symbol,
		event.Price,
		event.Volume,
		event.Timestamp.Format(time.RFC3339),
	)

	if cfg.ReplayInterval <= 0 {
		return nil
	}

	timer := time.NewTimer(cfg.ReplayInterval)
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}
