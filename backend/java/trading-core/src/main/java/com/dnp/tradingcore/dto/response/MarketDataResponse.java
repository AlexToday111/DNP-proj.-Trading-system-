package com.dnp.tradingcore.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record MarketDataResponse(
        String eventId,
        String symbol,
        BigDecimal price,
        BigDecimal volume,
        Instant timestamp
) {
}
