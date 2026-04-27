package com.dnp.tradingcore.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record MarketHistoryPointResponse(
        BigDecimal price,
        Instant timestamp
) {
}
