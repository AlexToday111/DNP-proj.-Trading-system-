package com.dnp.tradingcore.dto.response;

import java.util.List;

public record DashboardResponse(
        DashboardSystemStatusResponse systemStatus,
        List<MarketDataResponse> latestMarketData,
        List<SignalResponse> latestSignals,
        List<OrderResponse> latestOrders,
        List<ExecutionResultResponse> latestExecutions,
        PortfolioSnapshotResponse portfolio
) {
}
