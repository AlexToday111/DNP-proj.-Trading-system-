package com.dnp.tradingcore.dto;

import com.dnp.tradingcore.domain.OrderSide;
import com.fasterxml.jackson.annotation.JsonAlias;

import java.math.BigDecimal;
import java.time.Instant;

public record SignalMessage(
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        @JsonAlias("price")
        BigDecimal targetPrice,
        String reason,
        Instant timestamp
) {
}
