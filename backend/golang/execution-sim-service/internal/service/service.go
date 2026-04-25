package service

import (
	"context"
	"execution-sim-service/internal/interfaces"
	"execution-sim-service/internal/models"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
)

type cachedData struct {
	Price     float64
	Volume    float64
	Timestamp time.Time
}

type orderRecord struct {
	Result    models.ExecutionResult
	Timestamp time.Time
}

type SimulateOrder struct {
	mu            sync.RWMutex
	cache         map[string]cachedData
	publisher     interfaces.ExecutionResultPublisherInterface
	orderResults  map[string]orderRecord
	marketDataTTL time.Duration
	cleanupCancel context.CancelFunc
}

func NewSimulateOrder(
	publisher interfaces.ExecutionResultPublisherInterface,
	marketDataTTL time.Duration,
	parentCtx context.Context,
) interfaces.SimulateOrderInterface {
	ctx, cancel := context.WithCancel(parentCtx)
	s := &SimulateOrder{
		cache:         make(map[string]cachedData),
		orderResults:  make(map[string]orderRecord),
		publisher:     publisher,
		marketDataTTL: marketDataTTL,
		cleanupCancel: cancel,
	}
	go s.cleanupProcessedOrders(ctx, 5*time.Minute)
	go s.cleanupCache(ctx)
	return s
}

func (s *SimulateOrder) cleanupProcessedOrders(ctx context.Context, ttl time.Duration) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.mu.Lock()
			now := time.Now()
			for id, rec := range s.orderResults {
				if now.Sub(rec.Timestamp) > ttl {
					delete(s.orderResults, id)
				}
			}
			s.mu.Unlock()
		}
	}
}

func (s *SimulateOrder) cleanupCache(ctx context.Context) {
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.mu.Lock()
			now := time.Now()
			for sym, data := range s.cache {
				if now.Sub(data.Timestamp) > s.marketDataTTL {
					delete(s.cache, sym)
					log.Printf("[INFO] Expired market data: symbol=%s", sym)
				}
			}
			s.mu.Unlock()
		}
	}
}

func (s *SimulateOrder) ProcessMarketData(data models.MarketData) error {
	s.mu.Lock()
	s.cache[data.Symbol] = cachedData{
		Price:     data.Price,
		Volume:    data.Volume,
		Timestamp: time.Now(),
	}
	s.mu.Unlock()

	log.Printf("[INFO] Cache updated: symbol=%s price=%.2f volume=%.2f", data.Symbol, data.Price, data.Volume)
	return nil
}

func (s *SimulateOrder) publishWithRetry(ctx context.Context, result models.ExecutionResult) error {
	const maxAttempts = 3
	var lastErr error
	for attempt := 0; attempt < maxAttempts; attempt++ {
		if attempt > 0 {
			backoff := time.Duration(1<<attempt) * 100 * time.Millisecond
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(backoff):
			}
		}
		err := s.publisher.PublishExecutionResult(ctx, result)
		if err == nil {
			return nil
		}
		lastErr = err
		log.Printf("[WARN] Publish attempt %d/%d failed for order %s: %v", attempt+1, maxAttempts, result.OrderId, err)
	}
	return fmt.Errorf("publish failed after %d attempts: %w", maxAttempts, lastErr)
}

func (s *SimulateOrder) ProcessOrder(ctx context.Context, order models.Order) error {

	s.mu.RLock()
	rec, already := s.orderResults[order.OrderId]
	s.mu.RUnlock()
	if already {
		log.Printf("[INFO] Duplicate order %s: returning cached result, status=%v", order.OrderId, rec.Result.Status)
		return s.publishWithRetry(ctx, rec.Result)
	}

	s.mu.Lock()

	if rec, already := s.orderResults[order.OrderId]; already {
		s.mu.Unlock()
		log.Printf("[INFO] Duplicate order %s (caught inside lock): returning cached result", order.OrderId)
		return s.publishWithRetry(ctx, rec.Result)
	}

	cached, ok := s.cache[order.Symbol]
	if !ok {
		result := models.ExecutionResult{
			ExecutionId:   uuid.New().String(),
			OrderId:       order.OrderId,
			Symbol:        order.Symbol,
			Side:          order.Side,
			Quantity:      order.Quantity,
			ExecutedPrice: 0,
			Status:        false,
			Timestamp:     time.Now().UTC().Format(time.RFC3339),
		}
		s.orderResults[order.OrderId] = orderRecord{Result: result, Timestamp: time.Now()}
		s.mu.Unlock()
		if err := s.publishWithRetry(ctx, result); err != nil {
			log.Printf("[ERROR] Failed to publish after retries: %v", err)
			return fmt.Errorf("publish failed: %w", err)
		}
		log.Printf("[INFO] Order rejected (symbol not found): %s for %s", order.OrderId, order.Symbol)
		return nil
	}

	var status bool
	switch order.Side {
	case "sell":
		cached.Volume += order.Quantity
		s.cache[order.Symbol] = cached
		status = true
	case "buy":
		if cached.Volume < order.Quantity {
			status = false
		} else {
			cached.Volume -= order.Quantity
			s.cache[order.Symbol] = cached
			status = true
		}
	default:
		s.mu.Unlock()
		return fmt.Errorf("invalid side: %q", order.Side)
	}

	result := models.ExecutionResult{
		ExecutionId:   uuid.New().String(),
		OrderId:       order.OrderId,
		Symbol:        order.Symbol,
		Side:          order.Side,
		Quantity:      order.Quantity,
		ExecutedPrice: cached.Price,
		Status:        status,
		Timestamp:     time.Now().UTC().Format(time.RFC3339),
	}
	s.orderResults[order.OrderId] = orderRecord{Result: result, Timestamp: time.Now()}
	s.mu.Unlock()

	if err := s.publishWithRetry(ctx, result); err != nil {
		log.Printf("[ERROR] Failed to publish execution result for order %s: %v", order.OrderId, err)
		return fmt.Errorf("publish failed: %w", err)
	}
	if status {
		log.Printf("[INFO] Order executed: %s %s %.2f %.2f", order.Symbol, order.Side, order.Quantity, cached.Price)
	} else {
		log.Printf("[WARN] Order rejected (insufficient volume): %s %s need %.2f have %.2f",
			order.OrderId, order.Symbol, order.Quantity, cached.Volume)
	}
	return nil
}
