package com.dnp.tradingcore.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record ExecutionResult(
        String executionId,
        String orderId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        BigDecimal executedPrice,
        ExecutionStatus status,
        Instant timestamp
) {
}
