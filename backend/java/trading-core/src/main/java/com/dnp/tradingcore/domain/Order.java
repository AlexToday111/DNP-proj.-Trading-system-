package com.dnp.tradingcore.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Order(
        String orderId,
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        OrderType orderType,
        BigDecimal limitPrice,
        OrderStatus status,
        Instant timestamp
) {
}
