package com.dnp.tradingcore.messaging;

import com.dnp.tradingcore.domain.Order;

public interface OrderPublisher {
    void publish(Order order);
}
