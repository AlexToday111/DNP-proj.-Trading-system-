package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.DashboardResponse;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class DashboardController {
    private final TradingQueryService queryService;

    public DashboardController(TradingQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return queryService.dashboard();
    }
}
