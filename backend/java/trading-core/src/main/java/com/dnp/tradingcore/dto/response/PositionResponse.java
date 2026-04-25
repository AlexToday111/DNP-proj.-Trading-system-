package com.dnp.tradingcore.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record PositionResponse(
        String symbol,
        BigDecimal quantity,
        BigDecimal averageEntryPrice,
        BigDecimal latestPrice,
        BigDecimal marketValue,
        BigDecimal unrealizedPnl,
        Instant updatedAt
) {
}
