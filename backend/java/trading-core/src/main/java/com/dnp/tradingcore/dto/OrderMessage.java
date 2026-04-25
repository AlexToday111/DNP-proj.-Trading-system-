package com.dnp.tradingcore.dto;

import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.domain.OrderStatus;
import com.dnp.tradingcore.domain.OrderType;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderMessage(
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
