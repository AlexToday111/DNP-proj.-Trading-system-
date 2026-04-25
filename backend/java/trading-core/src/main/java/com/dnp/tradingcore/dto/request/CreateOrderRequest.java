package com.dnp.tradingcore.dto.request;

import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.domain.OrderType;

import java.math.BigDecimal;

public record CreateOrderRequest(
        String symbol,
        OrderSide side,
        BigDecimal quantity,
        OrderType orderType,
        BigDecimal limitPrice
) {
}
