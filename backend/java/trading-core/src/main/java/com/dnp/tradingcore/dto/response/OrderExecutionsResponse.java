package com.dnp.tradingcore.dto.response;

import java.util.List;

public record OrderExecutionsResponse(
        String orderId,
        List<ExecutionResultResponse> items
) {
}
