package com.dnp.tradingcore.dto.response;

import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.OrderSide;

import java.math.BigDecimal;
import java.time.Instant;

public record ExecutionResultResponse(
        String executionId,
        String orderId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        BigDecimal executedPrice,
        ExecutionStatus status,
        String marketDataEventId,
        Instant priceTimestamp,
        Instant timestamp
) {
}
