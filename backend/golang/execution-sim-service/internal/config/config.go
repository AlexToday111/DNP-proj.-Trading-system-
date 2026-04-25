// config.go (убрана паника, MarketDataExpiration используется как Duration)
package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	KafkaBrokers              []string
	KafkaTopicExecutionResult string
	KafkaTopicMarketData      string
	KafkaTopicOrders          string
	MarketDataExpiration      time.Duration
	KafkaMarketDataGroupID    string
	KafkaOrdersGroupID        string
}

func LoadConfig() (*Config, error) {
	brokers := []string{os.Getenv("KAFKA_BROKERS")}
	if brokers[0] == "" {
		return nil, fmt.Errorf("KAFKA_BROKERS not set")
	}

	expSec, err := strconv.Atoi(os.Getenv("MARKET_DATA_EXPIRATION_SEC"))
	if err != nil {
		return nil, fmt.Errorf("invalid MARKET_DATA_EXPIRATION_SEC: %w", err)
	}
	cfg := Config{
		KafkaBrokers:              brokers,
		KafkaTopicExecutionResult: os.Getenv("KAFKA_EXECUTION_RESULT_TOPIC"),
		KafkaTopicMarketData:      os.Getenv("KAFKA_MARKET_DATA_TOPIC"),
		KafkaTopicOrders:          os.Getenv("KAFKA_ORDERS_TOPIC"),
		MarketDataExpiration:      time.Minute * time.Duration(expSec),
		KafkaMarketDataGroupID:    getEnvOrDefault("KAFKA_MARKET_DATA_TOPIC_GROUP_ID", "market-data-consumer"),
		KafkaOrdersGroupID:        getEnvOrDefault("KAFKA_ORDERS_TOPIC_GROUP_ID", "orders-consumer"),
	}
	return &cfg, nil
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
