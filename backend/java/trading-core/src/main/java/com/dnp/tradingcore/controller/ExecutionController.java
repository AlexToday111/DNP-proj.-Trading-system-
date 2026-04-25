package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.ExecutionResultResponse;
import com.dnp.tradingcore.dto.response.OrderExecutionsResponse;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ExecutionController {
    private final TradingQueryService queryService;

    public ExecutionController(TradingQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/executions")
    public ApiListResponse<ExecutionResultResponse> list(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) ExecutionStatus status,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        return queryService.latestExecutions(symbol, status, limit);
    }

    @GetMapping("/executions/{executionId}")
    public ExecutionResultResponse get(@PathVariable String executionId) {
        return queryService.executionById(executionId);
    }

    @GetMapping("/orders/{orderId}/executions")
    public OrderExecutionsResponse byOrder(@PathVariable String orderId) {
        return queryService.executionsByOrderId(orderId);
    }
}
