package models

type MarketData struct {
	EventId   string `json:"eventId"`
	Symbol    string `json:"symbol"`
	Price     string `json:"price"`
	Volume    string `json:"volume"`
	Timestamp string `json:"timestamp"`
}

type Order struct {
	OrderId   string `json:"orderId"`
	Symbol    string `json:"symbol"`
	Side      string `json:"side"`
	Quantity  string `json:"quantity"`
	Timestamp string `json:"timestamp"`
}

type ExecutionResult struct {
	ExecutionId   string `json:"executionId"`
	OrderId       string `json:"orderId"`
	Symbol        string `json:"symbol"`
	Side          string `json:"side"`
	Quantity      string `json:"quantity"`
	ExecutedPrice string `json:"executedPrice"`
	Status        string `json:"status"`
	Timestamp     string `json:"timestamp"`
}
