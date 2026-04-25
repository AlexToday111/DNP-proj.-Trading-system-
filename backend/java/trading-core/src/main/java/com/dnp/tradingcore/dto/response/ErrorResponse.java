package com.dnp.tradingcore.dto.response;

import java.time.Instant;

public record ErrorResponse(
        ErrorBody error
) {
    public record ErrorBody(
            String code,
            String message,
            Instant timestamp
    ) {
    }
}
