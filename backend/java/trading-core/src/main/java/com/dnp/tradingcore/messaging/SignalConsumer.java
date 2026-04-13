package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.domain.Signal;
import com.dnp.tradingcore.dto.SignalMessage;
import com.dnp.tradingcore.service.TradingCoreService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class SignalConsumer {
    private final ObjectMapper objectMapper;
    private final TradingCoreService tradingCoreService;

    public SignalConsumer(ObjectMapper objectMapper, TradingCoreService tradingCoreService) {
        this.objectMapper = objectMapper;
        this.tradingCoreService = tradingCoreService;
    }

    @KafkaListener(topics = "${app.kafka.topics.signals}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        SignalMessage message = fromPayload(payload);

        Signal signal = new Signal(
                message.signalId(),
                message.symbol(),
                message.side(),
                message.quantity(),
                message.targetPrice(),
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
}
