package com.dnp.tradingcore.dto.response;

import java.time.Instant;

public record OrderCancellationResponse(
        String orderId,
        String status,
        Instant timestamp
) {
}
