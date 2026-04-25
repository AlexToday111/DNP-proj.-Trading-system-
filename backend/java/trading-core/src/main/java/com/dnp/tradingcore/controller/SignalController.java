package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.SignalResponse;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/signals")
public class SignalController {
    private final TradingQueryService queryService;

    public SignalController(TradingQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public ApiListResponse<SignalResponse> list(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) OrderSide side,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        return queryService.latestSignals(symbol, side, limit);
    }

    @GetMapping("/{signalId}")
    public SignalResponse get(@PathVariable String signalId) {
        return queryService.signalById(signalId);
    }
}
