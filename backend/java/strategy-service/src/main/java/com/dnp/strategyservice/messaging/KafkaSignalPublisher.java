package com.dnp.strategyservice.messaging;

import com.dnp.strategyservice.dto.SignalMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaSignalPublisher implements SignalPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String signalsTopic;

    public KafkaSignalPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${app.kafka.topics.signals}") String signalsTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.signalsTopic = signalsTopic;
    }

    @Override
    public void publish(SignalMessage signal) {
        try {
            kafkaTemplate.send(signalsTopic, signal.signalId(), objectMapper.writeValueAsString(signal));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize signal message", e);
        }
    }
}
