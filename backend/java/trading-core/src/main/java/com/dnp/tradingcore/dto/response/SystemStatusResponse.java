package com.dnp.tradingcore.dto.response;

import java.time.Instant;
import java.util.List;

public record SystemStatusResponse(
        String status,
        List<SystemServiceResponse> services,
        Instant timestamp
) {
}
