package csvfeed

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"

	"market-data-service/internal/models"
)

const timestampLayout = time.RFC3339

func ReadFile(path string) ([]models.MarketData, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("open csv file: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.TrimLeadingSpace = true

	header, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("read csv header: %w", err)
	}

	indexes, err := headerIndexes(header)
	if err != nil {
		return nil, err
	}

	var events []models.MarketData
	line := 1
	for {
		line++
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read csv line %d: %w", line, err)
		}

		event, err := parseRecord(record, indexes)
		if err != nil {
			return nil, fmt.Errorf("parse csv line %d: %w", line, err)
		}
		events = append(events, event)
	}

	if len(events) == 0 {
		return nil, fmt.Errorf("csv file %s does not contain market data rows", path)
	}

	return events, nil
}

type columnIndexes struct {
	eventID   int
	symbol    int
	price     int
	volume    int
	timestamp int
}

func headerIndexes(header []string) (columnIndexes, error) {
	indexMap := map[string]int{}
	for i, column := range header {
		indexMap[strings.TrimSpace(strings.ToLower(column))] = i
	}

	required := []string{"eventid", "symbol", "price", "volume", "timestamp"}
	for _, column := range required {
		if _, ok := indexMap[column]; !ok {
			return columnIndexes{}, fmt.Errorf("missing required csv column %q", column)
		}
	}

	return columnIndexes{
		eventID:   indexMap["eventid"],
		symbol:    indexMap["symbol"],
		price:     indexMap["price"],
		volume:    indexMap["volume"],
		timestamp: indexMap["timestamp"],
	}, nil
}

func parseRecord(record []string, indexes columnIndexes) (models.MarketData, error) {
	price, err := strconv.ParseFloat(record[indexes.price], 64)
	if err != nil {
		return models.MarketData{}, fmt.Errorf("invalid price %q: %w", record[indexes.price], err)
	}

	volume, err := strconv.ParseFloat(record[indexes.volume], 64)
	if err != nil {
		return models.MarketData{}, fmt.Errorf("invalid volume %q: %w", record[indexes.volume], err)
	}

	timestamp, err := time.Parse(timestampLayout, record[indexes.timestamp])
	if err != nil {
		return models.MarketData{}, fmt.Errorf("invalid timestamp %q: %w", record[indexes.timestamp], err)
	}

	return models.MarketData{
		EventID:   record[indexes.eventID],
		Symbol:    record[indexes.symbol],
		Price:     price,
		Volume:    volume,
		Timestamp: timestamp.UTC(),
	}, nil
}
