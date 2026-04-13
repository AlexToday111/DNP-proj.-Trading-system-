package com.dnp.tradingcore.dto;

import com.dnp.tradingcore.domain.OrderSide;

import java.math.BigDecimal;
import java.time.Instant;

public record SignalMessage(
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        BigDecimal targetPrice,
        Instant timestamp
) {
}
