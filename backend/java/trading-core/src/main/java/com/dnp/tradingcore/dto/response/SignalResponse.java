package com.dnp.tradingcore.dto.response;

import com.dnp.tradingcore.domain.OrderSide;

import java.math.BigDecimal;
import java.time.Instant;

public record SignalResponse(
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal price,
        String reason,
        Instant timestamp
) {
}
