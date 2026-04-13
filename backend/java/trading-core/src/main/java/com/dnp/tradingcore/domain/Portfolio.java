package com.dnp.tradingcore.domain;

import java.math.BigDecimal;
import java.util.List;

public record Portfolio(
        BigDecimal cashBalance,
        BigDecimal realizedPnl,
        List<Position> positions
) {
}
