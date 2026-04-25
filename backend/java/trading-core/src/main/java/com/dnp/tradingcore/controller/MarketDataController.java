package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.MarketDataResponse;
import com.dnp.tradingcore.dto.response.MarketHistoryResponse;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/market-data")
public class MarketDataController {
    private final TradingQueryService queryService;

    public MarketDataController(TradingQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public ApiListResponse<MarketDataResponse> list(
            @RequestParam(required = false) String symbol,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        return queryService.latestMarketData(symbol, limit);
    }

    @GetMapping("/{symbol}/latest")
    public MarketDataResponse latest(@PathVariable String symbol) {
        return queryService.latestMarketDataBySymbol(symbol);
    }

    @GetMapping("/{symbol}/history")
    public MarketHistoryResponse history(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return queryService.marketHistory(symbol, limit, from, to);
    }
}
