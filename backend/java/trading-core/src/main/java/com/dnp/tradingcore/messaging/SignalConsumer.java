package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.domain.Signal;
import com.dnp.tradingcore.dto.SignalMessage;
import com.dnp.tradingcore.service.ServiceHealthTracker;
import com.dnp.tradingcore.service.TradingCoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component
public class SignalConsumer {
    private final ObjectMapper objectMapper;
    private final ServiceHealthTracker serviceHealthTracker;
    private final TradingCoreService tradingCoreService;

    public SignalConsumer(
            ObjectMapper objectMapper,
            ServiceHealthTracker serviceHealthTracker,
            TradingCoreService tradingCoreService
    ) {
        this.objectMapper = objectMapper;
        this.serviceHealthTracker = serviceHealthTracker;
        this.tradingCoreService = tradingCoreService;
    }

    @KafkaListener(topics = "${app.kafka.topics.signals}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        serviceHealthTracker.markKafkaMessage(ServiceHealthTracker.STRATEGY_SERVICE);
        SignalMessage message = fromPayload(payload);

        Signal signal = new Signal(
                safeId(message.signalId()),
                message.symbol(),
                message.side(),
                defaultQuantity(message.quantity()),
                defaultPrice(message.targetPrice()),
                message.reason(),
                message.timestamp()
        );

        tradingCoreService.processSignal(signal);
    }

    private SignalMessage fromPayload(String payload) {
        try {
            return objectMapper.readValue(payload, SignalMessage.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid signal payload", e);
        }
    }

    private String safeId(String signalId) {
        return signalId != null && !signalId.isBlank() ? signalId : "sig-" + UUID.randomUUID();
    }

    private BigDecimal defaultQuantity(BigDecimal quantity) {
        return quantity != null ? quantity : BigDecimal.ONE;
    }

    private BigDecimal defaultPrice(BigDecimal price) {
        return price != null ? price : BigDecimal.ZERO;
    }
}
