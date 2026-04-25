package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	KafkaBrokers    []string
	KafkaTopic      string
	CSVPath         string
	ReplayInterval  time.Duration
	LoopReplay      bool
	ClientID        string
	ShutdownTimeout time.Duration
}

func Load() (Config, error) {
	replayMillis, err := intEnv("MARKET_DATA_REPLAY_INTERVAL_MS", 1000)
	if err != nil {
		return Config{}, err
	}

	shutdownMillis, err := intEnv("MARKET_DATA_SHUTDOWN_TIMEOUT_MS", 5000)
	if err != nil {
		return Config{}, err
	}

	brokers := csvEnv("KAFKA_BROKERS", []string{"localhost:9092"})
	csvPath := stringEnv("MARKET_DATA_CSV_PATH", "testdata/market_data.csv")
	if csvPath == "" {
		return Config{}, errors.New("MARKET_DATA_CSV_PATH must not be empty")
	}

	return Config{
		KafkaBrokers:    brokers,
		KafkaTopic:      stringEnv("KAFKA_MARKET_DATA_TOPIC", "market-data"),
		CSVPath:         csvPath,
		ReplayInterval:  time.Duration(replayMillis) * time.Millisecond,
		LoopReplay:      boolEnv("MARKET_DATA_LOOP_REPLAY", false),
		ClientID:        stringEnv("KAFKA_CLIENT_ID", "market-data-service"),
		ShutdownTimeout: time.Duration(shutdownMillis) * time.Millisecond,
	}, nil
}

func stringEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func intEnv(key string, fallback int) (int, error) {
	value := os.Getenv(key)
	if value == "" {
		return fallback, nil
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("%s must be an integer: %w", key, err)
	}

	if parsed < 0 {
		return 0, fmt.Errorf("%s must be >= 0", key)
	}

	return parsed, nil
}

func boolEnv(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}

	return parsed
}

func csvEnv(key string, fallback []string) []string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	var result []string
	current := ""
	for _, r := range value {
		if r == ',' {
			if current != "" {
				result = append(result, current)
				current = ""
			}
			continue
		}
		if r != ' ' && r != '\t' && r != '\n' {
			current += string(r)
		}
	}

	if current != "" {
		result = append(result, current)
	}

	if len(result) == 0 {
		return fallback
	}

	return result
}
