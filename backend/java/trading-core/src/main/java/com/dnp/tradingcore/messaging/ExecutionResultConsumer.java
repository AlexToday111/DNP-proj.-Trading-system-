package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.domain.ExecutionResult;
import com.dnp.tradingcore.dto.ExecutionResultMessage;
import com.dnp.tradingcore.service.ServiceHealthTracker;
import com.dnp.tradingcore.service.TradingCoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ExecutionResultConsumer {
    private final ObjectMapper objectMapper;
    private final ServiceHealthTracker serviceHealthTracker;
    private final TradingCoreService tradingCoreService;

    public ExecutionResultConsumer(
            ObjectMapper objectMapper,
            ServiceHealthTracker serviceHealthTracker,
            TradingCoreService tradingCoreService
    ) {
        this.objectMapper = objectMapper;
        this.serviceHealthTracker = serviceHealthTracker;
        this.tradingCoreService = tradingCoreService;
    }

    @KafkaListener(topics = "${app.kafka.topics.execution-result}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        serviceHealthTracker.markKafkaMessage(ServiceHealthTracker.EXECUTION_SIM_SERVICE);
        ExecutionResultMessage message = fromPayload(payload);

        ExecutionResult result = new ExecutionResult(
                message.executionId(),
                message.orderId(),
                message.symbol(),
                message.side(),
                message.quantity(),
                message.executedPrice(),
                message.status(),
                message.marketDataEventId(),
                message.priceTimestamp(),
                message.timestamp()
        );

        tradingCoreService.processExecutionResult(result);
    }

    private ExecutionResultMessage fromPayload(String payload) {
        try {
            return objectMapper.readValue(payload, ExecutionResultMessage.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid execution-result payload", e);
        }
    }
}
