package com.dnp.tradingcore.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Signal(
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        BigDecimal targetPrice,
        String reason,
        Instant timestamp
) {
}
