package models

type MarketData struct {
	EventId   string  `json:"eventId"`
	Symbol    string  `json:"symbol"`
	Price     float64 `json:"price"`
	Volume    float64 `json:"volume"`
	Timestamp string  `json:"timestamp"`
}

type Order struct {
	OrderId   string  `json:"orderId"`
	Symbol    string  `json:"symbol"`
	Side      string  `json:"side"`
	Quantity  float64 `json:"quantity"`
	Timestamp string  `json:"timestamp"`
}

type ExecutionResult struct {
	ExecutionId   string  `json:"executionId"`
	OrderId       string  `json:"orderId"`
	Symbol        string  `json:"symbol"`
	Side          string  `json:"side"`
	Quantity      float64 `json:"quantity"`
	ExecutedPrice float64 `json:"executedPrice"`
	Status        bool    `json:"status"`
	Timestamp     string  `json:"timestamp"`
}
