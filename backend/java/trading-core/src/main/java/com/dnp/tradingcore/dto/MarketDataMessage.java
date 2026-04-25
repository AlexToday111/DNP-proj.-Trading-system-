package com.dnp.tradingcore.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MarketDataMessage(
        String eventId,
        String symbol,
        BigDecimal price,
        BigDecimal volume,
        Instant timestamp
) {
}
