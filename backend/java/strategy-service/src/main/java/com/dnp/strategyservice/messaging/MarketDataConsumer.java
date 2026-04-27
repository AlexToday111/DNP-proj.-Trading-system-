package com.dnp.strategyservice.messaging;

import com.dnp.strategyservice.dto.MarketDataMessage;
import com.dnp.strategyservice.service.StrategyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MarketDataConsumer {
    private final ObjectMapper objectMapper;
    private final StrategyService strategyService;

    public MarketDataConsumer(ObjectMapper objectMapper, StrategyService strategyService) {
        this.objectMapper = objectMapper;
        this.strategyService = strategyService;
    }

    @KafkaListener(topics = "${app.kafka.topics.market-data}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        strategyService.processMarketData(fromPayload(payload));
    }

    private MarketDataMessage fromPayload(String payload) {
        try {
            return objectMapper.readValue(payload, MarketDataMessage.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid market-data payload", e);
        }
    }
}
