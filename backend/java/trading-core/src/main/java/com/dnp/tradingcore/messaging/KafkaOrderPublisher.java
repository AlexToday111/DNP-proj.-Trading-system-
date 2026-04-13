package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.domain.Order;
import com.dnp.tradingcore.dto.OrderMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaOrderPublisher implements OrderPublisher {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String ordersTopic;

    public KafkaOrderPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${app.kafka.topics.orders}") String ordersTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.ordersTopic = ordersTopic;
    }

    @Override
    public void publish(Order order) {
        OrderMessage message = new OrderMessage(
                order.orderId(),
                order.signalId(),
                order.symbol(),
                order.side(),
                order.quantity(),
                order.requestedPrice(),
                order.timestamp()
        );

        try {
            kafkaTemplate.send(ordersTopic, order.orderId(), objectMapper.writeValueAsString(message));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize order message", e);
        }
    }
}
