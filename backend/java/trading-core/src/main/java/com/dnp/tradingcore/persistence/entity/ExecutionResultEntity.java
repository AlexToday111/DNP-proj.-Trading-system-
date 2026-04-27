package com.dnp.tradingcore.persistence.entity;

import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.OrderSide;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "execution_results")
public class ExecutionResultEntity {
    @Id
    private String executionId;
    private String orderId;
    private String symbol;

    @Enumerated(EnumType.STRING)
    private OrderSide side;

    private BigDecimal quantity;
    private BigDecimal executedPrice;

    @Enumerated(EnumType.STRING)
    private ExecutionStatus status;

    private String marketDataEventId;
    private Instant priceTimestamp;
    private Instant timestamp;

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public OrderSide getSide() {
        return side;
    }

    public void setSide(OrderSide side) {
        this.side = side;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getExecutedPrice() {
        return executedPrice;
    }

    public void setExecutedPrice(BigDecimal executedPrice) {
        this.executedPrice = executedPrice;
    }

    public ExecutionStatus getStatus() {
        return status;
    }

    public void setStatus(ExecutionStatus status) {
        this.status = status;
    }

    public String getMarketDataEventId() {
        return marketDataEventId;
    }

    public void setMarketDataEventId(String marketDataEventId) {
        this.marketDataEventId = marketDataEventId;
    }

    public Instant getPriceTimestamp() {
        return priceTimestamp;
    }

    public void setPriceTimestamp(Instant priceTimestamp) {
        this.priceTimestamp = priceTimestamp;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
