package com.dnp.tradingcore.dto;

import com.dnp.tradingcore.domain.OrderSide;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderMessage(
        String orderId,
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        BigDecimal requestedPrice,
        Instant timestamp
) {
}
