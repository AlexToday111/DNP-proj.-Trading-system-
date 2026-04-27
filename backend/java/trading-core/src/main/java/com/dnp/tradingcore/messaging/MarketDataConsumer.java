package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.dto.MarketDataMessage;
import com.dnp.tradingcore.service.ServiceHealthTracker;
import com.dnp.tradingcore.service.TradingCoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MarketDataConsumer {
    private final ObjectMapper objectMapper;
    private final ServiceHealthTracker serviceHealthTracker;
    private final TradingCoreService tradingCoreService;

    public MarketDataConsumer(
            ObjectMapper objectMapper,
            ServiceHealthTracker serviceHealthTracker,
            TradingCoreService tradingCoreService
    ) {
        this.objectMapper = objectMapper;
        this.serviceHealthTracker = serviceHealthTracker;
        this.tradingCoreService = tradingCoreService;
    }

    @KafkaListener(topics = "${app.kafka.topics.market-data}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        serviceHealthTracker.markKafkaMessage(ServiceHealthTracker.MARKET_DATA_SERVICE);
        tradingCoreService.processMarketData(fromPayload(payload));
    }

    private MarketDataMessage fromPayload(String payload) {
        try {
            return objectMapper.readValue(payload, MarketDataMessage.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid market-data payload", e);
        }
    }
}
