package com.dnp.tradingcore.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record PortfolioSnapshotResponse(
        BigDecimal cash,
        BigDecimal totalPositionValue,
        BigDecimal totalPortfolioValue,
        BigDecimal realizedPnl,
        BigDecimal unrealizedPnl,
        BigDecimal totalPnl,
        Instant updatedAt
) {
}
