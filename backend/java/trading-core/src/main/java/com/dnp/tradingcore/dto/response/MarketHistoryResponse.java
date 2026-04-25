package com.dnp.tradingcore.dto.response;

import java.util.List;

public record MarketHistoryResponse(
        String symbol,
        List<MarketHistoryPointResponse> items
) {
}
