package com.dnp.tradingcore.domain;

import java.math.BigDecimal;

public record Position(
        String symbol,
        BigDecimal quantity,
        BigDecimal averagePrice,
        BigDecimal unrealizedPnl
) {
}
