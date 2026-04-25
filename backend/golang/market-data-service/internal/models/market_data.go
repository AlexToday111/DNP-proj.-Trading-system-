package models

import "time"

type MarketData struct {
	EventID   string    `json:"eventId"`
	Symbol    string    `json:"symbol"`
	Price     float64   `json:"price"`
	Volume    float64   `json:"volume"`
	Timestamp time.Time `json:"timestamp"`
}
