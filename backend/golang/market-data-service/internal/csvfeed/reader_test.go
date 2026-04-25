package csvfeed

import (
	"path/filepath"
	"testing"

	"market-data-service/internal/models"
)

func TestReadFile(t *testing.T) {
	t.Parallel()

	path := filepath.Join("..", "..", "testdata", "market_data.csv")
	events, err := ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile returned error: %v", err)
	}

	if len(events) != 3 {
		t.Fatalf("expected 3 events, got %d", len(events))
	}

	expected := models.MarketData{
		EventID: "md-1",
		Symbol:  "AAPL",
		Price:   189.42,
		Volume:  1200,
	}

	if events[0].EventID != expected.EventID || events[0].Symbol != expected.Symbol {
		t.Fatalf("unexpected first event: %+v", events[0])
	}

	if events[0].Price != expected.Price || events[0].Volume != expected.Volume {
		t.Fatalf("unexpected numeric values: %+v", events[0])
	}
}
