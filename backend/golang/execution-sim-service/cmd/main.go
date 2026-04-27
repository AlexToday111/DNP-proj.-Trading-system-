package main

import (
	"context"
	"execution-sim-service/internal/config"
	"execution-sim-service/internal/kafka/consumer"
	"execution-sim-service/internal/kafka/producer"
	"execution-sim-service/internal/service"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("[FATAL] Invalid config: %v", err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	publisher := producer.NewExecutionResultPublisher(*cfg)
	simOrderSvc := service.NewSimulateOrder(publisher, cfg.MarketDataExpiration, ctx)

	mdConsumer := consumer.NewMarketDataConsumer(*cfg, simOrderSvc)
	orderConsumer := consumer.NewOrdersConsumer(*cfg, simOrderSvc)

	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		mdConsumer.Consume(ctx)
	}()
	go func() {
		defer wg.Done()
		orderConsumer.Consume(ctx)
	}()

	<-ctx.Done()
	log.Println("[INFO] Shutting down execution-sim-service...")
	wg.Wait()

	if err := publisher.Close(); err != nil {
		log.Printf("[ERROR] Failed to close publisher: %v", err)
	}
	log.Println("[INFO] Shutdown complete")
}
