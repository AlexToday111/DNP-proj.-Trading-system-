package com.dnp.strategyservice.dto;

import com.dnp.strategyservice.domain.OrderSide;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.Instant;

public record SignalMessage(
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        @JsonProperty("price")
        BigDecimal price,
        String reason,
        Instant timestamp
) {
}
