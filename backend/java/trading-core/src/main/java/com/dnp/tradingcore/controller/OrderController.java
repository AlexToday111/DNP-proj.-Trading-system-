package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.dto.request.CreateOrderRequest;
import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.OrderCancellationResponse;
import com.dnp.tradingcore.dto.response.OrderResponse;
import com.dnp.tradingcore.mapper.TradingCoreMapper;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.service.TradingCoreService;
import com.dnp.tradingcore.service.TradingQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final TradingQueryService queryService;
    private final TradingCoreService tradingCoreService;
    private final TradingCoreMapper mapper;

    public OrderController(
            TradingQueryService queryService,
            TradingCoreService tradingCoreService,
            TradingCoreMapper mapper
    ) {
        this.queryService = queryService;
        this.tradingCoreService = tradingCoreService;
        this.mapper = mapper;
    }

    @GetMapping
    public ApiListResponse<OrderResponse> list(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) OrderSide side,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        return queryService.latestOrders(symbol, status, side, limit);
    }

    @GetMapping("/{orderId}")
    public OrderResponse get(@PathVariable String orderId) {
        return queryService.orderById(orderId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestBody CreateOrderRequest request) {
        return mapper.toOrderResponse(tradingCoreService.createOrder(request));
    }

    @PostMapping("/{orderId}/cancel")
    public OrderCancellationResponse cancel(@PathVariable String orderId) {
        OrderEntity order = tradingCoreService.cancelOrder(orderId);
        return new OrderCancellationResponse(order.getOrderId(), order.getStatus(), order.getTimestamp());
    }
}
