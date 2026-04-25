package com.dnp.tradingcore.dto.response;

import com.dnp.tradingcore.domain.OrderSide;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderResponse(
        String orderId,
        String signalId,
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        String orderType,
        BigDecimal limitPrice,
        String status,
        Instant timestamp
) {
}
