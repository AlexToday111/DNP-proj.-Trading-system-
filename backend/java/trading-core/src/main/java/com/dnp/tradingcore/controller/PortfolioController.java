package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.PortfolioSnapshotResponse;
import com.dnp.tradingcore.dto.response.PositionResponse;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/portfolio")
public class PortfolioController {
    private final TradingQueryService queryService;

    public PortfolioController(TradingQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public PortfolioSnapshotResponse portfolio() {
        return queryService.portfolio();
    }

    @GetMapping("/positions")
    public ApiListResponse<PositionResponse> positions() {
        return queryService.positions();
    }

    @GetMapping("/positions/{symbol}")
    public PositionResponse position(@PathVariable String symbol) {
        return queryService.positionBySymbol(symbol);
    }
}
